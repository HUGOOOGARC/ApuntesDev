import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';

interface ServerRackProps {
  interactive?: boolean;
}

export default function ServerRack3D({ interactive = true }: ServerRackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [serverActivity, setServerActivity] = useState<string>('ONLINE • 42U ACTIVE');
  const [hoveredBlade, setHoveredBlade] = useState<string | null>(null);

  useEffect(() => {
    // Check if mobile or low-power device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) {
      return; // Fallback to CSS 3D for low-power mobile
    }

    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080c, 0.08);

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. GET DYNAMIC THEME COLOR ---
    const getAccentColor = (): THREE.Color => {
      const style = getComputedStyle(document.documentElement);
      const colorStr = style.getPropertyValue('--accent-color').trim() || '#10b981';
      return new THREE.Color(colorStr);
    };

    let accentColor = getAccentColor();

    // --- 3. LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Top Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Dynamic Colored Accent Rim Light (matches current theme)
    const rimLight = new THREE.PointLight(accentColor, 4.5, 8);
    rimLight.position.set(-2.5, 1.5, 1.8);
    scene.add(rimLight);

    // Floor Reflection Spotlight
    const underGlow = new THREE.PointLight(accentColor, 2.8, 5);
    underGlow.position.set(0, -1.8, 0.5);
    scene.add(underGlow);

    // --- 4. PROCEDURAL SERVER CHASSIS GEOMETRY ---
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    // Metallic Chassis Outer Frame (42U Server Rack)
    const rackFrameGeo = new THREE.BoxGeometry(1.6, 2.8, 1.2);
    const rackFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      metalness: 0.92,
      roughness: 0.28,
    });
    const rackFrame = new THREE.Mesh(rackFrameGeo, rackFrameMat);
    rackFrame.castShadow = true;
    rackFrame.receiveShadow = true;
    rackGroup.add(rackFrame);

    // Side Rails (Brushed Metallic Titanium)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      metalness: 0.95,
      roughness: 0.2,
    });
    const railGeo = new THREE.BoxGeometry(0.06, 2.76, 0.08);

    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-0.76, 0, 0.58);
    rackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(0.76, 0, 0.58);
    rackGroup.add(rightRail);

    // Glass Side Panel with subtle tint and reflection
    const glassGeo = new THREE.BoxGeometry(0.02, 2.7, 1.15);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x070c14,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.2,
      transparent: true,
      opacity: 0.65,
    });
    const leftGlass = new THREE.Mesh(glassGeo, glassMat);
    leftGlass.position.set(-0.81, 0, 0);
    rackGroup.add(leftGlass);

    // --- 5. SERVER BLADES & ACTIVE NETWORK SLOTS ---
    const bladeCount = 10;
    const bladeHeight = 0.22;
    const bladeSpacing = 0.25;
    const leds: { mesh: THREE.Mesh; baseColor: THREE.Color; speed: number; phase: number }[] = [];

    const bladeFaceMat = new THREE.MeshStandardMaterial({
      color: 0x151821,
      metalness: 0.85,
      roughness: 0.35,
    });

    const ventMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
    });

    for (let i = 0; i < bladeCount; i++) {
      const yPos = 1.1 - i * bladeSpacing;
      const bladeGroup = new THREE.Group();
      bladeGroup.position.set(0, yPos, 0.61);

      // Blade Front Face
      const faceGeo = new THREE.BoxGeometry(1.44, bladeHeight, 0.04);
      const face = new THREE.Mesh(faceGeo, bladeFaceMat);
      bladeGroup.add(face);

      // Air Intake Hex Vent Strip
      const ventGeo = new THREE.PlaneGeometry(0.75, bladeHeight * 0.55);
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(-0.25, 0, 0.025);
      bladeGroup.add(vent);

      // Status Activity LEDs (Network Packet Simulators)
      const ledCount = 6;
      for (let j = 0; j < ledCount; j++) {
        const ledGeo = new THREE.BoxGeometry(0.028, 0.028, 0.015);
        
        // Colors: First 2 are theme-accent (power/network), 3-4 are activity cyan, 5-6 are data amber
        let ledColor = accentColor;
        if (j >= 2 && j <= 3) ledColor = new THREE.Color(0x38bdf8);
        if (j >= 4) ledColor = new THREE.Color(0xf59e0b);

        const ledMat = new THREE.MeshStandardMaterial({
          color: ledColor,
          emissive: ledColor,
          emissiveIntensity: 2.2,
          roughness: 0.1,
        });

        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0.32 + j * 0.065, 0.02, 0.025);
        bladeGroup.add(led);

        leds.push({
          mesh: led,
          baseColor: ledColor,
          speed: 1.5 + Math.random() * 4.5,
          phase: Math.random() * Math.PI * 2,
        });
      }

      rackGroup.add(bladeGroup);
    }

    // --- 6. HOLOGRAPHIC GROUND RING & PARTICLES ---
    const ringGeo = new THREE.RingGeometry(1.4, 1.44, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.55;
    scene.add(ring);

    // Outer grid ring
    const outerRingGeo = new THREE.RingGeometry(1.9, 1.92, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = -1.55;
    scene.add(outerRing);

    // Floating Data Dust Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: accentColor,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 7. MOUSE PARALLAX & TILT LOGIC ---
    let targetRotationX = 0.08;
    let targetRotationY = -0.35;
    let currentRotationX = 0.08;
    let currentRotationY = -0.35;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseX = normX;
      mouseY = normY;

      targetRotationY = -0.35 + normX * 0.45;
      targetRotationX = 0.08 - normY * 0.25;
    };

    const handleMouseLeave = () => {
      targetRotationX = 0.08;
      targetRotationY = -0.35;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // --- 8. THEME MUTATION OBSERVER (DYNAMIC REACTIVITY) ---
    const updateThemeColors = () => {
      const newColor = getAccentColor();
      accentColor = newColor;
      rimLight.color.copy(newColor);
      underGlow.color.copy(newColor);
      ringMat.color.copy(newColor);
      particleMat.color.copy(newColor);

      leds.forEach((item, idx) => {
        if (idx % 6 < 2) {
          (item.mesh.material as THREE.MeshStandardMaterial).color.copy(newColor);
          (item.mesh.material as THREE.MeshStandardMaterial).emissive.copy(newColor);
        }
      });
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          updateThemeColors();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    // --- 9. INTERSECTION OBSERVER (POWER SAVING 0% GPU OFF-SCREEN) ---
    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    // --- 10. ANIMATION LOOP WITH HARDWARE LEVITATION & PULSES ---
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Completely pause calculations when user scrolls away

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      rackGroup.rotation.x = currentRotationX;
      rackGroup.rotation.y = currentRotationY;

      // Realistic floating idle bobbing
      rackGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.04;

      // Rotate ground holographic ring
      ring.rotation.z = elapsedTime * 0.2;
      outerRing.rotation.z = -elapsedTime * 0.1;

      // Float data dust particles
      particles.rotation.y = elapsedTime * 0.05;

      // Blink status LEDs with realistic network packet jitter
      for (let i = 0; i < leds.length; i++) {
        const item = leds[i];
        const pulse = Math.sin(elapsedTime * item.speed + item.phase);
        const mat = item.mesh.material as THREE.MeshStandardMaterial;

        if (pulse > 0.4) {
          mat.emissiveIntensity = 2.8;
        } else if (pulse > -0.2) {
          mat.emissiveIntensity = 0.8;
        } else {
          mat.emissiveIntensity = 0.1; // dim standby
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 11. RESPONSIVE RESIZE ---
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP (NO WEBGL CONTEXT LEAKS) ---
    return () => {
      window.removeEventListener('resize', handleResize);
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
    <div className="server-rack-viewport relative w-full h-[540px] md:h-[600px] flex items-center justify-center select-none">
      {/* 3D CANVAS MOUNT */}
      {!isMobile ? (
        <div
          ref={containerRef}
          className="three-canvas-container w-full h-full cursor-grab active:cursor-grabbing"
          title="Servidor Rack Blade 42U Interactivo • Mueve el ratón para orbitar"
        />
      ) : (
        /* MOBILE FALLBACK: Ultra-efficient 60-120fps CSS 3D Parallax Card */
        <div className="mobile-rack-fallback flex flex-col items-center justify-center p-6 text-center">
          <div className="rack-chassis-graphic relative w-56 h-80 rounded-2xl border border-white/10 bg-gradient-to-b from-[#11141f] to-[#07090e] p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="rack-top-leds flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                42U CLOUD BLADE
              </span>
              <span className="text-[10px] font-mono text-slate-400">RACK #01</span>
            </div>

            {/* Simulated server blades */}
            <div className="flex flex-col gap-2 my-auto">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="blade-slot h-7 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-between px-2.5"
                >
                  <span className="text-[9px] font-mono text-slate-400">SLOT_{num}</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-150"></span>
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

      {/* FLOATING TELEMETRY HUD OVERLAYS */}
      <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex flex-col gap-2">
        <div className="hud-badge backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SISTEMA 3D: RACK BLADE 42U</span>
        </div>
        <div className="hud-badge backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-400 flex items-center gap-2 shadow-lg">
          <span className="text-slate-400">TELEMETRÍA:</span>
          <span>GPU WEBGL2 ACTIVE</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 backdrop-blur-md bg-black/30 border border-white/10 rounded-full px-3 py-1">
        <span>🔄 Órbita reactiva al puntero</span>
      </div>
    </div>
  );
}
