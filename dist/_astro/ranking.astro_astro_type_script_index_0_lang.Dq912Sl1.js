import{t as e}from"./supabase.Cj3_0XfG.js";function t(e){return e>=40?{title:`Arquitecto de Redes Élite`,color:`#f59e0b`}:e>=25?{title:`Ingeniero DevOps Senior`,color:`#a855f7`}:e>=15?{title:`NetAdmin Junior`,color:`#38bdf8`}:e>=5?{title:`Técnico de Sistemas SOM`,color:`#4ade80`}:{title:`Cadete SMR`,color:`#94a3b8`}}document.addEventListener(`astro:page-load`,async()=>{let n=document.getElementById(`ranking-tbody`),r=document.getElementById(`podium-container`),i=document.getElementById(`search-ranking`),a=document.querySelectorAll(`.tab-btn`),o=document.getElementById(`user-rank-banner`);if(!n||!r)return;let s=[],c=`level-xp`,l=null;try{let{data:{session:t}}=await e.auth.getSession();t&&(l=t.user.id)}catch(e){console.warn(`Error comprobando sesión:`,e)}try{let{data:t,error:n}=await e.from(`profiles`).select(`*`);if(n)throw n;s=t||[]}catch(e){console.error(`Error al cargar ranking:`,e),n.innerHTML=`<tr><td colspan="7" class="error-state">⚠️ Error al conectar con la base de datos de Supabase.</td></tr>`,r.innerHTML=``;return}let u=(e,t)=>{let n=[...e];return t===`coins`?n.sort((e,t)=>(t.coins||0)-(e.coins||0)):t===`prestigio`?n.sort((e,t)=>(t.prestigio||0)-(e.prestigio||0)||(t.xp||0)-(e.xp||0)):n.sort((e,t)=>(t.level||1)-(e.level||1)||(t.xp||0)-(e.xp||0))},d=e=>{if(e.length===0){r.innerHTML=`<div class="podium-empty">Aún no hay estudiantes en la academia.</div>`;return}let n=e[0],i=e[1],a=e[2],o=(e,n,r,i,a)=>{if(!e)return`<div class="podium-slot-empty">Puesto #${n} Disponible</div>`;let o=(e.username||`A`).charAt(0).toUpperCase(),s=t(e.level||1),c=Array.isArray(e.apuntes_completados)?e.apuntes_completados.length:0;return`
          <div class="podium-card ${r} tilt-card">
            <div class="podium-crown">${i}</div>
            <div class="podium-avatar-wrapper" style="--podium-glow: ${a};">
              <div class="podium-avatar">${o}</div>
              <span class="podium-rank-badge">#${n}</span>
            </div>

            <div class="podium-user-info">
              <h3 class="podium-username">${e.username||`Estudiante`}</h3>
              <span class="podium-title" style="color: ${s.color};">${s.title}</span>
            </div>

            <div class="podium-stats-box">
              <div class="podium-stat">
                <span class="pstat-val accent">Nvl. ${e.level||1}</span>
                <span class="pstat-label">Nivel</span>
              </div>
              <div class="podium-stat-sep"></div>
              <div class="podium-stat">
                <span class="pstat-val gold">${(e.xp||0).toLocaleString()}</span>
                <span class="pstat-label">XP Total</span>
              </div>
              <div class="podium-stat-sep"></div>
              <div class="podium-stat">
                <span class="pstat-val">🪙 ${(e.coins||0).toLocaleString()}</span>
                <span class="pstat-label">Monedas</span>
              </div>
            </div>

            <div class="podium-footer-meta">
              <span>📚 ${c} apuntes dominados</span>
              ${e.prestigio?`<span>⭐ Prestigio ${e.prestigio}</span>`:``}
            </div>
          </div>
        `};r.innerHTML=`
        ${o(i,2,`podium-card--second`,`🥈`,`#cbd5e1`)}
        ${o(n,1,`podium-card--first`,`👑`,`#fbbf24`)}
        ${o(a,3,`podium-card--third`,`🥉`,`#f97316`)}
      `},f=e=>{n.innerHTML=``,e.length===0?n.innerHTML=`<tr><td colspan="7" class="empty-state">No se encontraron estudiantes con ese nombre.</td></tr>`:e.forEach((e,r)=>{let i=r+1,a=(e.username||`E`).charAt(0).toUpperCase(),o=t(e.level||1),s=e.id===l,c=Array.isArray(e.apuntes_completados)?e.apuntes_completados.length:0,u=`pos-normal`,d=`#${i}`;i===1?(u=`pos-gold`,d=`🥇 #1`):i===2?(u=`pos-silver`,d=`🥈 #2`):i===3&&(u=`pos-bronze`,d=`🥉 #3`);let f=Math.min((e.xp||0)%500/500*100,100),p=document.createElement(`tr`);s&&(p.className=`my-user-row`),p.innerHTML=`
          <td class="col-pos">
            <span class="pos-badge ${u}">${d}</span>
          </td>
          <td>
            <div class="student-cell">
              <div class="student-avatar" style="--avatar-color: ${o.color};">${a}</div>
              <div class="student-names">
                <div class="name-row">
                  <strong class="student-name">${e.username||`Anónimo`}</strong>
                  ${s?`<span class="you-badge">TÚ</span>`:``}
                </div>
                <span class="student-rank-title" style="color: ${o.color};">${o.title}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="level-progress-cell">
              <span class="level-pill">Nvl. ${e.level||1}</span>
              <div class="row-progress-track" title="Progreso de nivel: ${Math.round(f)}%">
                <div class="row-progress-bar" style="width: ${f}%;"></div>
              </div>
            </div>
          </td>
          <td>
            <span class="xp-display">${(e.xp||0).toLocaleString()} <small>XP</small></span>
          </td>
          <td>
            <span class="coins-display">🪙 ${(e.coins||0).toLocaleString()}</span>
          </td>
          <td>
            <span class="prestige-display">⭐ ${e.prestigio||0}</span>
          </td>
          <td>
            <span class="apuntes-count-badge">${c}</span>
          </td>
        `,n.appendChild(p)})},p=e=>{if(!l||!o)return;let n=e.findIndex(e=>e.id===l);if(n===-1)return;let r=e[n],i=n+1,a=t(r.level||1);if(document.getElementById(`my-rank-pos`).textContent=`#${i}`,document.getElementById(`my-rank-avatar`).textContent=(r.username||`U`).charAt(0).toUpperCase(),document.getElementById(`my-rank-name`).textContent=r.username||`Tu Perfil`,document.getElementById(`my-rank-title`).textContent=a.title,document.getElementById(`my-rank-level`).textContent=`Nvl. ${r.level||1}`,document.getElementById(`my-rank-xp`).textContent=`${(r.xp||0).toLocaleString()} XP`,n>0){let t=(e[n-1].xp||0)-(r.xp||0);document.getElementById(`my-rank-diff`).textContent=`+${t.toLocaleString()} XP para #${n}`}else document.getElementById(`my-rank-diff`).textContent=`👑 Liderando el Ranking`;o.style.display=`flex`},m=()=>{let e=u(s,c);d(e.slice(0,3)),p(e);let t=(i?.value||``).toLowerCase().trim(),n=t?e.filter(e=>(e.username||``).toLowerCase().includes(t)):e;f(n)};a.forEach(e=>{e.addEventListener(`click`,e=>{a.forEach(e=>e.classList.remove(`active`));let t=e.currentTarget;t.classList.add(`active`),c=t.getAttribute(`data-sort`)||`level-xp`,m()})}),i?.addEventListener(`input`,()=>{let e=i.value.toLowerCase().trim(),t=u(s,c),n=e?t.filter(t=>(t.username||``).toLowerCase().includes(e)):t;f(n)}),m()});