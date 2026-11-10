import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/**
 * Inicia Lenis Smooth Scroll con soporte para Astro View Transitions
 */
export function initLenis() {
  // Evitar en usuarios con preferencias de movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Destruir instancia previa si existe (al cambiar de página)
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/**
 * Inicializa el efecto Glow Spotlight 3D Tilt en tarjetas interactivas
 */
export function initSpotlightTilt() {
  const cards = document.querySelectorAll<HTMLElement>('.spotlight-card, .feature-tile, .ruta-card, .rival-card, .item-card');

  cards.forEach((card) => {
    // Evitar bind duplicado
    if (card.dataset.spotlightBound === 'true') return;
    card.dataset.spotlightBound = 'true';

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Coordenadas CSS para el gradiente radial reflectante
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Inclinación 3D sutil (máximo 6 grados para no cansar la vista)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/**
 * Botones Magnéticos para CTAs de impacto ("Empezar a Estudiar", "Jugar Duelo", "Comprar")
 */
export function initMagneticButtons() {
  const magneticElements = document.querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]');

  magneticElements.forEach((btn) => {
    if (btn.dataset.magneticBound === 'true') return;
    btn.dataset.magneticBound = 'true';

    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Factor de atracción magnética suave
      const magnetStrength = 0.28;
      btn.style.transform = `translate(${x * magnetStrength}px, ${y * magnetStrength}px) scale(1.03)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });
}

/**
 * Escudo protector anti-CLS para Google AdSense
 */
export function initAdSenseShield() {
  const adHolders = document.querySelectorAll<HTMLElement>('.adsense-slot-shield');
  adHolders.forEach((holder) => {
    // Si ya contiene un iframe de AdSense cargado, ocultar skeleton
    const hasLoadedAd = holder.querySelector('iframe, ins.adsbygoogle[data-ad-status="filled"]');
    if (hasLoadedAd) {
      holder.classList.add('ad-filled');
    }
  });
}

/**
 * Inicializador global compatible con Astro View Transitions
 */
export function setupNextGenInteractions() {
  initLenis();
  initSpotlightTilt();
  initMagneticButtons();
  initAdSenseShield();
}
