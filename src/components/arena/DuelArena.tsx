import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import confetti from 'canvas-confetti';
import { perfilStore, registrarResultadoDuelo, cargarPerfilDesdeSupabase } from '../../store/progreso';
import { quizzes, type QuizItem } from '../../data/quizzes';

interface BotRival {
  id: string;
  nombre: string;
  alias: string;
  avatar: string;
  dificultad: 'facil' | 'medio' | 'dificil';
  aciertoRate: number; // 0 a 1
  minRespuestaTime: number; // segundos
  maxRespuestaTime: number;
  xpRecompensa: number;
  monedasRecompensa: number;
  prestigioRecompensa: number;
  color: string;
  fraseVictoria: string;
  fraseDerrota: string;
}

const RIVALES_BOT: BotRival[] = [
  {
    id: 'script-kiddie',
    nombre: 'Script-Kiddie Bot',
    alias: 'Novato en Bash',
    avatar: '🤖',
    dificultad: 'facil',
    aciertoRate: 0.55,
    minRespuestaTime: 6,
    maxRespuestaTime: 10,
    xpRecompensa: 40,
    monedasRecompensa: 25,
    prestigioRecompensa: 0,
    color: '#34d399',
    fraseVictoria: '¡Me has ganado! Aún estoy aprendiendo a usar sudo...',
    fraseDerrota: '¡Vaya, hasta un script en Bash te supera!'
  },
  {
    id: 'devops-sentinel',
    nombre: 'DevOps Sentinel v2',
    alias: 'Guardián de Docker & VLANs',
    avatar: '🛡️',
    dificultad: 'medio',
    aciertoRate: 0.78,
    minRespuestaTime: 4,
    maxRespuestaTime: 7,
    xpRecompensa: 90,
    monedasRecompensa: 50,
    prestigioRecompensa: 0,
    color: '#38bdf8',
    fraseVictoria: '¡Excelente despliegue! Tu arquitectura técnica es sólida.',
    fraseDerrota: 'Fallo de segmentación. Tus servicios cayeron en producción.'
  },
  {
    id: 'root-daemon',
    nombre: 'Root Archon Daemon',
    alias: 'Entidad de Kernel & OSPF',
    avatar: '👹',
    dificultad: 'dificil',
    aciertoRate: 0.92,
    minRespuestaTime: 2.5,
    maxRespuestaTime: 5,
    xpRecompensa: 180,
    monedasRecompensa: 100,
    prestigioRecompensa: 1,
    color: '#f43f5e',
    fraseVictoria: '¡Imposible! Has superado el nivel de privilegios root.',
    fraseDerrota: 'Permiso denegado. Estás a años luz del clúster central.'
  }
];

export default function DuelArena() {
  const perfil = useStore(perfilStore);

  // Estados de la Arena
  const [fase, setFase] = useState<'lobby' | 'combate' | 'resultado'>('lobby');
  const [rivalSeleccionado, setRivalSeleccionado] = useState<BotRival>(RIVALES_BOT[1]);
  const [preguntasDuelo, setPreguntasDuelo] = useState<QuizItem[]>([]);
  const [rondaActual, setRondaActual] = useState<number>(0);

  // Puntuación y Salud
  const [jugadorHp, setJugadorHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [jugadorPuntos, setJugadorPuntos] = useState<number>(0);
  const [rivalPuntos, setRivalPuntos] = useState<number>(0);

  // Temporizador de ronda
  const [tiempoRestante, setTiempoRestante] = useState<number>(15);
  const [esperandoSiguiente, setEsperandoSiguiente] = useState<boolean>(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [feedbackRonda, setFeedbackRonda] = useState<string | null>(null);

  // Referencias para timers
  const timerRef = useRef<any>(null);
  const botAnswerTimerRef = useRef<any>(null);

  useEffect(() => {
    cargarPerfilDesdeSupabase();
  }, []);

  // Preparar partida
  const iniciarDuelo = (bot: BotRival) => {
    setRivalSeleccionado(bot);

    // Seleccionar 5 preguntas aleatorias del repositorio de quizzes
    const todasLasPreguntas = Object.values(quizzes);
    const shuffled = [...todasLasPreguntas].sort(() => 0.5 - Math.random());
    const seleccionadas = shuffled.slice(0, 5);

    setPreguntasDuelo(seleccionadas);
    setRondaActual(0);
    setJugadorHp(100);
    setRivalHp(100);
    setJugadorPuntos(0);
    setRivalPuntos(0);
    setRespuestaSeleccionada(null);
    setFeedbackRonda(null);
    setEsperandoSiguiente(false);
    setTiempoRestante(15);
    setFase('combate');
  };

  // Temporizador principal de la ronda
  useEffect(() => {
    if (fase !== 'combate' || esperandoSiguiente) return;

    setTiempoRestante(15);
    setRespuestaSeleccionada(null);
    setFeedbackRonda(null);

    // Simular pensamiento del bot
    const tiempoBot = Math.floor(
      Math.random() * (rivalSeleccionado.maxRespuestaTime - rivalSeleccionado.minRespuestaTime) +
      rivalSeleccionado.minRespuestaTime
    );

    botAnswerTimerRef.current = setTimeout(() => {
      // El bot responde si el jugador aún no ha terminado la ronda
      const acierta = Math.random() < rivalSeleccionado.aciertoRate;
      if (acierta) {
        setRivalPuntos((prev) => prev + 100);
      }
    }, tiempoBot * 1000);

    // Cuenta atrás de 15 segundos
    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinTiempo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(botAnswerTimerRef.current);
    };
  }, [fase, rondaActual, esperandoSiguiente]);

  // Si el tiempo se agota sin responder
  const handleFinTiempo = () => {
    if (esperandoSiguiente) return;
    setEsperandoSiguiente(true);
    setJugadorHp((prev) => Math.max(0, prev - 25));
    setFeedbackRonda('⏰ ¡Tiempo agotado! Has recibido 25 de daño técnico.');

    setTimeout(siguienteRonda, 2500);
  };

  // Respuesta del jugador
  const handleResponder = (opcion: string) => {
    if (esperandoSiguiente || respuestaSeleccionada) return;

    clearInterval(timerRef.current);
    clearTimeout(botAnswerTimerRef.current);

    setRespuestaSeleccionada(opcion);
    setEsperandoSiguiente(true);

    const preg = preguntasDuelo[rondaActual];
    const acierto = opcion === preg.respuestaCorrecta;

    if (acierto) {
      // Bonificación por velocidad: mientras más rápido, más daño y puntos
      const bonusVelocidad = tiempoRestante * 5;
      const puntosGanados = 100 + bonusVelocidad;
      setJugadorPuntos((prev) => prev + puntosGanados);
      setRivalHp((prev) => Math.max(0, prev - 25));
      setFeedbackRonda(`⚡ ¡Impacto Crítico! Respuesta correcta (+${puntosGanados} pts)`);
    } else {
      setJugadorHp((prev) => Math.max(0, prev - 20));
      setFeedbackRonda(`❌ Error de sintaxis. La respuesta correcta era: "${preg.respuestaCorrecta}"`);
    }

    setTimeout(siguienteRonda, 2800);
  };

  // Pasar a la siguiente ronda o finalizar combate
  const siguienteRonda = () => {
    if (rondaActual + 1 < preguntasDuelo.length && jugadorHp > 0 && rivalHp > 0) {
      setRondaActual((prev) => prev + 1);
      setEsperandoSiguiente(false);
    } else {
      finalizarCombate();
    }
  };

  // Fin del duelo
  const finalizarCombate = async () => {
    setFase('resultado');
    const victoria = jugadorPuntos >= rivalPuntos || rivalHp <= 0;

    if (victoria) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      await registrarResultadoDuelo(
        true,
        rivalSeleccionado.xpRecompensa,
        rivalSeleccionado.monedasRecompensa,
        rivalSeleccionado.prestigioRecompensa
      );
    } else {
      await registrarResultadoDuelo(false, 0, 0, 0);
    }
  };

  const preguntaActual = preguntasDuelo[rondaActual];
  const victoriaFinal = jugadorPuntos >= rivalPuntos || rivalHp <= 0;

  return (
    <div className="arena-container">
      {/* 1. LOBBY DE SELECCIÓN DE OPONENTE */}
      {fase === 'lobby' && (
        <div className="arena-lobby reveal">
          <div className="arena-lobby-header">
            <span className="arena-tag">⚔️ CYBER ARENA // MODO DESAFÍO 1v1</span>
            <h2>Selecciona tu Oponente</h2>
            <p>
              Enfréntate a inteligencias simuladas en rondas a contrarreloj de 5 preguntas técnicas de SMR y Código.
            </p>
          </div>

          <div className="rivals-grid">
            {RIVALE_BOTS_MAPPING(RIVALES_BOT, iniciarDuelo)}
          </div>

          {/* HISTORIAL RÁPIDO DE LA ARENA */}
          <div className="arena-stats-footer">
            <div className="arena-stat-box">
              <span className="stat-label">Duelos Disputados</span>
              <strong>{perfil.duelosJugados || 0}</strong>
            </div>
            <div className="arena-stat-box">
              <span className="stat-label">Victorias en Combate</span>
              <strong className="text-green">{perfil.duelosGanados || 0}</strong>
            </div>
            <div className="arena-stat-box">
              <span className="stat-label">Efectividad de Victoria</span>
              <strong className="text-cyan">
                {perfil.duelosJugados
                  ? `${Math.round(((perfil.duelosGanados || 0) / perfil.duelosJugados) * 100)}%`
                  : '100%'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. PANTALLA DE COMBATE EN VIVO */}
      {fase === 'combate' && preguntaActual && (
        <div className="arena-battle-stage">
          {/* BARRA SUPERIOR DE DUELO */}
          <div className="battle-header-hud">
            {/* JUGADOR */}
            <div className="fighter-card player">
              <div className="fighter-avatar">👨‍💻</div>
              <div className="fighter-meta">
                <strong className="fighter-name">Tú ({perfil.tituloActivo || 'Cadete'})</strong>
                <div className="hp-bar-wrap">
                  <div className="hp-bar-fill green" style={{ width: `${jugadorHp}%` }}></div>
                </div>
                <span className="points-label">Puntos: <strong>{jugadorPuntos}</strong></span>
              </div>
            </div>

            {/* CENTRO: VS Y CRONÓMETRO */}
            <div className="battle-center-dial">
              <div className="round-pill">Ronda {rondaActual + 1} de 5</div>
              <div className={`countdown-circle ${tiempoRestante <= 5 ? 'critical' : ''}`}>
                <span className="countdown-number">{tiempoRestante}</span>
                <span className="countdown-unit">seg</span>
              </div>
              <span className="vs-badge">VS</span>
            </div>

            {/* RIVAL BOT */}
            <div className="fighter-card bot">
              <div className="fighter-avatar" style={{ borderColor: rivalSeleccionado.color }}>
                {rivalSeleccionado.avatar}
              </div>
              <div className="fighter-meta bot-align">
                <strong className="fighter-name" style={{ color: rivalSeleccionado.color }}>
                  {rivalSeleccionado.nombre}
                </strong>
                <div className="hp-bar-wrap">
                  <div
                    className="hp-bar-fill red"
                    style={{ width: `${rivalHp}%`, backgroundColor: rivalSeleccionado.color }}
                  ></div>
                </div>
                <span className="points-label">Puntos: <strong>{rivalPuntos}</strong></span>
              </div>
            </div>
          </div>

          {/* TARJETA DE PREGUNTA CENTRAL */}
          <div className="battle-question-card">
            <span className="question-category-tag">PREGUNTA TÉCNICA OFICIAL</span>
            <h3 className="battle-question-text">{preguntaActual.pregunta}</h3>

            {/* BOTONES DE RESPUESTA */}
            <div className="battle-options-grid">
              {preguntaActual.opciones.map((opcion, idx) => {
                let btnClass = 'battle-option-btn';
                if (esperandoSiguiente) {
                  if (opcion === preguntaActual.respuestaCorrecta) {
                    btnClass += ' correct';
                  } else if (opcion === respuestaSeleccionada) {
                    btnClass += ' wrong';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={btnClass}
                    disabled={esperandoSiguiente}
                    onClick={() => handleResponder(opcion)}
                  >
                    <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span className="option-text">{opcion}</span>
                  </button>
                );
              })}
            </div>

            {/* MENSAJE DE FEEDBACK EN TIEMPO REAL */}
            {feedbackRonda && (
              <div className={`battle-feedback-banner ${feedbackRonda.includes('Error') ? 'bad' : 'good'}`}>
                {feedbackRonda}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PANTALLA FINAL DE RESULTADO */}
      {fase === 'resultado' && (
        <div className="arena-result-card reveal">
          <div className="result-icon-burst">
            {victoriaFinal ? '🏆' : '💀'}
          </div>

          <h2 className="result-title">
            {victoriaFinal ? '¡Victoria en la Cyber Arena!' : 'Derrota en Combate Técnico'}
          </h2>

          <p className="result-quote">
            "{victoriaFinal ? rivalSeleccionado.fraseVictoria : rivalSeleccionado.fraseDerrota}"
          </p>

          <div className="scoreboard-grid">
            <div className="score-col">
              <span className="score-label">Tu Puntuación</span>
              <strong className="score-val text-green">{jugadorPuntos} pts</strong>
            </div>
            <div className="score-col vs-div">
              <span>VS</span>
            </div>
            <div className="score-col">
              <span className="score-label">{rivalSeleccionado.nombre}</span>
              <strong className="score-val text-red">{rivalPuntos} pts</strong>
            </div>
          </div>

          {victoriaFinal && (
            <div className="rewards-unlocked-card">
              <h4>Recompensas Reclamadas</h4>
              <div className="rewards-row">
                <span className="reward-item text-green">⚡ +{rivalSeleccionado.xpRecompensa} XP</span>
                <span className="reward-item text-gold">🪙 +{rivalSeleccionado.monedasRecompensa} Monedas</span>
                {rivalSeleccionado.prestigioRecompensa > 0 && (
                  <span className="reward-item text-gold">⭐ +{rivalSeleccionado.prestigioRecompensa} Prestigio</span>
                )}
              </div>
            </div>
          )}

          <div className="result-actions">
            <button
              type="button"
              className="btn-arena-primary"
              onClick={() => iniciarDuelo(rivalSeleccionado)}
            >
              🔄 Revancha Inmediata
            </button>
            <button
              type="button"
              className="btn-arena-secondary"
              onClick={() => setFase('lobby')}
            >
              🚪 Volver al Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RIVALE_BOTS_MAPPING(rivales: BotRival[], onSelect: (bot: BotRival) => void) {
  return rivales.map((bot) => (
    <div key={bot.id} className="rival-card" style={{ borderColor: `${bot.color}40` }}>
      <div className="rival-avatar-wrap" style={{ backgroundColor: `${bot.color}15`, borderColor: bot.color }}>
        <span className="bot-avatar">{bot.avatar}</span>
      </div>

      <div className="rival-header">
        <span className={`diff-tag ${bot.dificultad}`}>{bot.dificultad.toUpperCase()}</span>
        <h3 className="rival-name">{bot.nombre}</h3>
        <span className="rival-alias">{bot.alias}</span>
      </div>

      <div className="rival-specs">
        <div className="spec-row">
          <span>Precisión de IA:</span>
          <strong>{Math.round(bot.aciertoRate * 100)}%</strong>
        </div>
        <div className="spec-row">
          <span>Velocidad de respuesta:</span>
          <strong>~{bot.minRespuestaTime}s</strong>
        </div>
        <div className="spec-row">
          <span>Bote de recompensa:</span>
          <strong style={{ color: '#fbbf24' }}>🪙 +{bot.monedasRecompensa} | ⚡ +{bot.xpRecompensa} XP</strong>
        </div>
      </div>

      <button
        type="button"
        className="btn-challenge"
        style={{ backgroundColor: bot.color }}
        onClick={() => onSelect(bot)}
      >
        ⚔️ Retar a Duelo
      </button>
    </div>
  ));
}
