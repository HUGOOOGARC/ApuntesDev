import { useStore } from '@nanostores/preact';
import { perfilStore, aplicarPrestigio, calcularXpNecesaria } from '../store/progreso';
import confetti from 'canvas-confetti';

export default function PerfilDashboard() {
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);

  const handlePrestigio = () => {
    if (perfil.nivel >= 50) {
      const exito = aplicarPrestigio();
      if (exito) {
        // Super explosión de confeti por hacer Prestigio
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 }, colors: ['#FFD700', '#FF8C00'] });
        alert("¡Has renacido! Tu multiplicador de XP ha aumentado permanentemente.");
      }
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">Nivel Actual</span>
          <span className="stat-value">{perfil.nivel}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Experiencia</span>
          <span className="stat-value xp">{perfil.xp} <small>/ {xpNecesaria}</small></span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Monedas</span>
          <span className="stat-value oro">🪙 {perfil.monedas}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Boost de XP</span>
          <span className="stat-value">x{perfil.multiplicadorXP}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rango Prestigio</span>
          <span className="stat-value oro">⭐ {perfil.prestigio}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Apuntes Leídos</span>
          <span className="stat-value">{perfil.apuntesCompletados.length}</span>
        </div>
      </div>

      <div className="prestigio-box">
        <h3>Sistema de Renacimiento</h3>
        <p>Alcanza el <strong>Nivel 50</strong> para reiniciar tus estadísticas a cambio de un +25% permanente en toda la XP que ganes y subir de Rango de Prestigio.</p>
        <button 
          className={`btn-prestigio ${perfil.nivel >= 50 ? 'activo' : 'bloqueado'}`}
          onClick={handlePrestigio}
          disabled={perfil.nivel < 50}
        >
          {perfil.nivel >= 50 ? '🔥 Activar Prestigio' : `Bloqueado (Requiere Nivel 50)`}
        </button>
      </div>
    </div>
  );
}