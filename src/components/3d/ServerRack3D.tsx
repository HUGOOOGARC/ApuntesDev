import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

interface ServerRackProps {
  interactive?: boolean;
}

export default function ServerRack3D({ interactive = true }: ServerRackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if mobile or low-power device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // --- 1. LIGHTWEIGHT THREE.JS RENDERER ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080c, 0.08);

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.3, 4.3);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'default',
    });
    renderer.setSize(width, height);
    // Limit pixel ratio to 1.25 to prevent 4K/Retina GPU thermal throttling
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    // Shadows disabled for maximum 60-120fps performance
    renderer.shadowMap.enabled = false;

    container.appendChild(renderer.domElement);

    // --- 2. GET DYNAMIC THEME COLOR ---
    const getAccentColor = (): THREE.Color => {
      const style = getComputedStyle(document.documentElement);
      const colorStr = style.getPropertyValue('--accent-color').trim() || '#10b981';
      return new THREE.Color(colorStr);
    };

    let accentColor = getAccentColor();

    // --- 3. EFFICIENT LIGHTING RIG (NO SHADOW PASSES) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2.5, 4, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(accentColor, 3.5, 6);
    rimLight.position.set(-2, 1.2, 1.5);
    scene.add(rimLight);

    // --- 4. SERVER CHASSIS GEOMETRY ---
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    // Outer Frame (Metallic Anodized Dark)
    const rackFrameGeo = new THREE.BoxGeometry(1.56, 2.75, 1.15);
    const rackFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      metalness: 0.88,
      roughness: 0.32,
    });
    const rackFrame = new THREE.Mesh(rackFrameGeo, rackFrameMat);
    rackGroup.add(rackFrame);

    // Side Rails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x1f2432,
      metalness: 0.9,
      roughness: 0.25,
    });
    const railGeo = new THREE.BoxGeometry(0.05, 2.72, 0.07);

    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-0.74, 0, 0.56);
    rackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(0.74, 0, 0.56);
    rackGroup.add(rightRail);

    // --- 5. SERVER BLADES WITH SHARED MATERIALS (HIGH BATCHING) ---
    const bladeCount = 8;
    const bladeHeight = 0.26;
    const bladeSpacing = 0.3;

    const bladeFaceMat = new THREE.MeshStandardMaterial({
      color: 0x161922,
      metalness: 0.8,
      roughness: 0.35,
    });

    const ventMat = new THREE.MeshBasicMaterial({ color: 0x07090e });

    // Shared high-efficiency LED materials (Only 3 materials instead of 60!)
    const ledAccentMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const ledCyanMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ledAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const sharedLedGeo = new THREE.BoxGeometry(0.026, 0.026, 0.015);

    const ledObjects: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; speed: number; phase: number }[] = [];

    for (let i = 0; i < bladeCount; i++) {
      const yPos = 1.05 - i * bladeSpacing;
      const bladeGroup = new THREE.Group();
      bladeGroup.position.set(0, yPos, 0.58);

      // Blade Front Face
      const faceGeo = new THREE.BoxGeometry(1.42, bladeHeight, 0.03);
      const face = new THREE.Mesh(faceGeo, bladeFaceMat);
      bladeGroup.add(face);

      // Air Intake Strip
      const ventGeo = new THREE.PlaneGeometry(0.7, bladeHeight * 0.5);
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(-0.25, 0, 0.02);
      bladeGroup.add(vent);

      // 4 LEDs per blade (32 total, sharing 3 materials)
      for (let j = 0; j < 4; j++) {
        let mat = ledAccentMat;
        if (j === 1 || j === 2) mat = ledCyanMat;
        if (j === 3) mat = ledAmberMat;

        const led = new THREE.Mesh(sharedLedGeo, mat);
        led.position.set(0.3 + j * 0.075, 0.015, 0.02);
        bladeGroup.add(led);

        ledObjects.push({
          mesh: led,
          mat,
          speed: 1.5 + (i * 0.3 + j * 0.4),
          phase: (i + j) * 0.7,
        });
      }

      rackGroup.add(bladeGroup);
    }

    // Ground Hologram Ring
    const ringGeo = new THREE.RingGeometry(1.3, 1.34, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.5;
    scene.add(ring);

    // --- 6. MOUSE PARALLAX & TILT (SMOOTH INTERPOLATION) ---
    let targetRotationX = 0.06;
    let targetRotationY = -0.32;
    let currentRotationX = 0.06;
    let currentRotationY = -0.32;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = -0.32 + normX * 0.35;
      targetRotationX = 0.06 - normY * 0.2;
    };

    const handleMouseLeave = () => {
      targetRotationX = 0.06;
      targetRotationY = -0.32;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // --- 7. THEME COLOR REACTIVITY ---
    const updateThemeColors = () => {
      const newColor = getAccentColor();
      accentColor = newColor;
      rimLight.color.copy(newColor);
      ringMat.color.copy(newColor);
      ledAccentMat.color.copy(newColor);
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          updateThemeColors();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    // --- 8. SMART INTERSECTION & VISIBILITY OBSERVER (0% CPU/GPU OFFSCREEN) ---
    let isVisible = true;
    let isTabActive = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // --- 9. RENDER LOOP OPTIMIZADO (BAJO CONSUMO) ---
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Si no es visible o la pestaña está oculta, omitir el frame
      if (!isVisible || !isTabActive) return;

      // Limitar a máximo 60 FPS en pantallas ProMotion/144Hz para no saturar la GPU
      const delta = time - lastTime;
      if (delta < 15) return; // ~60fps cap
      lastTime = time;

      const seconds = time * 0.001;

      // Rotación suave
      currentRotationX += (targetRotationX - currentRotationX) * 0.07;
      currentRotationY += (targetRotationY - currentRotationY) * 0.07;

      rackGroup.rotation.x = currentRotationX;
      rackGroup.rotation.y = currentRotationY;
      rackGroup.position.y = Math.sin(seconds * 1.2) * 0.035;

      ring.rotation.z = seconds * 0.15;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- 10. RESIZE OPTIMIZADO ---
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW === 0 || newH === 0) return;

        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
      io.disconnect();
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      scene.clear();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="server-rack-viewport relative w-full h-[500px] md:h-[540px] flex items-center justify-center select-none">
      {!isMobile ? (
        <div
          ref={containerRef}
          className="three-canvas-container w-full h-full cursor-grab active:cursor-grabbing"
          title="Servidor Rack Blade 42U • Mueve el ratón para orbitar"
        />
      ) : (
        <div className="mobile-rack-fallback flex flex-col items-center justify-center p-6 text-center">
          <div className="rack-chassis-graphic relative w-56 h-80 rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141f] to-[#07090e] p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="rack-top-leds flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                42U CLOUD BLADE
              </span>
              <span className="text-[10px] font-mono text-slate-400">RACK #01</span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="blade-slot h-7 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-between px-2.5"
                >
                  <span className="text-[9px] font-mono text-slate-400">SLOT_{num}</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rack-bottom-status pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex justify-between">
              <span>TELNET: 22/SSH</span>
              <span className="text-emerald-400">100% HEALTH</span>
            </div>
          </div>
        </div>
      )}

      {/* Telemetría compacta en esquina */}
      <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex flex-col gap-1.5">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>42U BLADE • WEBGL2</span>
        </div>
      </div>
    </div>
  );
}
