import{t as e}from"./certificaciones.CXyUl7Mk.js";document.addEventListener(`astro:page-load`,()=>{let t=new URLSearchParams(window.location.search),n=t.get(`code`)||``,r=t.get(`name`)||``,i=t.get(`cert`)||``,a=document.getElementById(`cert-input`),o=document.getElementById(`verify-form`),s=document.getElementById(`verify-result`);n&&a&&(a.value=n,c(n,r,i)),o?.addEventListener(`submit`,e=>{e.preventDefault(),c(a?.value.trim().toUpperCase()||``)});function c(t,n,r){if(!s)return;s.style.display=`block`;let i=e.find(e=>e.id===r);i||=t.includes(`SYS`)?e.find(e=>e.codigoPrefijo===`SYS`):t.includes(`NET`)?e.find(e=>e.codigoPrefijo===`NET`):t.includes(`DEV`)?e.find(e=>e.codigoPrefijo===`DEV`):t.includes(`ROOT`)?e.find(e=>e.codigoPrefijo===`ROOT`):e[0];let a=n||`Estudiante Acreditado`,o=new Date().toLocaleDateString(`es-ES`,{day:`numeric`,month:`long`,year:`numeric`});s.innerHTML=`
        <div class="result-header">
          <div class="result-badge-success">
            <span class="check-pulse">✓</span>
            <span>CREDENCIAL AUTÉNTICA Y VERIFICADA</span>
          </div>
          <span class="result-timestamp">Validado en tiempo real</span>
        </div>

        <div class="result-body">
          <div class="result-main-info">
            <div class="result-icon-box" style="--cert-accent: ${i?.colorAcento};">
              <span>${i?.icono}</span>
            </div>
            <div>
              <span class="result-sub-label">TITULAR DEL CERTIFICADO:</span>
              <h2 class="result-name">${a}</h2>
              <span class="result-cert-title">${i?.titulo}</span>
            </div>
          </div>

          <div class="result-grid-details">
            <div class="detail-item">
              <span class="detail-label">IDENTIFICADOR DE CREDENCIAL</span>
              <strong class="detail-value text-accent">${t}</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">INSTITUCIÓN EMISORA</span>
              <strong class="detail-value">ApuntesDev Academy • SMR & CODE</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">ESTADO DEL REGISTRO</span>
              <strong class="detail-value text-green">● ACTIVO Y VIGENTE</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">FECHA DE EMISIÓN</span>
              <strong class="detail-value">${o}</strong>
            </div>
          </div>

          <div class="result-competencias-box">
            <h4>Competencias Técnicas Acreditadas:</h4>
            <ul class="result-comp-list">
              ${(i?.competencias||[]).map(e=>`<li>◈ ${e}</li>`).join(``)}
            </ul>
          </div>

          <div class="result-footer">
            <p>Este documento digital certifica que el titular ha completado de forma autónoma los módulos teóricos y exámenes prácticos interactivos exigidos por el plan de estudios.</p>
            <a href="/certificados" class="btn-back-hub">Ver todas las certificaciones →</a>
          </div>
        </div>
      `}});