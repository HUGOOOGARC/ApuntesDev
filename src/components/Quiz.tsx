import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { perfilStore, completarApunte } from '../store/progreso';
import confetti from 'canvas-confetti';
import type { QuizItem } from '../data/quizzes';

interface Props {
  apunteId: string;
  quiz: QuizItem;
}

export default function Quiz({ apunteId, quiz }: Props) {
  const perfil = useStore(perfilStore);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [esCorrecto, setEsCorrecto] = useState<boolean>(false);
  const [yaCompletadoPreviamente, setYaCompletadoPreviamente] = useState<boolean>(false);

  const storageKey = `quiz_done_${apunteId}`;

  useEffect(() => {
    try {
      const previo = localStorage.getItem(storageKey);
      const enPerfil = perfil.apuntesCompletados?.includes(apunteId);
      if (previo === 'true' || enPerfil) {
        setYaCompletadoPreviamente(true);
        setRespondido(true);
        setEsCorrecto(true);
        setSeleccion(quiz.respuestaCorrecta);
      }
    } catch (e) {
      // Ignorar errores de localStorage en entornos restringidos
    }
  }, [apunteId, perfil.apuntesCompletados]);

  const evaluarRespuesta = async () => {
    if (!seleccion || respondido) return;

    const acertado = seleccion === quiz.respuestaCorrecta;
    setRespondido(true);
    setEsCorrecto(acertado);

    if (acertado && !yaCompletadoPreviamente) {
      // Disparar confeti
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#4ade80', '#38bdf8', '#ffd700', '#ffffff']
      });

      // Guardar en localStorage
      try {
        localStorage.setItem(storageKey, 'true');
        setYaCompletadoPreviamente(true);
      } catch (e) {}

      // Llamar al motor de progreso centralizado: suma XP con multiplicador, sube nivel según la curva, añade monedas, registra apunte completado y sincroniza con Supabase
      await completarApunte(apunteId, quiz.xpBonus, 15);

      // Notificar al botón global de completar apunte si está presente en la página
      window.dispatchEvent(new CustomEvent('recompensa-ganada', {
        detail: {
          xp: quiz.xpBonus,
          monedas: 15,
          titulo: '¡Quiz Superado con Éxito!'
        }
      }));
    }
  };

  const reintentar = () => {
    setRespondido(false);
    setSeleccion(null);
    setEsCorrecto(false);
  };

  return (
    <section className="quiz-card" aria-label="Desafío Técnico de Repaso">
      {/* Encabezado del Quiz */}
      <div className="quiz-header">
        <div className="quiz-badge">
          <span className="quiz-pulse"></span>
          <span>TEST DE CONOCIMIENTOS</span>
        </div>
        <span className="quiz-reward">+{quiz.xpBonus} XP Bonus</span>
      </div>

      <h3 className="quiz-pregunta">{quiz.pregunta}</h3>

      {/* Opciones */}
      <div className="quiz-opciones">
        {quiz.opciones.map((opcion, index) => {
          const estaSeleccionada = seleccion === opcion;
          let estadoClase = '';
          if (respondido) {
            if (opcion === quiz.respuestaCorrecta) {
              estadoClase = 'correcta';
            } else if (estaSeleccionada && !esCorrecto) {
              estadoClase = 'incorrecta';
            }
          } else if (estaSeleccionada) {
            estadoClase = 'seleccionada';
          }

          return (
            <button
              key={index}
              type="button"
              className={`quiz-opcion-btn ${estadoClase}`}
              onClick={() => !respondido && setSeleccion(opcion)}
              disabled={respondido}
            >
              <span className="opcion-radio">
                <span className="opcion-radio-inner"></span>
              </span>
              <span className="opcion-texto">{opcion}</span>
              {respondido && opcion === quiz.respuestaCorrecta && (
                <span className="check-icon">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer y Acciones */}
      <div className="quiz-footer">
        {!respondido ? (
          <button
            type="button"
            className="btn-evaluar"
            onClick={evaluarRespuesta}
            disabled={!seleccion}
          >
            Comprobar Respuesta →
          </button>
        ) : (
          <div className="quiz-feedback-box">
            {esCorrecto ? (
              <div className="feedback-correcto">
                <div className="feedback-title">
                  <span>🎉 ¡Excelente respuesta!</span>
                  <span className="bonus-tag">+{quiz.xpBonus} XP</span>
                </div>
                <p className="feedback-desc">{quiz.explicacion}</p>
              </div>
            ) : (
              <div className="feedback-incorrecto">
                <div className="feedback-title">
                  <span>❌ No es del todo correcto</span>
                </div>
                <p className="feedback-desc">{quiz.explicacion}</p>
                <button type="button" className="btn-reintentar" onClick={reintentar}>
                  Intentar de nuevo ↻
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .quiz-card {
          margin: 3.5rem 0 2rem;
          background: linear-gradient(145deg, rgba(17, 19, 27, 0.9) 0%, rgba(10, 12, 18, 0.95) 100%);
          border: 1px solid rgba(74, 222, 128, 0.25);
          border-radius: 20px;
          padding: 2.2rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(74, 222, 128, 0.08);
          position: relative;
          overflow: hidden;
        }

        .quiz-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quiz-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: var(--accent-color);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
        }

        .quiz-pulse {
          width: 6px;
          height: 6px;
          background: var(--accent-color);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--accent-color);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .quiz-reward {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffd700;
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid rgba(255, 215, 0, 0.25);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }

        .quiz-pregunta {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem 0;
          line-height: 1.4;
        }

        .quiz-opciones {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .quiz-opcion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          color: #e2e8f0;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quiz-opcion-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(74, 222, 128, 0.4);
          transform: translateX(4px);
        }

        .quiz-opcion-btn.seleccionada {
          background: rgba(74, 222, 128, 0.12);
          border-color: var(--accent-color);
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.2);
        }

        .quiz-opcion-btn.correcta {
          background: rgba(74, 222, 128, 0.18) !important;
          border-color: #4ade80 !important;
          color: #4ade80 !important;
        }

        .quiz-opcion-btn.incorrecta {
          background: rgba(248, 113, 113, 0.18) !important;
          border-color: #f87171 !important;
          color: #f87171 !important;
        }

        .opcion-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }

        .quiz-opcion-btn.seleccionada .opcion-radio {
          border-color: var(--accent-color);
        }

        .opcion-radio-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.2s;
        }

        .quiz-opcion-btn.seleccionada .opcion-radio-inner {
          background: var(--accent-color);
        }

        .opcion-texto {
          flex-grow: 1;
        }

        .check-icon {
          font-weight: 900;
          color: #4ade80;
        }

        .btn-evaluar {
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
          color: #060809;
          padding: 0.85rem 1.75rem;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px var(--accent-glow);
        }

        .btn-evaluar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--accent-glow);
        }

        .btn-evaluar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .feedback-correcto {
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .feedback-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
          color: #4ade80;
          margin-bottom: 0.4rem;
        }

        .bonus-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background: rgba(74, 222, 128, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .feedback-desc {
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .feedback-incorrecto {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }

        .feedback-incorrecto .feedback-title {
          color: #f87171;
        }

        .btn-reintentar {
          background: transparent;
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #f87171;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          margin-top: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-reintentar:hover {
          background: rgba(248, 113, 113, 0.15);
          border-color: #f87171;
        }
      `}</style>
    </section>
  );
}
