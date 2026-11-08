import { useStore } from '@nanostores/preact';
import { perfilStore, comprarTema, equiparTema } from '../store/progreso';
import { useEffect } from 'preact/hooks';
import confetti from 'canvas-confetti';

const CATALOGO_TEMAS = [
  { id: 'default', nombre: 'Terminal Clásica', precio: 0, color: '#4CAF50' },
  { id: 'kali', nombre: 'Kali Linux', precio: 150, color: '#e53935' },
  { id: 'dracula', nombre: 'Tema Drácula', precio: 300, color: '#bd93f9' },
  { id: 'hacker', nombre: 'Matrix', precio: 500, color: '#00ff00' }
];

export default function TiendaTemas() {
  const perfil = useStore(perfilStore);

  // Efecto para aplicar el tema en vivo al HTML cuando cambie en el store
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', perfil.temaActivo);
  }, [perfil.temaActivo]);

  const handleComprar = (idTema: string, precio: number) => {
    if (comprarTema(idTema, precio)) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      alert("No tienes suficientes monedas.");
    }
  };

  return (
    <div className="tienda-container">
      <h2>Tienda de Temas</h2>
      <p>Personaliza tu entorno de estudio. Tienes <strong style={{color: '#FFD700'}}>🪙 {perfil.monedas}</strong></p>
      
      <div className="temas-grid">
        {CATALOGO_TEMAS.map((tema) => {
          const desbloqueado = perfil.temasDesbloqueados.includes(tema.id);
          const equipado = perfil.temaActivo === tema.id;
          
          return (
            <div className={`tema-card ${equipado ? 'equipado' : ''}`} key={tema.id}>
              <div className="tema-preview" style={{ borderColor: tema.color }}>
                <span style={{ color: tema.color }}>{tema.nombre}</span>
              </div>
              
              <div className="tema-acciones">
                {equipado ? (
                  <button disabled className="btn-equipado">Equipado</button>
                ) : desbloqueado ? (
                  <button onClick={() => equiparTema(tema.id)} className="btn-equipar">Equipar</button>
                ) : (
                  <button 
                    onClick={() => handleComprar(tema.id, tema.precio)} 
                    className="btn-comprar"
                    disabled={perfil.monedas < tema.precio}
                  >
                    🪙 {tema.precio}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}