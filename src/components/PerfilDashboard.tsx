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
      {/* Tarjeta de configuración de alias integrada en el dashboard */}
      <div style={{ background: '#1e1e1e', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--accent-color)', marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem' }}>👤 Identidad del Estudiante</h3>
        <form onSubmit={handleGuardarUsername} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={username} 
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              placeholder="Introduce tu alias (ej. HackerSMR)" 
              maxLength={20}
              required 
              style={{ flexGrow: 1, background: '#121212', border: '1px solid #333', padding: '0.75rem 1rem', color: '#fff', borderRadius: '6px', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" disabled={guardando} style={{ background: 'var(--accent-color)', color: 'var(--bg-color)', border: 'none', padding: '0 1.5rem', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {guardando ? 'Guardando...' : 'Guardar Alias'}
            </button>
          </div>
          {mensajeExito && <p style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>¡Alias actualizado correctamente! ✅</p>}
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