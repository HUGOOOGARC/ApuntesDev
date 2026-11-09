import { useStore } from '@nanostores/preact';
import { useState, useEffect } from 'preact/hooks';
import { perfilStore, aplicarPrestigio, calcularXpNecesaria } from '../store/progreso';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function PerfilDashboard() {
  const perfil = useStore(perfilStore);
  const xpNecesaria = calcularXpNecesaria(perfil.nivel);
  
  // Cálculo del porcentaje de la barra de nivel
  const porcentajeNivel = Math.min((perfil.xp / xpNecesaria) * 100, 100).toFixed(1);

  const [username, setUsername] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Cálculos para el radar de habilidades basados en los apuntes completados
  const totalApuntes = perfil.apuntesCompletados ? perfil.apuntesCompletados.length : 0;
  const countSom = perfil.apuntesCompletados.filter(id => id.includes('som') || id.includes('sor') || id.includes('linux') || id.includes('active-directory') || id.includes('sistemas')).length;
  const countRedes = perfil.apuntesCompletados.filter(id => id.includes('redes') || id.includes('routing') || id.includes('vlan') || id.includes('subnetting') || id.includes('dhcp') || id.includes('dns') || id.includes('cisco') || id.includes('switch') || id.includes('servicios-red')).length;
  const countProg = perfil.apuntesCompletados.filter(id => id.includes('python') || id.includes('backend') || id.includes('frontend') || id.includes('programacion')).length;

  const statsSistemas = Math.min((countSom * 25), 100);
  const statsRedes = Math.min((countRedes * 25), 100);
  const statsProg = Math.min((countProg * 25), 100);

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

  const handleGuardarUsername = async (e: any) => {
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
      
      {/* BENTO GRID PRINCIPAL */}
      <div className="bento-grid">
        
        {/* CARD 1: IDENTIDAD, ALIAS Y PROGRESO DE NIVEL */}
        <article className="bento-card bento-wide">
          <div className="perfil-header">
            <div className="avatar-box">
              <span className="avatar-emoji">👨‍💻</span>
            </div>
            <div className="perfil-info">
              <h2>{username ? username : 'Operador Anónimo'}</h2>
              <div className="badges-row">
                <span className="nivel-badge">Nivel {perfil.nivel}</span>
                <span className="prestigio-badge">⭐ Prestigio {perfil.prestigio}</span>
                <span className="boost-badge">⚡ x{perfil.multiplicadorXP} XP</span>
              </div>
            </div>
          </div>

          {/* Formulario de Alias integrado */}
          <form onSubmit={handleGuardarUsername} className="alias-form">
            <input 
              type="text" 
              value={username} 
              onInput={(e: any) => setUsername(e.target.value)}
              placeholder="Introduce tu alias" 
              maxLength={20}
              required 
              className="alias-input"
            />
            <button type="submit" disabled={guardando} className="alias-btn">
              {guardando ? 'Guardando...' : 'Actualizar Alias'}
            </button>
            {mensajeExito && <span className="exito-text">¡Actualizado! ✅</span>}
          </form>
          
          <div className="progreso-container" style={{ marginTop: '1.5rem' }}>
            <div className="progreso-stats">
              <span>Progreso de Nivel {perfil.nivel}</span>
              <span>{perfil.xp} / {xpNecesaria} XP ({porcentajeNivel}%)</span>
            </div>
            <div className="barra-fondo">
              <div className="barra-relleno" style={{ width: `${porcentajeNivel}%` }}></div>
            </div>
          </div>
        </article>

        {/* CARD 2: BÓVEDA FINANCIERA */}
        <article className="bento-card bento-square vault-card">
          <h3>Bóveda de Créditos</h3>
          <div className="monedas-display">
            <span className="moneda-icon">🪙</span>
            <span className="moneda-valor">{perfil.monedas}</span>
          </div>
          <p className="vault-desc">Acumula créditos completando apuntes para adquirir temas y personalizaciones en la tienda.</p>
        </article>

        {/* CARD 3: RADAR DE HABILIDADES */}
        <article className="bento-card bento-square">
          <h3>Radar de Habilidades</h3>
          
          <div className="skill-row">
            <div className="skill-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <a href="/sistemas" style={{ color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span>🖥️</span> <span>Sistemas (SOM/SOR)</span>
              </a>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{countSom} leídos</span>
            </div>
            <div className="skill-barra-fondo">
              <div className="skill-barra-relleno" style={{ width: `${statsSistemas}%`, background: '#4ade80' }}></div>
            </div>
          </div>

          <div className="skill-row" style={{ marginTop: '1rem' }}>
            <div className="skill-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <a href="/redes" style={{ color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span>🌐</span> <span>Redes & Telecom</span>
              </a>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{countRedes} leídos</span>
            </div>
            <div className="skill-barra-fondo">
              <div className="skill-barra-relleno" style={{ width: `${statsRedes}%`, background: '#38bdf8' }}></div>
            </div>
          </div>
          
          <div className="skill-row" style={{ marginTop: '1rem' }}>
            <div className="skill-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <a href="/programacion" style={{ color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span>💻</span> <span>Programación & Web</span>
              </a>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{countProg} leídos</span>
            </div>
            <div className="skill-barra-fondo">
              <div className="skill-barra-relleno" style={{ width: `${statsProg}%`, background: '#a78bfa' }}></div>
            </div>
          </div>
        </article>

        {/* CARD 4: PROTOCOLO DE ASCENSIÓN (PRESTIGIO) */}
        <article className="bento-card bento-square prestigio-bento">
          <h3>Renacimiento (Endgame)</h3>
          <p className="prestigio-desc">Al alcanzar el Nivel 50, reinicia tu rango a cambio de un +25% permanente en la XP global.</p>
          <button 
            className={`btn-prestigio-bento ${perfil.nivel >= 50 ? 'activo' : 'bloqueado'}`}
            onClick={handlePrestigio}
            disabled={perfil.nivel < 50}
          >
            {perfil.nivel >= 50 ? '🔥 Activar Prestigio' : `Requiere Nivel 50 (${perfil.nivel}/50)`}
          </button>
        </article>

        {/* CARD 5: VITRINA DE LOGROS (GLASSMORPHISM) */}
        <article className="bento-card bento-wide logros-card">
          <h3>Vitrina de Logros ({totalApuntes} Apuntes Dominados)</h3>
          <div className="logros-grid">
            <div className={`logro-item ${totalApuntes >= 1 ? 'unlocked' : ''}`}>
              <div className="logro-icon">🚀</div>
              <h4>Primeros Pasos</h4>
              <p>Completa tu primer apunte.</p>
            </div>
            <div className={`logro-item ${countRedes >= 1 ? 'unlocked' : ''}`}>
              <div className="logro-icon">🌐</div>
              <h4>NetAdmin Junior</h4>
              <p>Domina tu primer apunte de redes.</p>
            </div>
            <div className={`logro-item ${perfil.nivel >= 5 ? 'unlocked' : ''}`}>
              <div className="logro-icon">⚡</div>
              <h4>Operador Nivel 5</h4>
              <p>Alcanza el nivel 5 de experiencia.</p>
            </div>
            <div className={`logro-item ${totalApuntes >= 10 ? 'unlocked' : ''}`}>
              <div className="logro-icon">🧠</div>
              <h4>Cerebro Máquina</h4>
              <p>Domina 10 apuntes en total.</p>
            </div>
          </div>
        </article>

      </div>
    </div>
  );
}
