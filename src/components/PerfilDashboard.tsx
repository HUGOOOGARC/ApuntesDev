import { useStore } from '@nanostores/preact';
import { useState, useEffect } from 'preact/hooks';
import { perfilStore, aplicarPrestigio, calcularXpNecesaria } from '../store/progreso';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function PerfilDashboard() {
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);

  const [username, setUsername] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Cargamos el username actual de Supabase al montar el componente
  useEffect(() => {
    async function cargarUsername() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        if (data && data.username) {
          setUsername(data.username);
        }
      }
    }
    cargarUsername();
  }, []);

  const handleGuardarUsername = async (e: Event) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeExito(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', session.user.id);

      if (!error) {
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
      } else {
        alert('Hubo un error al actualizar el nombre de usuario.');
      }
    }
    setGuardando(false);
  };

  const handlePrestigio = () => {
    if (perfil.nivel >= 50) {
      const exito = aplicarPrestigio();
      if (exito) {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 }, colors: ['#FFD700', '#FF8C00'] });
        alert("¡Has renacido! Tu multiplicador de XP ha aumentado permanentemente.");
      }
    }
  };

  return (
    <div className="dashboard-grid">
      {/* TARJETA DE CONFIGURACIÓN DE ALIAS */}
      <div className="config-alias-card">
        <h3>👤 Identidad del Estudiante</h3>
        <form onSubmit={handleGuardarUsername} className="form-alias">
          <div className="input-group-alias">
            <input 
              type="text" 
              value={username} 
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              placeholder="Introduce tu alias (ej. HackerSMR)" 
              maxLength={20}
              required 
            />
            <button type="submit" className="btn-guardar-alias" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Alias'}
            </button>
          </div>
          {mensajeExito && <p className="texto-exito">¡Alias actualizado correctamente! ✅</p>}
        </form>
      </div>

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