import { useState, useEffect } from 'preact/hooks';

export default function CookieBanner() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('apuntesdev_cookie_consent');
      if (!consent) {
        // Retraso de 1 segundo para no tapar la carga inicial
        const timer = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignorar en entornos restringidos
    }

    // Escuchar si el usuario quiere reabrir el banner desde el pie de página
    const handleReopen = () => setVisible(true);
    window.addEventListener('abrir-configuracion-cookies', handleReopen);
    return () => window.removeEventListener('abrir-configuracion-cookies', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('apuntesdev_cookie_consent', 'accepted');
    } catch (e) {}
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('apuntesdev_cookie_consent', 'essential_only');
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-banner-wrapper" aria-label="Consentimiento de cookies" role="dialog">
      <div className="cookie-banner-inner">
        <div className="cookie-content">
          <div className="cookie-title-row">
            <span className="cookie-icon">🍪</span>
            <span className="cookie-title">Privacidad y Cookies en ApuntesDev</span>
          </div>
          <p className="cookie-desc">
            Utilizamos cookies técnicas necesarias para guardar tu progreso de estudio y temas visuales, así como cookies publicitarias de terceros (Google AdSense) para financiar la gratuidad del portal mediante anuncios contextuales según el RGPD.{' '}
            <a href="/cookies" className="cookie-link">Más información en nuestra Política de Cookies</a>.
          </p>
        </div>

        <div className="cookie-actions">
          <button 
            type="button" 
            onClick={handleRejectNonEssential} 
            className="btn-cookie btn-cookie--secondary"
            title="Solo permitir cookies estrictamente técnicas"
          >
            Solo Necesarias
          </button>
          <button 
            type="button" 
            onClick={handleAcceptAll} 
            className="btn-cookie btn-cookie--primary"
            title="Aceptar todas las cookies incluidas las de Google AdSense"
          >
            Aceptar Todas
          </button>
        </div>
      </div>

      <style>{`
        .cookie-banner-wrapper {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2rem);
          max-width: 960px;
          z-index: 99999;
          animation: slideUpCookie 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUpCookie {
          from {
            opacity: 0;
            transform: translate(-50%, 30px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .cookie-banner-inner {
          background: rgba(12, 14, 22, 0.96);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 16px;
          padding: 1.4rem 1.8rem;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(74, 222, 128, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .cookie-content {
          flex: 1;
          min-width: 280px;
        }

        .cookie-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .cookie-icon {
          font-size: 1.2rem;
        }

        .cookie-title {
          font-weight: 800;
          color: #ffffff;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
        }

        .cookie-desc {
          margin: 0;
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.55;
        }

        .cookie-link {
          color: var(--accent-color);
          text-decoration: underline;
          text-underline-offset: 2px;
          font-weight: 600;
        }

        .cookie-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .btn-cookie {
          padding: 0.65rem 1.25rem;
          border-radius: 10px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .btn-cookie--secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
        }

        .btn-cookie--secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .btn-cookie--primary {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
          border: none;
          color: #060809;
          box-shadow: 0 4px 15px var(--accent-glow);
        }

        .btn-cookie--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        @media (max-width: 768px) {
          .cookie-banner-inner {
            padding: 1.2rem;
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .cookie-actions {
            width: 100%;
            justify-content: stretch;
          }

          .btn-cookie {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </aside>
  );
}
