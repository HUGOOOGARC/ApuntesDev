import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { perfilStore, cargarPerfilDesdeSupabase } from '../../store/progreso';
import { supabase } from '../../lib/supabase';
import { CATALOGO_CERTIFICACIONES, type Certificacion } from '../../data/certificaciones';
import CertificadoModal from './CertificadoModal';

// Lista de apuntes por categoría para calcular el progreso exacto
const APUNTES_POR_CATEGORIA = {
  sistemas: [
    'comandos-linux-basicos',
    'estructura-directorios-linux-fhs',
    'gestion-paquetes-repositorios-linux',
    'permisos-linux-chmod-chown',
    'particionado-discos-sistemas-archivos-fstab',
    'gestion-procesos-servicios-systemd-linux',
    'scripting-bash-automatizacion-tareas-cron',
    'introduccion-active-directory',
    'usuarios-grupos-active-directory-powershell',
    'directivas-grupo-gpo-windows-server',
    'virtualizacion-hipervisores-docker-contenedores',
    'copias-seguridad-backup-raid-rsync',
    'monitorizacion-logs-journalctl-cron'
  ],
  redes: [
    'modelo-osi-tcp-ip-protocolos',
    'cableado-estructurado-ethernet-arp',
    'fundamentos-subnetting-ipv4',
    'configuracion-vlans-trunking-cisco',
    'enrutamiento-inter-vlan-router-on-a-stick',
    'enrutamiento-dinamico-ospf-cisco',
    'servidor-dhcp-dns-linux',
    'servidor-web-seguro-apache-nginx-ssl',
    'seguridad-cortafuegos-ufw-iptables-nat',
    'acceso-remoto-seguro-ssh-vpn-wireguard',
    'direccionamiento-ipv6-subredes-slaac',
    'seguridad-wifi-wpa2-wpa3-radius',
    'listas-control-acceso-acl-cisco',
    'servicios-correo-smtp-imap-pop3'
  ],
  programacion: [
    'python-variables-tipos-datos-operadores',
    'python-estructuras-control',
    'python-funciones-modulos-excepciones',
    'programacion-orientada-a-objetos-python',
    'html5-css3-moderno-flexbox-grid',
    'formularios-accesibilidad-css-animaciones',
    'javascript-dom-eventos',
    'javascript-asincrono-fetch-promesas-api',
    'componentes-web-react-preact-estados',
    'bases-de-datos-relacionales-sql-sqlite-python',
    'creacion-apis-rest-fastapi-python',
    'git-github-control-versiones-ramas',
    'autenticacion-jwt-cookies-seguridad-web'
  ]
};

export default function CertificadosHub() {
  const perfil = useStore(perfilStore);
  const [username, setUsername] = useState<string>('Operador Técnico');
  const [certSeleccionada, setCertSeleccionada] = useState<Certificacion | null>(null);

  useEffect(() => {
    cargarPerfilDesdeSupabase();

    async function obtenerAlias() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();
          if (data && data.username) {
            setUsername(data.username);
          }
        }
      } catch (e) {}
    }
    obtenerAlias();
  }, []);

  const completados = perfil.apuntesCompletados || [];

  // Calcular progreso por categoría
  const calcularProgreso = (cat: 'sistemas' | 'redes' | 'programacion' | 'global') => {
    if (cat === 'global') {
      const total = 40;
      const count = Math.min(completados.length, total);
      const porcentaje = Math.min(100, Math.round((count / total) * 100));
      return { count, total, porcentaje, desbloqueado: count >= total };
    }

    const lista = APUNTES_POR_CATEGORIA[cat] || [];
    const total = lista.length;
    const count = lista.filter(id => completados.includes(id)).length;
    const porcentaje = Math.min(100, Math.round((count / total) * 100));
    return { count, total, porcentaje, desbloqueado: count >= total };
  };

  return (
    <div className="cert-hub-container">
      
      {/* GRID DE CERTIFICACIONES */}
      <div className="cert-grid">
        {CATALOGO_CERTIFICACIONES.map((cert) => {
          const prog = calcularProgreso(cert.categoria);
          const estaDesbloqueado = prog.desbloqueado;

          return (
            <article 
              key={cert.id} 
              className={`cert-card ${estaDesbloqueado ? 'cert-card--unlocked' : ''}`}
              style={{ '--cert-color': cert.colorAcento }}
            >
              {/* Header de la Tarjeta */}
              <div className="cert-card-header">
                <div className="cert-icon-box">
                  <span className="cert-icon">{cert.icono}</span>
                </div>
                <div className="cert-badge-status">
                  {estaDesbloqueado ? (
                    <span className="badge-unlocked">✨ DIPLOMA DISPONIBLE</span>
                  ) : (
                    <span className="badge-locked">🔒 EN PROGRESO ({prog.porcentaje}%)</span>
                  )}
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="cert-card-content">
                <span className="cert-code-tag">ID: {cert.codigoPrefijo}-2026</span>
                <h3 className="cert-title">{cert.titulo}</h3>
                <p className="cert-sub">{cert.subtitulo}</p>
                <p className="cert-desc">{cert.descripcion}</p>
              </div>

              {/* Competencias Clave */}
              <div className="cert-skills-box">
                <span className="skills-title">Competencias Clave Acreditadas:</span>
                <ul className="skills-list">
                  {cert.competencias.slice(0, 3).map((comp, idx) => (
                    <li key={idx}>◈ {comp}</li>
                  ))}
                  {cert.competencias.length > 3 && (
                    <li className="skills-more">+{cert.competencias.length - 3} competencias adicionales</li>
                  )}
                </ul>
              </div>

              {/* Barra de Progreso */}
              <div className="cert-progress-box">
                <div className="progress-labels">
                  <span>Progreso de Lecciones</span>
                  <span className="progress-numbers">
                    <strong>{prog.count}</strong> / {prog.total} ({prog.porcentaje}%)
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${prog.porcentaje}%` }}
                  ></div>
                </div>
              </div>

              {/* Botón de Acción */}
              <div className="cert-card-footer">
                {estaDesbloqueado ? (
                  <button 
                    type="button" 
                    onClick={() => setCertSeleccionada(cert)}
                    className="btn-cert-action btn-cert-action--unlocked"
                  >
                    <span>🎓 Ver y Descargar Diploma Oficial</span>
                  </button>
                ) : (
                  <div className="action-row-locked">
                    <button 
                      type="button" 
                      onClick={() => setCertSeleccionada(cert)}
                      className="btn-cert-preview"
                      title="Previsualizar cómo lucirá tu diploma al graduarte"
                    >
                      👁️ Vista Previa del Diploma
                    </button>
                    <span className="hint-locked">Faltan {prog.total - prog.count} apuntes</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL DE DIPLOMA EN PANTALLA COMPLETA */}
      {certSeleccionada && (
        <CertificadoModal 
          cert={certSeleccionada}
          username={username}
          nivel={perfil.nivel}
          onClose={() => setCertSeleccionada(null)}
        />
      )}

      <style>{`
        .cert-hub-container {
          width: 100%;
        }

        .cert-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .cert-card {
          background: rgba(13, 16, 25, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(14px);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .cert-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--cert-color), transparent);
          opacity: 0.6;
        }

        .cert-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 255, 255, 0.03);
        }

        .cert-card--unlocked {
          border-color: var(--cert-color);
          background: linear-gradient(145deg, rgba(13, 16, 25, 0.95) 0%, rgba(18, 22, 35, 0.9) 100%);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.05);
        }

        .cert-card--unlocked::before {
          opacity: 1;
          height: 4px;
        }

        .cert-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .cert-icon-box {
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }

        .cert-card--unlocked .cert-icon-box {
          border-color: var(--cert-color);
          box-shadow: 0 0 20px var(--cert-color);
        }

        .badge-unlocked {
          background: rgba(74, 222, 128, 0.15);
          border: 1px solid #4ade80;
          color: #4ade80;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
        }

        .badge-locked {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
        }

        .cert-code-tag {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--cert-color);
          font-weight: 800;
          letter-spacing: 0.12em;
          margin-bottom: 0.35rem;
          display: block;
        }

        .cert-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem 0;
          line-height: 1.3;
        }

        .cert-sub {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 600;
          margin: 0 0 0.85rem 0;
        }

        .cert-desc {
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
        }

        .cert-skills-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 0.9rem 1.1rem;
          margin-bottom: 1.5rem;
        }

        .skills-title {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.4rem;
        }

        .skills-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .skills-list li {
          font-size: 0.78rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        .skills-more {
          color: var(--cert-color) !important;
          font-weight: 700;
          font-size: 0.72rem !important;
        }

        /* Barra de Progreso */
        .cert-progress-box {
          margin-bottom: 1.5rem;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .progress-numbers strong {
          color: #ffffff;
        }

        .progress-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--cert-color), #ffffff);
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 10px var(--cert-color);
        }

        /* Footer y Botones */
        .btn-cert-action {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
        }

        .btn-cert-action--unlocked {
          background: linear-gradient(135deg, var(--cert-color) 0%, #ffffff 100%);
          color: #050608;
          box-shadow: 0 4px 20px var(--cert-color);
        }

        .btn-cert-action--unlocked:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--cert-color);
        }

        .action-row-locked {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .btn-cert-preview {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cert-preview:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .hint-locked {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .cert-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
