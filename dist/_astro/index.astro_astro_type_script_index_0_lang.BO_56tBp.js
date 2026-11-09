import{t as e}from"./supabase.Cj3_0XfG.js";function t(e,t=`info`){let n=document.getElementById(`terminal-screen`);if(!n)return;let r=new Date().toLocaleTimeString(),i=document.createElement(`div`);i.className=`term-line ${t}`;let a=`[LOG]`;t===`success`&&(a=`[MUTATION_OK]`),t===`warn`&&(a=`[ALERT]`),t===`error`&&(a=`[ERR_FAIL]`),t===`info`&&(a=`[INFO]`),i.textContent=`[${r}] ${a} ${e}`,n.appendChild(i),n.scrollTop=n.scrollHeight}function n(e,t=`success`){let n=document.getElementById(`toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`admin-toast toast-${t}`;let i=`✅`;t===`info`&&(i=`ℹ️`),t===`warn`&&(i=`⚠️`),t===`error`&&(i=`❌`),r.innerHTML=`<span class="toast-icon">${i}</span><span class="toast-text">${e}</span>`,n.appendChild(r),setTimeout(()=>{r.classList.add(`fade-out`),setTimeout(()=>r.remove(),400)},3800)}document.addEventListener(`astro:page-load`,async()=>{let r=document.getElementById(`gatekeeper-panel`),i=document.getElementById(`admin-main-content`),a=document.getElementById(`latency-tag`),o=performance.now(),s=null;try{let{data:{session:t}}=await e.auth.getSession();t&&t.user&&(s=t.user)}catch(e){console.warn(`Error al verificar sesión en Supabase:`,e)}let c=Math.round(performance.now()-o);if(a&&(a.textContent=`${Math.max(12,c)}ms`),document.getElementById(`btn-bypass-preview`)?.addEventListener(`click`,()=>{r&&(r.style.display=`none`),i&&(i.style.display=`block`),t(`Modo inspección de operador activado temporalmente.`,`warn`),n(`Modo inspección activo. Acciones reales requieren login.`,`warn`)}),s){r&&(r.style.display=`none`),i&&(i.style.display=`block`),t(`Operador autenticado con éxito: ${s.email||s.id}`,`success`);let e=document.getElementById(`operator-avatar`),n=document.getElementById(`operator-name`),a=document.getElementById(`operator-email`),o=s.email||`operador@apuntesdev.com`,c=o.charAt(0).toUpperCase();e&&(e.textContent=c),n&&(n.textContent=s.user_metadata?.full_name||s.user_metadata?.user_name||o.split(`@`)[0]),a&&(a.textContent=o)}else{r&&(r.style.display=`flex`),i&&(i.style.display=`none`),t(`Acceso no autenticado: Requiere credenciales de operador.`,`warn`);return}let l=[];async function u(){t(`Consultando tabla public.profiles en Supabase...`,`info`);let r=performance.now(),{data:i,error:a}=await e.from(`profiles`).select(`*`).order(`xp`,{ascending:!1}),o=Math.round(performance.now()-r);a?(t(`Error de lectura en Supabase: ${a.message}`,`error`),n(`Fallo al sincronizar con Supabase: `+a.message,`error`)):(l=i||[],t(`Sincronización completada: ${l.length} registros recibidos (${o}ms).`,`success`),d(l),f())}function d(e){let t=e.length,n=e.reduce((e,t)=>e+(t.coins||0),0),r=e.reduce((e,t)=>e+(t.xp||0),0),i=e.reduce((e,t)=>e+(t.cristales_ascension||0),0),a=t>0?(e.reduce((e,t)=>e+(t.level||1),0)/t).toFixed(1):`1.0`,o=0;e.forEach(e=>{Array.isArray(e.apuntes_completados)&&(o+=e.apuntes_completados.length)});let s=document.getElementById(`kpi-total-users`),c=document.getElementById(`kpi-total-coins`),l=document.getElementById(`kpi-total-xp`),u=document.getElementById(`kpi-avg-level`),d=document.getElementById(`kpi-total-crystals`),f=document.getElementById(`kpi-total-lessons`),p=document.getElementById(`kpi-avg-level-bar`);if(s&&(s.textContent=t.toString()),c&&(c.textContent=n.toLocaleString()),l&&(l.textContent=r.toLocaleString()),u&&(u.textContent=`Nvl. ${a}`),d&&(d.textContent=i.toString()),f&&(f.textContent=o.toString()),p){let e=Math.min(100,Math.max(10,parseFloat(a)/30*100));p.style.width=`${e}%`}}function f(){let e=document.getElementById(`students-tbody`),t=document.getElementById(`student-search-input`)?.value.toLowerCase().trim()||``,n=document.getElementById(`level-filter-select`)?.value||`all`,r=document.getElementById(`sort-select`)?.value||`level-desc`,i=document.getElementById(`visible-count-badge`);if(!e)return;let a=l.filter(e=>{let r=(e.username||``).toLowerCase(),i=(e.id||``).toLowerCase();if(!(r.includes(t)||i.includes(t)))return!1;let a=e.level||1;return n===`novatos`?a<=5:n===`intermedios`?a>=6&&a<=15:n!==`veteranos`||a>=16});a.sort((e,t)=>{if(r===`level-desc`)return(t.level||1)-(e.level||1)||(t.xp||0)-(e.xp||0);if(r===`xp-desc`)return(t.xp||0)-(e.xp||0);if(r===`coins-desc`)return(t.coins||0)-(e.coins||0);if(r===`lessons-desc`){let n=Array.isArray(e.apuntes_completados)?e.apuntes_completados.length:0;return(Array.isArray(t.apuntes_completados)?t.apuntes_completados.length:0)-n}return 0}),i&&(i.textContent=`${a.length} de ${l.length} estudiantes`),a.length===0?e.innerHTML=`
          <tr>
            <td colspan="7" class="empty-state-cell">
              <span class="empty-icon">🔍</span>
              <strong>No se encontraron registros de estudiantes</strong>
              <p>Intenta cambiar el criterio de búsqueda o el filtro de nivel.</p>
            </td>
          </tr>
        `:(e.innerHTML=``,a.forEach(t=>{let n=(t.username||`E`).charAt(0).toUpperCase(),r=(t.username||``).toLowerCase().includes(`adm`)||(t.level||1)>=25,i=(t.id||``).substring(0,8),a=Array.isArray(t.apuntes_completados)?t.apuntes_completados.length:0,o=Math.round(a/32*100),s=document.createElement(`tr`);s.className=`student-row`,s.innerHTML=`
          <td>
            <div class="user-id-cell">
              <div class="user-avatar-badge ${r?`admin-glow`:``}">${n}</div>
              <div class="user-meta-stack">
                <div class="user-title-line">
                  <strong class="user-name">${t.username||`Estudiante`}</strong>
                  ${r?`<span class="role-chip admin">ROOT ADM</span>`:`<span class="role-chip">ESTUDIANTE</span>`}
                </div>
                <div class="user-uuid-line">
                  <code class="uuid-snippet" title="${t.id}">${i}...</code>
                  <button type="button" class="btn-copy-uuid" data-uuid="${t.id}" title="Copiar UUID de Supabase">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </td>

          <td>
            <div class="level-cell">
              <span class="lvl-badge">Nvl. ${t.level||1}</span>
            </div>
          </td>

          <td>
            <div class="xp-cell">
              <span class="xp-value text-accent">${(t.xp||0).toLocaleString()} XP</span>
              <span class="mult-chip">${t.multiplicador_xp||1}x mult</span>
            </div>
          </td>

          <td>
            <span class="coins-value">🪙 ${(t.coins||0).toLocaleString()}</span>
          </td>

          <td>
            <div class="prestige-cell">
              <span class="prestige-tag">⭐ ${t.prestigio||0}</span>
              <span class="crystals-tag">💎 ${t.cristales_ascension||0}</span>
            </div>
          </td>

          <td>
            <div class="progress-cell">
              <div class="progress-mini-bar">
                <div class="progress-mini-fill" style="width: ${o}%"></div>
              </div>
              <span class="progress-ratio">${a} / 32 apuntes (${o}%)</span>
            </div>
          </td>

          <td>
            <div class="actions-cluster">
              <button type="button" class="btn-act btn-xp" data-action="add-xp" data-id="${t.id}" title="Inyectar +500 XP">
                +500 ⚡
              </button>
              <button type="button" class="btn-act btn-coins" data-action="add-coins" data-id="${t.id}" title="Inyectar +200 Monedas">
                +200 🪙
              </button>
              <button type="button" class="btn-act btn-lvl" data-action="add-level" data-id="${t.id}" title="Subir +1 Nivel">
                +1 🆙
              </button>
              <button type="button" class="btn-act btn-edit" data-action="edit-full" data-id="${t.id}" title="Editar registro completo">
                ⚙️
              </button>
            </div>
          </td>
        `,e.appendChild(s)}),p())}function p(){document.querySelectorAll(`.btn-copy-uuid`).forEach(e=>{e.addEventListener(`click`,r=>{r.stopPropagation();let i=e.getAttribute(`data-uuid`);i&&(navigator.clipboard.writeText(i),n(`UUID copiado al portapapeles: `+i.substring(0,8)+`...`,`info`),t(`UUID copiado: ${i}`,`info`))})}),document.querySelectorAll(`.btn-act`).forEach(r=>{r.addEventListener(`click`,async i=>{let a=r.getAttribute(`data-action`),o=r.getAttribute(`data-id`);if(!o)return;let s=l.find(e=>e.id===o);if(s){if(a===`add-xp`){let r=(s.xp||0)+500;t(`Inyectando +500 XP a usuario [${s.username}]...`,`info`);let{error:i}=await e.from(`profiles`).update({xp:r}).eq(`id`,o);i?(n(`Error al inyectar XP: `+i.message,`error`),t(`[ERR] Fallo de inyección XP: ${i.message}`,`error`)):(s.xp=r,n(`+500 XP inyectados a ${s.username}`,`success`),t(`[SUPABASE_OK] ${s.username} ahora tiene ${r} XP.`,`success`),d(l),f())}if(a===`add-coins`){let r=(s.coins||0)+200;t(`Inyectando +200 Monedas a usuario [${s.username}]...`,`info`);let{error:i}=await e.from(`profiles`).update({coins:r}).eq(`id`,o);i?(n(`Error al inyectar monedas: `+i.message,`error`),t(`[ERR] Fallo de monedas: ${i.message}`,`error`)):(s.coins=r,n(`+200 Monedas inyectadas a ${s.username}`,`success`),t(`[SUPABASE_OK] ${s.username} ahora tiene 🪙 ${r}.`,`success`),d(l),f())}if(a===`add-level`){let r=(s.level||1)+1;t(`Ascendiendo a nivel ${r} a [${s.username}]...`,`info`);let{error:i}=await e.from(`profiles`).update({level:r}).eq(`id`,o);i?(n(`Error al subir nivel: `+i.message,`error`),t(`[ERR] Fallo de nivel: ${i.message}`,`error`)):(s.level=r,n(`Nivel ${r} otorgado a ${s.username}`,`success`),t(`[SUPABASE_OK] ${s.username} ascendido a Nvl. ${r}.`,`success`),d(l),f())}a===`edit-full`&&v(s)}})})}let m=document.getElementById(`edit-modal-backdrop`),h=document.getElementById(`btn-close-modal`),g=document.getElementById(`btn-cancel-modal`),_=document.getElementById(`edit-student-form`);function v(e){m&&(document.getElementById(`edit-user-id`).value=e.id,document.getElementById(`modal-user-subtitle`).textContent=`UUID: ${e.id}`,document.getElementById(`edit-username`).value=e.username||``,document.getElementById(`edit-level`).value=(e.level||1).toString(),document.getElementById(`edit-xp`).value=(e.xp||0).toString(),document.getElementById(`edit-coins`).value=(e.coins||0).toString(),document.getElementById(`edit-prestigio`).value=(e.prestigio||0).toString(),document.getElementById(`edit-crystals`).value=(e.cristales_ascension||0).toString(),document.getElementById(`edit-multiplier`).value=(e.multiplicador_xp||1).toString(),m.style.display=`flex`,t(`Editor abierto para usuario: ${e.username} (${e.id.substring(0,8)}...)`,`info`))}function y(){m&&(m.style.display=`none`)}h?.addEventListener(`click`,y),g?.addEventListener(`click`,y),_?.addEventListener(`submit`,async r=>{r.preventDefault();let i=document.getElementById(`edit-user-id`).value,a=l.find(e=>e.id===i);if(!a)return;let o={username:document.getElementById(`edit-username`).value.trim(),level:parseInt(document.getElementById(`edit-level`).value,10)||1,xp:parseInt(document.getElementById(`edit-xp`).value,10)||0,coins:parseInt(document.getElementById(`edit-coins`).value,10)||0,prestigio:parseInt(document.getElementById(`edit-prestigio`).value,10)||0,cristales_ascension:parseInt(document.getElementById(`edit-crystals`).value,10)||0,multiplicador_xp:parseFloat(document.getElementById(`edit-multiplier`).value)||1};t(`Guardando cambios para ${o.username}...`,`info`);let{error:s}=await e.from(`profiles`).update(o).eq(`id`,i);s?(n(`Error al actualizar: `+s.message,`error`),t(`[ERR] Fallo al actualizar perfil: ${s.message}`,`error`)):(Object.assign(a,o),n(`Registro de ${o.username} actualizado con éxito.`,`success`),t(`[SUPABASE_OK] Perfil ${i} sincronizado en la base de datos.`,`success`),y(),d(l),f())});let b=document.getElementById(`student-search-input`),x=document.getElementById(`level-filter-select`),S=document.getElementById(`sort-select`);b?.addEventListener(`input`,f),x?.addEventListener(`change`,f),S?.addEventListener(`change`,f),document.getElementById(`btn-refresh-all`)?.addEventListener(`click`,async()=>{n(`Sincronizando clúster con Supabase...`,`info`),await u()}),document.getElementById(`btn-broadcast-modal`)?.addEventListener(`click`,()=>{let e=prompt(`Escribe el mensaje de Broadcast para toda la academia:
(Se registrará en los registros de auditoría y almacenamiento global)`);e&&e.trim()&&(localStorage.setItem(`apuntesdev_global_broadcast`,JSON.stringify({message:e.trim(),timestamp:new Date().toISOString()})),n(`Aviso transmitido con éxito al clúster`,`success`),t(`[BROADCAST_TRANSMITTED] "${e.trim()}"`,`warn`))}),document.getElementById(`btn-export-json`)?.addEventListener(`click`,()=>{if(l.length===0){n(`No hay datos disponibles para exportar`,`warn`);return}let e=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(l,null,2)),r=document.createElement(`a`);r.setAttribute(`href`,e),r.setAttribute(`download`,`apuntesdev_profiles_${new Date().toISOString().slice(0,10)}.json`),document.body.appendChild(r),r.click(),r.remove(),n(`Exportación JSON completada con éxito`,`success`),t(`Exportación de ${l.length} registros en formato JSON completada.`,`info`)}),document.getElementById(`btn-export-csv`)?.addEventListener(`click`,()=>{if(l.length===0){n(`No hay datos disponibles para exportar`,`warn`);return}let e=[`id`,`username`,`level`,`xp`,`coins`,`prestigio`,`cristales_ascension`,`multiplicador_xp`,`lecciones_completadas`],r=l.map(e=>{let t=Array.isArray(e.apuntes_completados)?e.apuntes_completados.length:0;return[`"${e.id||``}"`,`"${e.username||``}"`,e.level||1,e.xp||0,e.coins||0,e.prestigio||0,e.cristales_ascension||0,e.multiplicador_xp||1,t].join(`,`)}),i=`data:text/csv;charset=utf-8,`+encodeURIComponent([e.join(`,`),...r].join(`
`)),a=document.createElement(`a`);a.setAttribute(`href`,i),a.setAttribute(`download`,`apuntesdev_alumnos_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(a),a.click(),a.remove(),n(`Descarga CSV para Excel lista`,`success`),t(`Planilla CSV de ${l.length} alumnos descargada.`,`info`)}),document.getElementById(`btn-global-bonus`)?.addEventListener(`click`,async()=>{if(l.length===0||!confirm(`¿Confirmar inyección de +250 XP masiva a los ${l.length} estudiantes registrados?`))return;t(`Iniciando inyección masiva de experiencia en lote...`,`info`),n(`Aplicando bonificación global...`,`info`);let r=0;for(let t of l){let n=(t.xp||0)+250,{error:i}=await e.from(`profiles`).update({xp:n}).eq(`id`,t.id);i||(t.xp=n,r++)}n(`¡Bonificación aplicada a ${r} estudiantes!`,`success`),t(`[BATCH_SUCCESS] +250 XP aplicados a ${r} registros de profiles.`,`success`),d(l),f()}),document.getElementById(`btn-purge-cache`)?.addEventListener(`click`,()=>{confirm(`¿Deseas purgar toda la caché local del navegador y reiniciar las sesiones temporales?`)&&(localStorage.clear(),sessionStorage.clear(),n(`Caché purgada. Recargando estado...`,`info`),t(`[CACHE_PURGE] Almacenamiento local limpiado.`,`warn`),setTimeout(()=>window.location.reload(),1e3))}),document.getElementById(`btn-clear-terminal`)?.addEventListener(`click`,()=>{let e=document.getElementById(`terminal-screen`);e&&(e.innerHTML=`<div class="term-line info">[SYSTEM] Consola de auditoría reiniciada.</div>`)}),document.getElementById(`btn-copy-terminal`)?.addEventListener(`click`,()=>{let e=document.getElementById(`terminal-screen`);e&&(navigator.clipboard.writeText(e.innerText),n(`Logs de auditoría copiados al portapapeles`,`info`))}),await u()});