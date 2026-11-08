import { useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { perfilStore, calcularXpNecesaria } from '../store/progreso';
import { supabase } from '../lib/supabase';

export default function BarraProgreso() {
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);
  const porcentaje = Math.min((perfil.xp / xpNecesaria) * 100, 100);

  useEffect(() => {
    async function sincronizarConSupabase() {
      // 1. Comprobar si hay una sesión activa de Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 2. Obtener los datos del usuario desde la tabla 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('xp, level, coins')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        // 3. Actualizar el Nano Store global con los datos reales de la nube
        perfilStore.set({
          ...perfil,
          xp: data.xp,
          nivel: data.level,
          monedas: data.coins,
        });
      }
    }

    sincronizarConSupabase();
  }, []);

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