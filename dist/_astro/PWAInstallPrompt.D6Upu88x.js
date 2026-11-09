import{r as e,t}from"./hooks.D-pPw_0u.js";import{t as n}from"./jsxRuntime.BZ3oYkZO.js";function r(){let[r,i]=e(null),[a,o]=e(!1),[s,c]=e(!1),[l,u]=e(!1);return t(()=>{if(window.matchMedia(`(display-mode: standalone)`).matches||window.navigator.standalone)return;let e=localStorage.getItem(`pwa_prompt_dismissed`);if(e&&(Date.now()-parseInt(e,10))/864e5<5)return;let t=e=>{e.preventDefault(),i(e),setTimeout(()=>o(!0),3e3)};window.addEventListener(`beforeinstallprompt`,t);let n=window.navigator.userAgent.toLowerCase(),r=/iphone|ipad|ipod/.test(n),a=/safari/.test(n)&&!/chrome|crios|fxios/.test(n);r&&a&&(c(!0),setTimeout(()=>o(!0),4e3));let s=()=>{o(!1),i(null),localStorage.setItem(`pwa_prompt_dismissed`,Date.now().toString())};return window.addEventListener(`appinstalled`,s),()=>{window.removeEventListener(`beforeinstallprompt`,t),window.removeEventListener(`appinstalled`,s)}},[]),a?n(`aside`,{className:`pwa-floating-toast`,"aria-label":`Instalar aplicación`,children:[n(`div`,{className:`pwa-toast-inner`,children:[n(`div`,{className:`pwa-icon-box`,children:n(`img`,{src:`/icon-192.png`,alt:`ApuntesDev App`,width:`44`,height:`44`})}),n(`div`,{className:`pwa-text-box`,children:[n(`div`,{className:`pwa-badge`,children:`APLICACIÓN MÓVIL Y ESCRITORIO`}),n(`h4`,{children:`Instala ApuntesDev`}),n(`p`,{children:`Acceso instantáneo sin conexión, herramientas de red y pantalla completa en clase.`}),l&&n(`div`,{className:`pwa-ios-tip`,children:[`Pulsa el botón `,n(`strong`,{children:`Compartir (⬆️)`}),` en Safari y selecciona `,n(`strong`,{children:`"Añadir a pantalla de inicio"`}),`.`]})]}),n(`div`,{className:`pwa-actions`,children:[n(`button`,{type:`button`,onClick:async()=>{if(s){u(!0);return}if(!r)return;r.prompt();let{outcome:e}=await r.userChoice;e===`accepted`&&o(!1),i(null)},className:`pwa-btn-install`,children:`📲 Instalar`}),n(`button`,{type:`button`,onClick:()=>{o(!1),localStorage.setItem(`pwa_prompt_dismissed`,Date.now().toString())},className:`pwa-btn-close`,"aria-label":`Cerrar sugerencia de instalación`,children:`✕`})]})]}),n(`style`,{children:`
        .pwa-floating-toast {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 99999;
          max-width: 440px;
          width: calc(100% - 3rem);
          animation: slideUpToast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .pwa-toast-inner {
          background: linear-gradient(145deg, rgba(18, 20, 30, 0.98) 0%, rgba(10, 12, 18, 0.98) 100%);
          border: 1px solid rgba(74, 222, 128, 0.35);
          border-radius: 20px;
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(74, 222, 128, 0.15);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .pwa-toast-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4ade80, transparent);
        }

        .pwa-icon-box {
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pwa-icon-box img {
          display: block;
        }

        .pwa-text-box {
          flex: 1;
          min-width: 0;
        }

        .pwa-badge {
          font-size: 0.62rem;
          font-family: 'Inter', monospace;
          color: #4ade80;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }

        .pwa-text-box h4 {
          margin: 0 0 0.2rem 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .pwa-text-box p {
          margin: 0;
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        .pwa-ios-tip {
          margin-top: 0.5rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          font-size: 0.72rem;
          color: #ffffff;
        }

        .pwa-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .pwa-btn-install {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          color: #060809;
          border: none;
          border-radius: 10px;
          padding: 0.55rem 0.95rem;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pwa-btn-install:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(74, 222, 128, 0.5);
        }

        .pwa-btn-close {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .pwa-btn-close:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 600px) {
          .pwa-floating-toast {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            width: auto;
          }
        }
      `})]}):null}export{r as default};