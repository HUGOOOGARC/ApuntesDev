import{r as e,t}from"./hooks.D-pPw_0u.js";import{t as n}from"./preact.m_eKZVtR.js";import{a as r,p as i}from"./progreso.CBlwQzyC.js";import{t as a}from"./confetti.module.CAXNRs-2.js";import{t as o}from"./jsxRuntime.BZ3oYkZO.js";function s({apunteId:s,quiz:c}){let l=n(i),[u,d]=e(null),[f,p]=e(!1),[m,h]=e(!1),[g,_]=e(!1),v=`quiz_done_${s}`;return t(()=>{try{let e=localStorage.getItem(v),t=l.apuntesCompletados?.includes(s);(e===`true`||t)&&(_(!0),p(!0),h(!0),d(c.respuestaCorrecta))}catch{}},[s,l.apuntesCompletados]),o(`section`,{className:`quiz-card`,"aria-label":`Desafío Técnico de Repaso`,children:[o(`div`,{className:`quiz-header`,children:[o(`div`,{className:`quiz-badge`,children:[o(`span`,{className:`quiz-pulse`}),o(`span`,{children:`TEST DE CONOCIMIENTOS`})]}),o(`span`,{className:`quiz-reward`,children:[`+`,c.xpBonus,` XP Bonus`]})]}),o(`h3`,{className:`quiz-pregunta`,children:c.pregunta}),o(`div`,{className:`quiz-opciones`,children:c.opciones.map((e,t)=>{let n=u===e,r=``;return f?e===c.respuestaCorrecta?r=`correcta`:n&&!m&&(r=`incorrecta`):n&&(r=`seleccionada`),o(`button`,{type:`button`,className:`quiz-opcion-btn ${r}`,onClick:()=>!f&&d(e),disabled:f,children:[o(`span`,{className:`opcion-radio`,children:o(`span`,{className:`opcion-radio-inner`})}),o(`span`,{className:`opcion-texto`,children:e}),f&&e===c.respuestaCorrecta&&o(`span`,{className:`check-icon`,children:`✓`})]},t)})}),o(`div`,{className:`quiz-footer`,children:f?o(`div`,{className:`quiz-feedback-box`,children:m?o(`div`,{className:`feedback-correcto`,children:[o(`div`,{className:`feedback-title`,children:[o(`span`,{children:`🎉 ¡Excelente respuesta!`}),o(`span`,{className:`bonus-tag`,children:[`+`,c.xpBonus,` XP`]})]}),o(`p`,{className:`feedback-desc`,children:c.explicacion})]}):o(`div`,{className:`feedback-incorrecto`,children:[o(`div`,{className:`feedback-title`,children:o(`span`,{children:`❌ No es del todo correcto`})}),o(`p`,{className:`feedback-desc`,children:c.explicacion}),o(`button`,{type:`button`,className:`btn-reintentar`,onClick:()=>{p(!1),d(null),h(!1)},children:`Intentar de nuevo ↻`})]})}):o(`button`,{type:`button`,className:`btn-evaluar`,onClick:async()=>{if(!u||f)return;let e=u===c.respuestaCorrecta;if(p(!0),h(e),e&&!g){a({particleCount:150,spread:90,origin:{y:.7},colors:[`#4ade80`,`#38bdf8`,`#ffd700`,`#ffffff`]});try{localStorage.setItem(v,`true`),_(!0)}catch{}await r(s,c.xpBonus,15),window.dispatchEvent(new CustomEvent(`recompensa-ganada`,{detail:{xp:c.xpBonus,monedas:15,titulo:`¡Quiz Superado con Éxito!`}}))}},disabled:!u,children:`Comprobar Respuesta →`})}),o(`style`,{children:`
        .quiz-card {
          margin: 3.5rem 0 2rem;
          background: linear-gradient(145deg, rgba(17, 19, 27, 0.9) 0%, rgba(10, 12, 18, 0.95) 100%);
          border: 1px solid rgba(74, 222, 128, 0.25);
          border-radius: 20px;
          padding: 2.2rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(74, 222, 128, 0.08);
          position: relative;
          overflow: hidden;
        }

        .quiz-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quiz-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: var(--accent-color);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
        }

        .quiz-pulse {
          width: 6px;
          height: 6px;
          background: var(--accent-color);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--accent-color);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .quiz-reward {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffd700;
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid rgba(255, 215, 0, 0.25);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }

        .quiz-pregunta {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem 0;
          line-height: 1.4;
        }

        .quiz-opciones {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .quiz-opcion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          color: #e2e8f0;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quiz-opcion-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(74, 222, 128, 0.4);
          transform: translateX(4px);
        }

        .quiz-opcion-btn.seleccionada {
          background: rgba(74, 222, 128, 0.12);
          border-color: var(--accent-color);
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.2);
        }

        .quiz-opcion-btn.correcta {
          background: rgba(74, 222, 128, 0.18) !important;
          border-color: #4ade80 !important;
          color: #4ade80 !important;
        }

        .quiz-opcion-btn.incorrecta {
          background: rgba(248, 113, 113, 0.18) !important;
          border-color: #f87171 !important;
          color: #f87171 !important;
        }

        .opcion-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }

        .quiz-opcion-btn.seleccionada .opcion-radio {
          border-color: var(--accent-color);
        }

        .opcion-radio-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.2s;
        }

        .quiz-opcion-btn.seleccionada .opcion-radio-inner {
          background: var(--accent-color);
        }

        .opcion-texto {
          flex-grow: 1;
        }

        .check-icon {
          font-weight: 900;
          color: #4ade80;
        }

        .btn-evaluar {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
          color: #060809;
          padding: 0.85rem 1.75rem;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px var(--accent-glow);
        }

        .btn-evaluar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--accent-glow);
        }

        .btn-evaluar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .feedback-correcto {
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .feedback-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
          color: #4ade80;
          margin-bottom: 0.4rem;
        }

        .bonus-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background: rgba(74, 222, 128, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .feedback-desc {
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .feedback-incorrecto {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .feedback-incorrecto .feedback-title {
          color: #f87171;
        }

        .btn-reintentar {
          background: transparent;
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #f87171;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          margin-top: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-reintentar:hover {
          background: rgba(248, 113, 113, 0.15);
          border-color: #f87171;
        }
      `})]})}export{s as default};