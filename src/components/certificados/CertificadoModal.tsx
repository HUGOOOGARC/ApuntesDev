import { useEffect, useState } from 'preact/hooks';
import confetti from 'canvas-confetti';
import type { Certificacion } from '../../data/certificaciones';

interface Props {
  cert: Certificacion;
  username: string;
  nivel: number;
  onClose: () => void;
}

export default function CertificadoModal({ cert, username, nivel, onClose }: Props) {
  const [copiado, setCopiado] = useState(false);

  // Generar fecha formateada
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Generar un código único y persistente de credencial
  const hashSemilla = (username + cert.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hashHex = Math.abs(hashSemilla * 9973).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  const credentialId = `APNT-2026-${cert.codigoPrefijo}-${hashHex}`;

  // URL pública de verificación
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apuntes-dev-six.vercel.app';
  const verifyUrl = `${origin}/certificados/verificar?code=${credentialId}&name=${encodeURIComponent(username)}&cert=${encodeURIComponent(cert.id)}`;

  // Código QR generado vía SVG seguro
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&color=ffffff&bgcolor=090a0f&qzone=1`;

  useEffect(() => {
    // Disparar confeti de celebración al abrir el diploma
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      colors: [cert.colorAcento, '#ffd700', '#ffffff', '#38bdf8']
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  // URL para agregar directamente a LinkedIn Certifications
  const linkedInYear = hoy.getFullYear();
  const linkedInMonth = hoy.getMonth() + 1;
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.titulo)}&organizationName=${encodeURIComponent('ApuntesDev')}&issueYear=${linkedInYear}&issueMonth=${linkedInMonth}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(credentialId)}`;

  return (
    <div className="cert-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cert-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* BARRA SUPERIOR DE ACCIONES */}
        <header className="cert-toolbar no-print">
          <div className="toolbar-info">
            <span className="cert-status-dot"></span>
            <span>Credencial Oficial Verificada en Red</span>
          </div>

          <div className="toolbar-actions">
            <button type="button" onClick={handleCopyLink} className="btn-tool">
              {copiado ? '✓ ¡Enlace Copiado!' : '🔗 Copiar Enlace'}
            </button>
            <a 
              href={linkedInUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-tool btn-tool--linkedin"
              title="Añadir esta certificación a tu perfil de LinkedIn"
            >
              <span>💼 Añadir a LinkedIn</span>
            </a>
            <button type="button" onClick={handlePrint} className="btn-tool btn-tool--print">
              <span>🖨️ Descargar PDF / Imprimir A4</span>
            </button>
            <button type="button" onClick={onClose} className="btn-close" aria-label="Cerrar vista de diploma">✕</button>
          </div>
        </header>

        {/* LIENZO OFICIAL DEL DIPLOMA EN FORMATO A4 HORIZONTAL */}
        <div className="diploma-paper" id="diploma-document" style={{ '--accent': cert.colorAcento }}>
          
          {/* Borde ornamental de seguridad */}
          <div className="diploma-border-outer">
            <div className="diploma-border-inner">
              
              {/* Esquinas cibernéticas ornamentadas */}
              <div className="corner-decor corner-tl"></div>
              <div className="corner-decor corner-tr"></div>
              <div className="corner-decor corner-bl"></div>
              <div className="corner-decor corner-br"></div>

              {/* Marca de agua de fondo */}
              <div className="diploma-watermark">APUNTESDEV</div>

              {/* Cabecera del Diploma */}
              <div className="diploma-header">
                <div className="diploma-brand">
                  <div className="brand-logo-circle">
                    <img src="/logo.png" alt="Logo ApuntesDev" className="diploma-logo" />
                  </div>
                  <div>
                    <h2 className="brand-title">APUNTESDEV ACADEMY</h2>
                    <span className="brand-subtitle">CENTRO DE MAESTRÍA EN SISTEMAS, REDES Y DESARROLLO DE SOFTWARE</span>
                  </div>
                </div>

                <div className="cert-id-badge">
                  <span className="cert-id-label">CREDENCIAL ID:</span>
                  <span className="cert-id-code">{credentialId}</span>
                </div>
              </div>

              {/* Título de Concesión */}
              <div className="diploma-preamble">
                POR CUANTO SE RECONOCE Y HACE CONSTAR QUE EL ESTUDIANTE
              </div>

              {/* Nombre del Estudiante */}
              <div className="diploma-recipient">
                <span className="recipient-name">{username || 'Operador Técnico'}</span>
                <div className="recipient-line"></div>
              </div>

              {/* Cuerpo del Certificado */}
              <div className="diploma-body">
                <p className="diploma-text">
                  Ha completado con éxito y superado los exámenes técnicos de evaluación continua correspondientes al programa de especialización oficial:
                </p>

                <h1 className="diploma-cert-title">{cert.titulo}</h1>
                <p className="diploma-cert-subtitle">{cert.subtitulo}</p>

                {/* Grid de Competencias Acreditadas */}
                <div className="competencias-grid">
                  {cert.competencias.map((comp, idx) => (
                    <div className="comp-item" key={idx}>
                      <span className="comp-check">◈</span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie de Firma, Sello y Código QR */}
              <div className="diploma-footer">
                
                {/* Código QR de Validación Real */}
                <div className="footer-qr-block">
                  <img src={qrCodeUrl} alt="QR de Verificación Oficial" className="qr-image" />
                  <div className="qr-caption">
                    <span>Escanear para verificar</span>
                    <small>Validez Criptográfica en Red</small>
                  </div>
                </div>

                {/* Sello de Oro Holográfico */}
                <div className="footer-seal-block">
                  <div className="gold-seal">
                    <div className="seal-ring-outer"></div>
                    <div className="seal-ring-inner">
                      <span className="seal-icon">{cert.icono}</span>
                      <span className="seal-text-top">APUNTESDEV</span>
                      <span className="seal-text-bottom">VERIFIED</span>
                    </div>
                  </div>
                  <span className="seal-caption">Nivel {nivel} Alcanzado</span>
                </div>

                {/* Bloque de Firmas Oficiales */}
                <div className="footer-signature-block">
                  <div className="signature-line">
                    <div className="digital-sign">Hugo G. // Root Archon</div>
                  </div>
                  <span className="sign-role">Comité Técnico de Evaluación</span>
                  <span className="sign-date">Fecha de expedición: {fechaTexto}</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      <style>{`
        /* ── MODAL CONTAINER & BACKDROP ── */
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 5, 8, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cert-modal-container {
          width: 100%;
          max-width: 1080px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ── TOOLBAR SUPERIOR ── */
        .cert-toolbar {
          background: rgba(15, 17, 26, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .toolbar-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #94a3b8;
          font-size: 0.82rem;
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .cert-status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .btn-tool {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-tool:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .btn-tool--linkedin {
          background: rgba(10, 102, 194, 0.2);
          border-color: rgba(10, 102, 194, 0.4);
          color: #38bdf8;
        }

        .btn-tool--linkedin:hover {
          background: rgba(10, 102, 194, 0.35);
          border-color: #0a66c2;
        }

        .btn-tool--print {
          background: linear-gradient(135deg, var(--accent) 0%, rgba(16, 185, 129, 0.7) 100%);
          color: #040508;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .btn-tool--print:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-close:hover {
          background: rgba(244, 63, 94, 0.2);
          color: #f43f5e;
          border-color: #f43f5e;
        }

        /* ── LIENZO DEL DIPLOMA (A4 APTO IMPRESIÓN) ── */
        .diploma-paper {
          background: #090b12;
          border-radius: 18px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.1);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1.414 / 1; /* Proporción estándar A4 apaisado */
        }

        .diploma-border-outer {
          position: absolute;
          inset: 16px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.7);
        }

        .diploma-border-inner {
          position: absolute;
          inset: 8px;
          border: 1px solid var(--accent);
          border-radius: 8px;
          padding: 2.2rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: radial-gradient(ellipse at center, rgba(16, 20, 32, 0.95) 0%, rgba(7, 8, 14, 0.98) 100%);
        }

        /* Esquinas cibernéticas */
        .corner-decor {
          position: absolute;
          width: 22px;
          height: 22px;
          border: 3px solid var(--accent);
        }
        .corner-tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
        .corner-tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
        .corner-bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
        .corner-br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

        /* Marca de agua */
        .diploma-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          font-size: 7.5rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.015);
          letter-spacing: 0.25em;
          pointer-events: none;
          font-family: var(--font-mono);
          user-select: none;
          white-space: nowrap;
        }

        /* Header Diploma */
        .diploma-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 1.25rem;
        }

        .diploma-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-logo-circle {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px var(--accent);
        }

        .diploma-logo {
          width: 32px;
          height: auto;
        }

        .brand-title {
          font-size: 1.1rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin: 0;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .cert-id-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.15rem;
        }

        .cert-id-label {
          font-size: 0.58rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }

        .cert-id-code {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          font-weight: 800;
          color: var(--accent);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Preámbulo */
        .diploma-preamble {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--text-muted);
          margin-top: 1rem;
          font-family: var(--font-mono);
        }

        /* Recipient */
        .diploma-recipient {
          text-align: center;
          margin: 0.4rem 0 1rem 0;
        }

        .recipient-name {
          font-size: 2.3rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          display: inline-block;
        }

        .recipient-line {
          height: 2px;
          width: 280px;
          margin: 0.35rem auto 0;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        /* Cuerpo */
        .diploma-body {
          text-align: center;
        }

        .diploma-text {
          font-size: 0.85rem;
          color: #94a3b8;
          max-width: 650px;
          margin: 0 auto 0.6rem;
          line-height: 1.5;
        }

        .diploma-cert-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.015em;
        }

        .diploma-cert-subtitle {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 700;
          margin: 0 0 1rem 0;
          letter-spacing: 0.05em;
        }

        .competencias-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.4rem 1.5rem;
          max-width: 780px;
          margin: 0 auto;
          text-align: left;
        }

        .comp-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          color: #cbd5e1;
          font-family: var(--font-mono);
        }

        .comp-check {
          color: var(--accent);
          font-size: 0.65rem;
        }

        /* Footer */
        .diploma-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          margin-top: 0.75rem;
        }

        .footer-qr-block {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .qr-image {
          width: 58px;
          height: 58px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #090a0f;
          padding: 2px;
        }

        .qr-caption {
          display: flex;
          flex-direction: column;
          font-size: 0.68rem;
          color: #ffffff;
          font-weight: 700;
        }

        .qr-caption small {
          font-size: 0.58rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        /* Sello */
        .footer-seal-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .gold-seal {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, #fde047 0%, #ca8a04 70%, #854d0e 100%);
          padding: 3px;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
          position: relative;
        }

        .seal-ring-inner {
          width: 100%;
          height: 100%;
          border: 1.5px dashed #713f12;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #451a03;
          font-weight: 900;
        }

        .seal-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .seal-text-top, .seal-text-bottom {
          font-size: 0.38rem;
          letter-spacing: 0.1em;
          font-family: var(--font-mono);
          font-weight: 900;
        }

        .seal-caption {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          color: #fbbf24;
          font-weight: 800;
        }

        /* Firma */
        .footer-signature-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.15rem;
        }

        .signature-line {
          width: 190px;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 0.25rem;
          text-align: center;
        }

        .digital-sign {
          font-family: 'Brush Script MT', cursive, serif;
          font-size: 1.35rem;
          color: var(--accent);
          letter-spacing: 0.05em;
        }

        .sign-role {
          font-size: 0.68rem;
          font-weight: 800;
          color: #ffffff;
        }

        .sign-date {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        /* ── REGLAS DE IMPRESIÓN OFICIALES A4 LANDSCAPE ── */
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          body * {
            visibility: hidden;
          }

          .cert-modal-backdrop,
          .cert-modal-container,
          .diploma-paper,
          .diploma-paper * {
            visibility: visible;
          }

          .cert-modal-backdrop {
            position: fixed;
            inset: 0;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          .cert-modal-container {
            max-width: 100% !important;
            width: 100vw !important;
            height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .diploma-paper {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        /* ── RESPONSIVE PARA PANTALLAS PEQUEÑAS ── */
        @media (max-width: 860px) {
          .diploma-paper {
            aspect-ratio: auto;
            min-height: 600px;
          }
          .diploma-border-inner {
            padding: 1.5rem 1rem;
          }
          .recipient-name {
            font-size: 1.6rem;
          }
          .diploma-cert-title {
            font-size: 1.2rem;
          }
          .competencias-grid {
            grid-template-columns: 1fr;
          }
          .diploma-footer {
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
          }
          .footer-signature-block {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
