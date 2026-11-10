import{r as e,t}from"./hooks.D-pPw_0u.js";import{t as n}from"./preact.m_eKZVtR.js";import{i as r,p as i}from"./progreso.CBlwQzyC.js";import{t as a}from"./supabase.Cj3_0XfG.js";import{t as o}from"./certificaciones.CXyUl7Mk.js";import{t as s}from"./confetti.module.CAXNRs-2.js";import{t as c}from"./jsxRuntime.BZ3oYkZO.js";function l({cert:n,username:r,nivel:i,onClose:a}){let[o,l]=e(!1),u=new Date,d=u.toLocaleDateString(`es-ES`,{day:`numeric`,month:`long`,year:`numeric`}),f=(r+n.id).split(``).reduce((e,t)=>e+t.charCodeAt(0),0),p=Math.abs(f*9973).toString(16).toUpperCase().padStart(6,`0`).slice(0,6),m=`APNT-2026-${n.codigoPrefijo}-${p}`,h=`${typeof window<`u`?window.location.origin:`https://apuntes-dev-six.vercel.app`}/certificados/verificar?code=${m}&name=${encodeURIComponent(r)}&cert=${encodeURIComponent(n.id)}`,g=`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(h)}&color=ffffff&bgcolor=090a0f&qzone=1`;t(()=>{s({particleCount:150,spread:100,origin:{y:.4},colors:[n.colorAcento,`#ffd700`,`#ffffff`,`#38bdf8`]});let e=e=>{e.key===`Escape`&&a()};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[]);let _=()=>{window.print()},v=()=>{navigator.clipboard&&(navigator.clipboard.writeText(h),l(!0),setTimeout(()=>l(!1),3e3))},y=u.getFullYear(),b=u.getMonth()+1,x=`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(n.titulo)}&organizationName=ApuntesDev&issueYear=${y}&issueMonth=${b}&certUrl=${encodeURIComponent(h)}&certId=${encodeURIComponent(m)}`;return c(`div`,{className:`cert-modal-backdrop`,onClick:a,role:`dialog`,"aria-modal":`true`,children:[c(`div`,{className:`cert-modal-container`,onClick:e=>e.stopPropagation(),children:[c(`header`,{className:`cert-toolbar no-print`,children:[c(`div`,{className:`toolbar-info`,children:[c(`span`,{className:`cert-status-dot`}),c(`span`,{children:`Credencial Oficial Verificada en Red`})]}),c(`div`,{className:`toolbar-actions`,children:[c(`button`,{type:`button`,onClick:v,className:`btn-tool`,children:o?`✓ ¡Enlace Copiado!`:`🔗 Copiar Enlace`}),c(`a`,{href:x,target:`_blank`,rel:`noopener noreferrer`,className:`btn-tool btn-tool--linkedin`,title:`Añadir esta certificación a tu perfil de LinkedIn`,children:c(`span`,{children:`💼 Añadir a LinkedIn`})}),c(`button`,{type:`button`,onClick:_,className:`btn-tool btn-tool--print`,children:c(`span`,{children:`🖨️ Descargar PDF / Imprimir A4`})}),c(`button`,{type:`button`,onClick:a,className:`btn-close`,"aria-label":`Cerrar vista de diploma`,children:`✕`})]})]}),c(`div`,{className:`diploma-paper`,id:`diploma-document`,style:{"--accent":n.colorAcento},children:c(`div`,{className:`diploma-border-outer`,children:c(`div`,{className:`diploma-border-inner`,children:[c(`div`,{className:`corner-decor corner-tl`}),c(`div`,{className:`corner-decor corner-tr`}),c(`div`,{className:`corner-decor corner-bl`}),c(`div`,{className:`corner-decor corner-br`}),c(`div`,{className:`diploma-watermark`,children:`APUNTESDEV`}),c(`div`,{className:`diploma-header`,children:[c(`div`,{className:`diploma-brand`,children:[c(`div`,{className:`brand-logo-circle`,children:c(`img`,{src:`/logo.png`,alt:`Logo ApuntesDev`,className:`diploma-logo`})}),c(`div`,{children:[c(`h2`,{className:`brand-title`,children:`APUNTESDEV ACADEMY`}),c(`span`,{className:`brand-subtitle`,children:`CENTRO DE MAESTRÍA EN SISTEMAS, REDES Y DESARROLLO DE SOFTWARE`})]})]}),c(`div`,{className:`cert-id-badge`,children:[c(`span`,{className:`cert-id-label`,children:`CREDENCIAL ID:`}),c(`span`,{className:`cert-id-code`,children:m})]})]}),c(`div`,{className:`diploma-preamble`,children:`POR CUANTO SE RECONOCE Y HACE CONSTAR QUE EL ESTUDIANTE`}),c(`div`,{className:`diploma-recipient`,children:[c(`span`,{className:`recipient-name`,children:r||`Operador Técnico`}),c(`div`,{className:`recipient-line`})]}),c(`div`,{className:`diploma-body`,children:[c(`p`,{className:`diploma-text`,children:`Ha completado con éxito y superado los exámenes técnicos de evaluación continua correspondientes al programa de especialización oficial:`}),c(`h1`,{className:`diploma-cert-title`,children:n.titulo}),c(`p`,{className:`diploma-cert-subtitle`,children:n.subtitulo}),c(`div`,{className:`competencias-grid`,children:n.competencias.map((e,t)=>c(`div`,{className:`comp-item`,children:[c(`span`,{className:`comp-check`,children:`◈`}),c(`span`,{children:e})]},t))})]}),c(`div`,{className:`diploma-footer`,children:[c(`div`,{className:`footer-qr-block`,children:[c(`img`,{src:g,alt:`QR de Verificación Oficial`,className:`qr-image`}),c(`div`,{className:`qr-caption`,children:[c(`span`,{children:`Escanear para verificar`}),c(`small`,{children:`Validez Criptográfica en Red`})]})]}),c(`div`,{className:`footer-seal-block`,children:[c(`div`,{className:`gold-seal`,children:[c(`div`,{className:`seal-ring-outer`}),c(`div`,{className:`seal-ring-inner`,children:[c(`span`,{className:`seal-icon`,children:n.icono}),c(`span`,{className:`seal-text-top`,children:`APUNTESDEV`}),c(`span`,{className:`seal-text-bottom`,children:`VERIFIED`})]})]}),c(`span`,{className:`seal-caption`,children:[`Nivel `,i,` Alcanzado`]})]}),c(`div`,{className:`footer-signature-block`,children:[c(`div`,{className:`signature-line`,children:c(`div`,{className:`digital-sign`,children:`Hugo G. // Root Archon`})}),c(`span`,{className:`sign-role`,children:`Comité Técnico de Evaluación`}),c(`span`,{className:`sign-date`,children:[`Fecha de expedición: `,d]})]})]})]})})})]}),c(`style`,{children:`
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
      `})]})}var u={sistemas:[`comandos-linux-basicos`,`estructura-directorios-linux-fhs`,`gestion-paquetes-repositorios-linux`,`permisos-linux-chmod-chown`,`particionado-discos-sistemas-archivos-fstab`,`gestion-procesos-servicios-systemd-linux`,`scripting-bash-automatizacion-tareas-cron`,`introduccion-active-directory`,`usuarios-grupos-active-directory-powershell`,`directivas-grupo-gpo-windows-server`,`virtualizacion-hipervisores-docker-contenedores`,`copias-seguridad-backup-raid-rsync`,`monitorizacion-logs-journalctl-cron`],redes:[`modelo-osi-tcp-ip-protocolos`,`cableado-estructurado-ethernet-arp`,`fundamentos-subnetting-ipv4`,`configuracion-vlans-trunking-cisco`,`enrutamiento-inter-vlan-router-on-a-stick`,`enrutamiento-dinamico-ospf-cisco`,`servidor-dhcp-dns-linux`,`servidor-web-seguro-apache-nginx-ssl`,`seguridad-cortafuegos-ufw-iptables-nat`,`acceso-remoto-seguro-ssh-vpn-wireguard`,`direccionamiento-ipv6-subredes-slaac`,`seguridad-wifi-wpa2-wpa3-radius`,`listas-control-acceso-acl-cisco`,`servicios-correo-smtp-imap-pop3`],programacion:[`python-variables-tipos-datos-operadores`,`python-estructuras-control`,`python-funciones-modulos-excepciones`,`programacion-orientada-a-objetos-python`,`html5-css3-moderno-flexbox-grid`,`formularios-accesibilidad-css-animaciones`,`javascript-dom-eventos`,`javascript-asincrono-fetch-promesas-api`,`componentes-web-react-preact-estados`,`bases-de-datos-relacionales-sql-sqlite-python`,`creacion-apis-rest-fastapi-python`,`git-github-control-versiones-ramas`,`autenticacion-jwt-cookies-seguridad-web`]};function d(){let s=n(i),[d,f]=e(`Operador Técnico`),[p,m]=e(null);t(()=>{r();async function e(){try{let{data:{session:e}}=await a.auth.getSession();if(e){let{data:t}=await a.from(`profiles`).select(`username`).eq(`id`,e.user.id).single();t&&t.username&&f(t.username)}}catch{}}e()},[]);let h=s.apuntesCompletados||[],g=e=>{if(e===`global`){let e=Math.min(h.length,40);return{count:e,total:40,porcentaje:Math.min(100,Math.round(e/40*100)),desbloqueado:e>=40}}let t=u[e]||[],n=t.length,r=t.filter(e=>h.includes(e)).length;return{count:r,total:n,porcentaje:Math.min(100,Math.round(r/n*100)),desbloqueado:r>=n}};return c(`div`,{className:`cert-hub-container`,children:[c(`div`,{className:`cert-grid`,children:o.map(e=>{let t=g(e.categoria),n=t.desbloqueado;return c(`article`,{className:`cert-card ${n?`cert-card--unlocked`:``}`,style:{"--cert-color":e.colorAcento},children:[c(`div`,{className:`cert-card-header`,children:[c(`div`,{className:`cert-icon-box`,children:c(`span`,{className:`cert-icon`,children:e.icono})}),c(`div`,{className:`cert-badge-status`,children:n?c(`span`,{className:`badge-unlocked`,children:`✨ DIPLOMA DISPONIBLE`}):c(`span`,{className:`badge-locked`,children:[`🔒 EN PROGRESO (`,t.porcentaje,`%)`]})})]}),c(`div`,{className:`cert-card-content`,children:[c(`span`,{className:`cert-code-tag`,children:[`ID: `,e.codigoPrefijo,`-2026`]}),c(`h3`,{className:`cert-title`,children:e.titulo}),c(`p`,{className:`cert-sub`,children:e.subtitulo}),c(`p`,{className:`cert-desc`,children:e.descripcion})]}),c(`div`,{className:`cert-skills-box`,children:[c(`span`,{className:`skills-title`,children:`Competencias Clave Acreditadas:`}),c(`ul`,{className:`skills-list`,children:[e.competencias.slice(0,3).map((e,t)=>c(`li`,{children:[`◈ `,e]},t)),e.competencias.length>3&&c(`li`,{className:`skills-more`,children:[`+`,e.competencias.length-3,` competencias adicionales`]})]})]}),c(`div`,{className:`cert-progress-box`,children:[c(`div`,{className:`progress-labels`,children:[c(`span`,{children:`Progreso de Lecciones`}),c(`span`,{className:`progress-numbers`,children:[c(`strong`,{children:t.count}),` / `,t.total,` (`,t.porcentaje,`%)`]})]}),c(`div`,{className:`progress-bar-track`,children:c(`div`,{className:`progress-bar-fill`,style:{width:`${t.porcentaje}%`}})})]}),c(`div`,{className:`cert-card-footer`,children:n?c(`button`,{type:`button`,onClick:()=>m(e),className:`btn-cert-action btn-cert-action--unlocked`,children:c(`span`,{children:`🎓 Ver y Descargar Diploma Oficial`})}):c(`div`,{className:`action-row-locked`,children:[c(`button`,{type:`button`,onClick:()=>m(e),className:`btn-cert-preview`,title:`Previsualizar cómo lucirá tu diploma al graduarte`,children:`👁️ Vista Previa del Diploma`}),c(`span`,{className:`hint-locked`,children:[`Faltan `,t.total-t.count,` apuntes`]})]})})]},e.id)})}),p&&c(l,{cert:p,username:d,nivel:s.nivel,onClose:()=>m(null)}),c(`style`,{children:`
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
      `})]})}export{d as default};