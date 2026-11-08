import { useStore } from '@nanostores/preact';
import { perfilStore, completarApunte } from '../store/progreso';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function BotonCompletar({ idApunte }: { idApunte: string }) {
  const perfil = useStore(perfilStore);
  const estaCompletado = perfil.apuntesCompletados.includes(idApunte);

  const manejarClick = async () => {
    if (!estaCompletado) {
      // 1. Actualizar el estado local (Nano Store)
      completarApunte(idApunte, 50, 10);
      
      // 2. Calcular los nuevos valores para enviarlos a Supabase
      const nuevaXp = perfil.xp + 50;
      const nuevasMonedas = perfil.monedas + 10;
      // Puedes incluir tu lógica de cálculo de nivel si sube de rango
      const nuevoNivel = nuevaXp >= perfil.nivel * 100 ? perfil.nivel + 1 : perfil.nivel;

      // 3. Sincronizar con Supabase si el usuario ha iniciado sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({
            xp: nuevaXp,
            coins: nuevasMonedas,
            level: nuevoNivel
          })
          .eq('id', session.user.id);
      }
      
      // 4. Efecto visual de dopamina pura
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81C784', '#FFD700', '#ffffff']
      });
    }
  };

  return (
    <button 
      onClick={manejarClick} 
      disabled={estaCompletado}
      className={`btn-completar ${estaCompletado ? 'dominado' : ''}`}
    >
      {estaCompletado ? '✅ Apunte dominado' : '✨ Marcar como leído (+50 XP)'}
    </button>
  );
}