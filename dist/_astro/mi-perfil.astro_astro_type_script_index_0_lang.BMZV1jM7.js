import{c as e,s as t}from"./progreso.t9dW0l9W.js";document.addEventListener(`astro:page-load`,()=>{let n=document.getElementById(`bento-dashboard`);if(!n)return;e.subscribe(e=>{let r=t(e.nivel,e.xp),i=e.apuntesCompletados?e.apuntesCompletados.length:0,a=e.apuntesCompletados.filter(e=>e.includes(`som`)||e.includes(`sor`)).length,o=e.apuntesCompletados.filter(e=>e.includes(`python`)||e.includes(`backend`)||e.includes(`frontend`)).length,s=e.apuntesCompletados.filter(e=>e.includes(`redes`)||e.includes(`routing`)).length,c=Math.min(a*20,100),l=Math.min(o*20,100),u=Math.min(s*20,100);n.innerHTML=`
        <!-- CARD 1: IDENTIDAD Y PROGRESO -->
        <article class="bento-card bento-wide">
          <div class="perfil-header">
            <div class="avatar-box">
              <span class="avatar-emoji">👨‍💻</span>
            </div>
            <div class="perfil-info">
              <h2>Operador SMR</h2>
              <div class="nivel-badge">
                Nivel ${e.nivel} 
                ${e.prestigio>0?`<span class="prestigio-star">⭐ x${e.prestigio}</span>`:``}
              </div>
            </div>
          </div>
          
          <div class="progreso-container">
            <div class="progreso-stats">
              <span>Progreso de Nivel ${e.nivel}</span>
              <span>${r.xpEnEsteNivel} / ${r.xpRequerida} XP</span>
            </div>
            <div class="barra-fondo">
              <div class="barra-relleno" style="width: ${r.porcentaje}%"></div>
            </div>
          </div>
        </article>

        <!-- CARD 2: BÓVEDA FINANCIERA -->
        <article class="bento-card bento-square vault-card">
          <h3>Bóveda de Créditos</h3>
          <div class="monedas-display">
            <span class="moneda-icon">🪙</span>
            <span class="moneda-valor">${e.monedas}</span>
          </div>
          <p class="vault-desc">Acumula créditos completando apuntes para desbloquear temas y skins en la tienda.</p>
        </article>

        <!-- CARD 3: RADAR DE HABILIDADES -->
        <article class="bento-card bento-square">
          <h3>Radar de Habilidades</h3>
          
          <div class="skill-row">
            <div class="skill-label">Sistemas (SOM/SOR)</div>
            <div class="skill-barra-fondo">
              <div class="skill-barra-relleno" style="width: ${c}%; background: #4CAF50;"></div>
            </div>
          </div>
          
          <div class="skill-row">
            <div class="skill-label">Programación</div>
            <div class="skill-barra-fondo">
              <div class="skill-barra-relleno" style="width: ${l}%; background: #2196F3;"></div>
            </div>
          </div>

          <div class="skill-row">
            <div class="skill-label">Redes & Ciber</div>
            <div class="skill-barra-fondo">
              <div class="skill-barra-relleno" style="width: ${u}%; background: #FF9800;"></div>
            </div>
          </div>
        </article>

        <!-- CARD 4: VITRINA DE LOGROS (GLASSMORPHISM) -->
        <article class="bento-card bento-wide logros-card">
          <h3>Vitrina de Logros</h3>
          <div class="logros-grid">
            <div class="logro-item ${i>=1?`unlocked`:``}">
              <div class="logro-icon">🚀</div>
              <h4>Primeros Pasos</h4>
              <p>Completa tu primer apunte.</p>
            </div>
            <div class="logro-item ${e.nivel>=5?`unlocked`:``}">
              <div class="logro-icon">⚡</div>
              <h4>Operador Nivel 5</h4>
              <p>Alcanza el nivel 5 de experiencia.</p>
            </div>
            <div class="logro-item ${i>=10?`unlocked`:``}">
              <div class="logro-icon">🧠</div>
              <h4>Cerebro Máquina</h4>
              <p>Domina 10 apuntes en total.</p>
            </div>
            <div class="logro-item ${e.prestigio>0?`unlocked`:``}">
              <div class="logro-icon">👑</div>
              <h4>Prestigio I</h4>
              <p>Alcanza el nivel máximo y renace.</p>
            </div>
          </div>
        </article>
      `});let r=e.get();r&&e.set(r)});