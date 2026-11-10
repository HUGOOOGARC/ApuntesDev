import { useState, useEffect, useRef } from 'preact/hooks';

// Catálogo de rutas rápidas y comandos
const ACCIONES = [
  { id: 'home', title: '🏠 Inicio', route: '/' },
  { id: 'herramientas', title: '🛠️ Herramientas del Técnico (Subnetting, Chmod, Terminal)', route: '/herramientas' },
  { id: 'sistemas', title: '🖥️ Sistemas Operativos (SOM/SOR)', route: '/sistemas' },
  { id: 'redes', title: '🌐 Redes de Computadores & Cisco', route: '/redes' },
  { id: 'programacion', title: '💻 Desarrollo y Programación', route: '/programacion' },
  { id: 'ranking', title: '🏆 Leaderboard Global', route: '/ranking' },
  { id: 'perfil', title: '👤 Mi Perfil y Estadísticas', route: '/perfil' },
  { id: 'duelo', title: '⚔️ Arena 1v1 (Duelo Técnico)', route: '/duelo' },
  { id: 'tienda', title: '🏪 Tienda de Recompensas', route: '/tienda' },
  { id: 'certificados', title: '🎓 Certificaciones & Diplomas', route: '/certificados' }
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Escuchar el atajo de teclado Ctrl+K / Cmd+K y Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus en el buscador al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
    } else {
      setQuery('');
      document.body.style.overflow = 'auto'; // Restaura el scroll
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resultados = ACCIONES.filter(accion => 
    accion.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cmd-backdrop" onClick={() => setIsOpen(false)}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-header">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Busca apuntes, rutas o comandos..." 
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
            className="cmd-input"
          />
          <span className="cmd-esc">ESC</span>
        </div>
        <div className="cmd-results">
          {resultados.length > 0 ? (
            resultados.map(res => (
              <a key={res.id} href={res.route} className="cmd-item">
                {res.title}
              </a>
            ))
          ) : (
            <div className="cmd-empty">No se encontraron resultados para "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
