import { useStore } from '@nanostores/preact';
import { perfilStore, completarApunte } from '../store/progreso';

export default function BotonCompletar({ idApunte }: { idApunte: string }) {
  const perfil = useStore(perfilStore);
  
  // Verificamos si este apunte concreto ya está en la lista de completados
  const estaCompletado = perfil.apuntesCompletados.includes(idApunte);

  const manejarClick = () => {
    if (!estaCompletado) {
      completarApunte(idApunte, 50, 10); // Da 50 XP y 10 Monedas
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