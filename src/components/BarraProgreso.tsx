import { useStore } from '@nanostores/preact';
import { perfilStore, calcularXpNecesaria } from '../store/progreso';

export default function BarraProgreso() {
  // Con 'useStore', el componente reacciona a cualquier cambio en tiempo real
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);
  const porcentaje = Math.min((perfil.xp / xpNecesaria) * 100, 100);

  return (
    <div className="xp-hud">
      <div className="nivel-badge">
        Nvl. {perfil.nivel}
        {perfil.prestigio > 0 && <span className="prestigio-estrella"> ⭐{perfil.prestigio}</span>}
      </div>
      
      <div className="xp-barra-fondo">
        <div className="xp-barra-relleno" style={{ width: `${porcentaje}%` }}></div>
      </div>
      
      <span className="xp-texto">{perfil.xp} / {xpNecesaria} XP</span>
      
      <div className="monedas-badge">🪙 {perfil.monedas}</div>
    </div>
  );
}