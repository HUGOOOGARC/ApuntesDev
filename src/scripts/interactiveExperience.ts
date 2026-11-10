import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/**
 * Inicia Lenis Smooth Scroll optimizado (solo en desktop con puntero preciso)
 */
export function initLenis() {
  // Evitar en móviles, tablets y preferencias de movimiento reducido
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReduced) {
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    return;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  try {
    lenisInstance = new Lenis({
      duration: 0.75, // Rápido y reactivo, sin sensación de pesadez ni lag
      easing: (t) => 1 - Math.pow(1 - t, 3), // Curva cubic out natural
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    let animationId: number;
    function raf(time: number) {
      lenisInstance?.raf(time);
      animationId = requestAnimationFrame(raf);
    }
    animationId = requestAnimationFrame(raf);
  } catch (err) {
    console.warn('Lenis falló al iniciar, usando scroll nativo:', err);
  }
}

/**
 * Inicializa el efecto Glow Spotlight 3D Tilt con caché de layout (cero layout-thrashing)
 */
export function initSpotlightTilt() {
  // Solo en dispositivos con ratón real
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll<HTMLElement>('.spotlight-card, .feature-tile, .ruta-card, .rival-card, .item-card');

  cards.forEach((card) => {
    if (card.dataset.spotlightBound === 'true') return;
    card.dataset.spotlightBound = 'true';

    let rect: DOMRect | null = null;
    let ticking = false;

    // Cachear dimensiones al entrar (evita getBoundingClientRect en cada pixel)
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', (e: MouseEvent) => {
      if (!rect || ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (!rect) {
          ticking = false;
          return;
        }

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x.toFixed(0)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(0)}px`);

        // Inclinación 3D sutil (máximo 4 grados para no sobrecargar composición)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateY(-2px)`;
        ticking = false;
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }, { passive: true });
  });
}

/**
 * Botones Magnéticos optimizados
 */
export function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticElements = document.querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]');

  magneticElements.forEach((btn) => {
    if (btn.dataset.magneticBound === 'true') return;
    btn.dataset.magneticBound = 'true';

    let rect: DOMRect | null = null;
    let ticking = false;

    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    }, { passive: true });

    btn.addEventListener('mousemove', (e: MouseEvent) => {
      if (!rect || ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (!rect) {
          ticking = false;
          return;
        }
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        btn.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`;
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      rect = null;
      btn.style.transform = 'translate(0px, 0px)';
    }, { passive: true });
  });
}

/**
 * Escudo protector anti-CLS para Google AdSense
 */
export function initAdSenseShield() {
  const adHolders = document.querySelectorAll<HTMLElement>('.adsense-slot-shield');
  adHolders.forEach((holder) => {
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
