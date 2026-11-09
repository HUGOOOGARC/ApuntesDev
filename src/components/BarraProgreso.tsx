import { useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { perfilStore, calcularXpNecesaria, cargarPerfilDesdeSupabase } from '../store/progreso';

export default function BarraProgreso() {
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);
  const porcentaje = Math.min((perfil.xp / xpNecesaria) * 100, 100);

  useEffect(() => {
    // Sincroniza todos los datos (XP, nivel, monedas, prestigio, cristales, apuntes, temas) con Supabase
    cargarPerfilDesdeSupabase();
  }, []);

  return (
    <div className="xp-hud" title={`Nivel ${perfil.nivel} • ${perfil.xp}/${xpNecesaria} XP (${porcentaje.toFixed(0)}%) • 🪙 ${perfil.monedas} Monedas`}>
      {/* Nivel Badge */}
      <div className="nivel-badge">
        <span>Nvl. {perfil.nivel}</span>
        {perfil.prestigio > 0 && (
          <span className="prestigio-estrella" title={`Prestigio ${perfil.prestigio}`}>
            ⭐{perfil.prestigio}
          </span>
        )}
      </div>

      {/* Barra de progreso compacta */}
      <div className="xp-barra-fondo">
        <div
          className="xp-barra-relleno"
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>

      {/* Monedas Badge */}
      <div className="monedas-badge">
        <span>🪙 {perfil.monedas.toLocaleString()}</span>
      </div>
    </div>
  );
}
