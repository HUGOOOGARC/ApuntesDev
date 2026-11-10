import { useStore } from '@nanostores/preact';
import { perfilStore, completarApunte } from '../store/progreso';
import confetti from 'canvas-confetti';

export default function BotonCompletar({ idApunte }: { idApunte: string }) {
  const perfil = useStore(perfilStore);
  const estaCompletado = perfil.apuntesCompletados?.includes(idApunte) ?? false;

  const manejarClick = async () => {
    if (!estaCompletado) {
      // Usar el motor de progreso centralizado (aplica multiplicador XP, curva exponencial y guarda en Supabase)
      const resultado = await completarApunte(idApunte, 50, 10);
      
      if (resultado && resultado.completado) {
        // Efecto visual de confeti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4CAF50', '#81C784', '#FFD700', '#ffffff']
        });

        // Notificar a la interfaz
        window.dispatchEvent(new CustomEvent('recompensa-ganada', {
          detail: {
            xp: Math.floor(50 * perfil.multiplicadorXP),
            monedas: 10,
            titulo: '¡Apunte Dominado!'
          }
        }));
      }
    }
  };

  return (
    <button 
      onClick={manejarClick} 
      disabled={estaCompletado}
      className={`btn-completar ${estaCompletado ? 'dominado' : ''}`}
      aria-label={estaCompletado ? 'Apunte ya dominado' : 'Marcar apunte como completado y ganar 50 XP'}
    >
      {estaCompletado ? '✅ Apunte dominado' : '✨ Marcar como leído (+50 XP)'}
    </button>
  );
}
