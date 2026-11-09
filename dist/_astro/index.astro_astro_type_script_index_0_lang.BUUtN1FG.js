import{t as e}from"./supabase.Cj3_0XfG.js";document.addEventListener(`astro:page-load`,async()=>{let{data:{session:t}}=await e.auth.getSession();if(!t){window.location.href=`/login`;return}let{data:n,error:r}=await e.from(`profiles`).select(`*`);if(r)console.error(`Error al cargar perfiles en admin:`,r);else{if(n){let t=n.length,r=n.reduce((e,t)=>e+(t.coins||0),0),i=t>0?(n.reduce((e,t)=>e+(t.level||1),0)/t).toFixed(1):`1.0`;document.getElementById(`total-users`).textContent=t.toString(),document.getElementById(`total-coins`).textContent=`🪙 ${r.toLocaleString()}`,document.getElementById(`avg-level`).textContent=`Nvl. ${i}`;let a=document.getElementById(`users-table-body`),o=(t=``)=>{a.innerHTML=``;let r=n.filter(e=>(e.username||``).toLowerCase().includes(t.toLowerCase()));r.length===0?a.innerHTML=`<tr><td colspan="6" style="text-align: center; color: #777; padding: 2rem;">No se encontraron estudiantes</td></tr>`:(r.forEach(e=>{let t=(e.username||`E`).charAt(0).toUpperCase(),n=document.createElement(`tr`);n.innerHTML=`
            <td>
              <div class="user-cell">
                <div class="user-avatar">${t}</div>
                <div class="user-info">
                  <strong>${e.username||`Estudiante Anónimo`}</strong>
                  <small class="user-id">ID: ${e.id.substring(0,8)}...</small>
                </div>
              </div>
            </td>
            <td><span class="badge-nivel">Nvl. ${e.level||1}</span></td>
            <td><code class="xp-code">${(e.xp||0).toLocaleString()} XP</code></td>
            <td class="oro">🪙 ${(e.coins||0).toLocaleString()}</td>
            <td>⭐ ${e.prestigio||0}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-accion xp" data-id="${e.id}">+500 XP</button>
                <button class="btn-accion monedas" data-id="${e.id}">+200 🪙</button>
              </div>
            </td>
          `,a.appendChild(n)}),document.querySelectorAll(`.btn-accion.xp`).forEach(t=>{t.addEventListener(`click`,async t=>{let r=t.currentTarget.getAttribute(`data-id`),i=n.find(e=>e.id===r);if(i){let t=(i.xp||0)+500,{error:n}=await e.from(`profiles`).update({xp:t}).eq(`id`,r);n||(alert(`¡Se han inyectado 500 XP a ${i.username||`usuario`}!`),window.location.reload())}})}),document.querySelectorAll(`.btn-accion.monedas`).forEach(t=>{t.addEventListener(`click`,async t=>{let r=t.currentTarget.getAttribute(`data-id`),i=n.find(e=>e.id===r);if(i){let t=(i.coins||0)+200,{error:n}=await e.from(`profiles`).update({coins:t}).eq(`id`,r);n||(alert(`¡Se han inyectado 200 Monedas a ${i.username||`usuario`}!`),window.location.reload())}})}))};o(),document.getElementById(`admin-search`)?.addEventListener(`input`,e=>{o(e.target.value)})}document.getElementById(`btn-broadcast`)?.addEventListener(`click`,()=>{let e=prompt(`Transmisión global para la academia:`);e&&alert(`[TRANSMITIDO]: "${e}"`)}),document.getElementById(`btn-export`)?.addEventListener(`click`,()=>{if(n){let e=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(n,null,2)),t=document.createElement(`a`);t.setAttribute(`href`,e),t.setAttribute(`download`,`apuntesdev_telemetria.json`),t.click()}}),document.getElementById(`btn-reset-cache`)?.addEventListener(`click`,()=>{localStorage.clear(),alert(`Caché local del navegador purgada con éxito.`),window.location.reload()})}});