import { useStore } from '@nanostores/preact';
import { perfilStore, completarApunte } from '../store/progreso';
import confetti from 'canvas-confetti';

export default function BotonCompletar({ idApunte }: { idApunte: string }) {
  const perfil = useStore(perfilStore);
  const estaCompletado = perfil.apuntesCompletados.includes(idApunte);

  const manejarClick = () => {
    if (!estaCompletado) {
      completarApunte(idApunte, 50, 10);
      
      // Efecto visual de dopamina pura
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81C784', '#FFD700', '#ffffff'] // Tonos verdes y dorados
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