import { useState } from 'preact/hooks';

export default function Quiz({ pregunta, opciones, respuestaCorrecta }) {
  const [seleccion, setSeleccion] = useState(null);
  const [resultado, setResultado] = useState(null);

  const evaluarRespuesta = () => {
    if (seleccion === respuestaCorrecta) {
      setResultado('¡Correcto! 🎉');
    } else {
      setResultado('Incorrecto. La respuesta era: ' + respuestaCorrecta + ' ❌');
    }
  };

  return (
    <div className="quiz-container">
      <h3>📝 Repaso: {pregunta}</h3>
      <div className="quiz-opciones">
        {opciones.map((opcion, index) => (
          <label key={index} className="quiz-label">
            <input
              type="radio"
              name="quiz"
              value={opcion}
              onChange={(e) => setSeleccion(e.target.value)}
              disabled={resultado !== null} // Desactiva las opciones tras responder
            />
            {opcion}
          </label>
        ))}
      </div>
      <button 
        className="quiz-boton" 
        onClick={evaluarRespuesta} 
        disabled={!seleccion || resultado !== null}
      >
        Comprobar
      </button>
      {resultado && <p className="quiz-resultado">{resultado}</p>}
    </div>
  );
}