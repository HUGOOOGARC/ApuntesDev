import{t as e}from"./supabase.Cj3_0XfG.js";document.addEventListener(`astro:page-load`,async()=>{let t=document.getElementById(`ranking-table-body`);if(!t)return;let{data:n,error:r}=await e.from(`profiles`).select(`*`).order(`level`,{ascending:!1}).order(`xp`,{ascending:!1});r?(console.error(`Error al cargar el ranking:`,r),t.innerHTML=`<tr><td colspan="6" style="text-align: center; color: #e53935; padding: 2rem;">Error al cargar los datos del leaderboard.</td></tr>`):n&&n.length>0?(t.innerHTML=``,n.forEach((e,n)=>{let r=n+1,i=``,a=``;r===1?(i=`🥇 `,a=`podium-1`):r===2?(i=`🥈 `,a=`podium-2`):r===3&&(i=`🥉 `,a=`podium-3`);let o=(e.username||`E`).charAt(0).toUpperCase(),s=document.createElement(`tr`);a&&(s.className=a),s.innerHTML=`
          <td class="col-posicion">
            <span class="posicion-badge">${i}#${r}</span>
          </td>
          <td>
            <div class="user-cell">
              <div class="user-avatar">${o}</div>
              <span class="user-name"><strong>${e.username||`Estudiante Anónimo`}</strong></span>
            </div>
          </td>
          <td><span class="badge-nivel">Nvl. ${e.level||1}</span></td>
          <td><code class="xp-code">${(e.xp||0).toLocaleString()} XP</code></td>
          <td class="oro">🪙 ${(e.coins||0).toLocaleString()}</td>
          <td>⭐ ${e.prestigio||0}</td>
        `,t.appendChild(s)})):t.innerHTML=`<tr><td colspan="6" style="text-align: center; color: #777; padding: 2rem;">No hay estudiantes registrados todavía.</td></tr>`});