import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import confetti from 'canvas-confetti';
import {
  perfilStore,
  comprarTemaNormal,
  comprarTemaPremium,
  equiparTema,
  comprarTitulo,
  equiparTitulo,
  comprarBoosterXP,
  abrirCofreMisterioso,
  cargarPerfilDesdeSupabase
} from '../../store/progreso';

interface TemaItem {
  id: string;
  nombre: string;
  descripcion: string;
  precioMonedas?: number;
  precioCristales?: number;
  acento: string;
  bgPreview: string;
  rarity: 'normal' | 'rare' | 'epic' | 'legendary';
}

interface TituloItem {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  precioCristales?: number;
  tag: string;
}

const TEMAS_CATALOGO: TemaItem[] = [
  {
    id: 'default',
    nombre: 'Terminal Clásica',
    descripcion: 'Aspecto nativo Cyber Dark con acentos esmeralda y alto contraste de lectura.',
    precioMonedas: 0,
    acento: '#10b981',
    bgPreview: '#0b0c10',
    rarity: 'normal'
  },
  {
    id: 'kali',
    nombre: 'Kali Linux Red',
    descripcion: 'Paleta inspirada en auditoría de seguridad y pentesting ofensivo. Acentos crimson vibrantes.',
    precioMonedas: 150,
    acento: '#f43f5e',
    bgPreview: '#120008',
    rarity: 'rare'
  },
  {
    id: 'dracula',
    nombre: 'Dracula Night',
    descripcion: 'El legendario tema para desarrolladores con tonos violeta neón y fondos azul medianoche.',
    precioMonedas: 300,
    acento: '#bd93f9',
    bgPreview: '#1e1f2b',
    rarity: 'rare'
  },
  {
    id: 'matrix',
    nombre: 'Matrix Digital Rain',
    descripcion: 'Fondo negro absoluto con verde fósforo terminal 00ff41. La pura experiencia hacker.',
    precioMonedas: 500,
    acento: '#00ff41',
    bgPreview: '#000000',
    rarity: 'epic'
  },
  {
    id: 'nord',
    nombre: 'Nord Arctic Ice',
    descripcion: 'Paleta ártica fría y nórdica, diseñada para reducir la fatiga visual en sesiones maratonianas.',
    precioMonedas: 400,
    acento: '#88c0d0',
    bgPreview: '#2e3440',
    rarity: 'epic'
  },
  {
    id: 'cyberpunk',
    nombre: 'Cyberpunk 2077',
    descripcion: 'Luces de neón amarillo eléctrico y azul cibernético inspirados en la metrópolis de Night City.',
    precioMonedas: 750,
    acento: '#f9e800',
    bgPreview: '#05050f',
    rarity: 'epic'
  },
  {
    id: 'obsidian',
    nombre: 'Obsidian Gold Deluxe',
    descripcion: 'El acabado definitivo reservado para arquitectos de prestigio. Negro obsidiana y oro puro reluciente.',
    precioCristales: 1,
    acento: '#ffd700',
    bgPreview: '#0b0b0e',
    rarity: 'legendary'
  }
];

const TITULOS_CATALOGO: TituloItem[] = [
  { id: 'cadete', titulo: 'Cadete Técnico', descripcion: 'El rango inicial de todo aspirante a SMR y desarrollo.', precio: 0, tag: 'INICIAL' },
  { id: 'script-hunter', titulo: 'Script Hunter', descripcion: 'Especialista en depuración de scripts Bash y Python.', precio: 80, tag: 'NOVATO' },
  { id: 'net-admin', titulo: 'NetAdmin Junior', descripcion: 'Domina VLANs, direccionamiento IPv4 y switches Cisco.', precio: 180, tag: 'AVANZADO' },
  { id: 'sysadmin', titulo: 'SysAdmin Supremo', descripcion: 'Control absoluto sobre servicios systemd, permisos y fstab.', precio: 320, tag: 'VETERANO' },
  { id: 'fullstack', titulo: 'Full-Stack Daemon', descripcion: 'Capaz de levantar APIs en FastAPI y UIs dinámicas en Preact.', precio: 500, tag: 'MAESTRO' },
  { id: 'kernel-overlord', titulo: 'Kernel Overlord', descripcion: 'El terror de los procesos en segundo plano y cuellos de botella.', precio: 850, tag: 'ÉLITE' },
  { id: 'root-archon', titulo: 'Arquitecto Root', descripcion: 'Máxima autoridad del clúster académico de ApuntesDev.', precio: 0, precioCristales: 1, tag: 'LEGENDARIO' }
];

export default function CyberStore() {
  const perfil = useStore(perfilStore);
  const [activeTab, setActiveTab] = useState<'temas' | 'titulos' | 'boosters' | 'cofres'>('temas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openingCofre, setOpeningCofre] = useState<boolean>(false);
  const [cofreResultado, setCofreResultado] = useState<{ tipo: string; cantidad: number } | null>(null);

  useEffect(() => {
    cargarPerfilDesdeSupabase();
  }, []);

  useEffect(() => {
    if (perfil.temaActivo) {
      document.documentElement.setAttribute('data-theme', perfil.temaActivo);
    }
  }, [perfil.temaActivo]);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Manejo de compra/equipar Temas
  const handleTemaAction = async (tema: TemaItem) => {
    const yaDesbloqueado = perfil.temasDesbloqueados.includes(tema.id);
    const yaEquipado = perfil.temaActivo === tema.id;

    if (yaEquipado) return;

    if (yaDesbloqueado) {
      await equiparTema(tema.id);
      notify(`🎨 Tema "${tema.nombre}" equipado.`);
      return;
    }

    // Compra con Cristales
    if (tema.precioCristales && tema.precioCristales > 0) {
      if (perfil.cristalesAscension < tema.precioCristales) {
        notify('❌ Necesitas al menos 1 Cristal de Ascensión 💎 (Prestigio requerido).');
        return;
      }
      const ok = await comprarTemaPremium(tema.id, tema.precioCristales);
      if (ok) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        notify(`✨ ¡Tema Legendario "${tema.nombre}" desbloqueado y equipado!`);
      }
      return;
    }

    // Compra con Monedas
    const precio = tema.precioMonedas || 0;
    if (perfil.monedas < precio) {
      notify(`❌ Monedas insuficientes. Necesitas 🪙 ${precio}.`);
      return;
    }

    const ok = await comprarTemaNormal(tema.id, precio);
    if (ok) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      notify(`🎉 ¡Tema "${tema.nombre}" comprado y equipado!`);
    }
  };

  // 2. Manejo de Títulos
  const handleTituloAction = async (item: TituloItem) => {
    const titulos = perfil.titulosDesbloqueados || ['Cadete Técnico'];
    const yaDesbloqueado = titulos.includes(item.titulo);
    const yaEquipado = (perfil.tituloActivo || 'Cadete Técnico') === item.titulo;

    if (yaEquipado) return;

    if (yaDesbloqueado) {
      await equiparTitulo(item.titulo);
      notify(`🏷️ Título honorífico "${item.titulo}" equipado en tu perfil.`);
      return;
    }

    if (item.precioCristales && item.precioCristales > 0) {
      if (perfil.cristalesAscension < item.precioCristales) {
        notify('❌ Requiere 1 Cristal de Ascensión 💎.');
        return;
      }
      // Deducción de cristal y desbloqueo de título legendario
      const ok = await comprarTitulo(item.titulo, 0);
      if (ok) {
        perfilStore.set({
          ...perfil,
          cristalesAscension: perfil.cristalesAscension - item.precioCristales
        });
        confetti({ particleCount: 150, spread: 90 });
        notify(`👑 ¡Título Legendario "${item.titulo}" desbloqueado!`);
      }
      return;
    }

    if (perfil.monedas < item.precio) {
      notify(`❌ Te faltan monedas. Cuesta 🪙 ${item.precio}.`);
      return;
    }

    const ok = await comprarTitulo(item.titulo, item.precio);
    if (ok) {
      confetti({ particleCount: 70, spread: 60 });
      notify(`🎉 ¡Título "${item.titulo}" adquirido y activo!`);
    }
  };

  // 3. Manejo de Boosters de XP
  const handleComprarBooster = async (delta: number, precioMonedas: number, precioCristales: number = 0) => {
    const ok = await comprarBoosterXP(delta, precioMonedas, precioCristales);
    if (ok) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      notify(`⚡ ¡Overclock aplicado! Tu multiplicador ahora es de ${perfil.multiplicadorXP}x permanente.`);
    } else {
      notify('❌ Recursos insuficientes para adquirir este acelerador.');
    }
  };

  // 4. Apertura de Cofre Misterioso
  const handleAbrirCofre = async (precio: number) => {
    if (perfil.monedas < precio) {
      notify(`❌ Monedas insuficientes. Requiere 🪙 ${precio}.`);
      return;
    }

    setOpeningCofre(true);
    setCofreResultado(null);

    setTimeout(async () => {
      const res = await abrirCofreMisterioso(precio);
      setOpeningCofre(false);
      if (res) {
        setCofreResultado(res);
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 } });
      }
    }, 1200);
  };

  const titulosUsuario = perfil.titulosDesbloqueados || ['Cadete Técnico'];
  const tituloActual = perfil.tituloActivo || 'Cadete Técnico';

  return (
    <div className="store-container">
      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="store-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER HUD DE SALDOS */}
      <div className="store-hud-bar">
        <div className="hud-identity">
          <div className="hud-avatar">🛍️</div>
          <div>
            <span className="hud-title">Mercado de la Academia</span>
            <span className="hud-user-title">Título: <strong>{tituloActual}</strong></span>
          </div>
        </div>

        <div className="hud-currencies">
          <div className="hud-currency-pill gold">
            <span className="currency-icon">🪙</span>
            <div className="currency-data">
              <span className="currency-label">Monedas</span>
              <strong className="currency-val">{perfil.monedas.toLocaleString()}</strong>
            </div>
          </div>

          <div className="hud-currency-pill blue">
            <span className="currency-icon">💎</span>
            <div className="currency-data">
              <span className="currency-label">Cristales</span>
              <strong className="currency-val">{perfil.cristalesAscension}</strong>
            </div>
          </div>

          <div className="hud-currency-pill purple">
            <span className="currency-icon">⚡</span>
            <div className="currency-data">
              <span className="currency-label">Factor XP</span>
              <strong className="currency-val">{perfil.multiplicadorXP}x</strong>
            </div>
          </div>

          <div className="hud-currency-pill star">
            <span className="currency-icon">⭐</span>
            <div className="currency-data">
              <span className="currency-label">Prestigio</span>
              <strong className="currency-val">{perfil.prestigio}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="store-tabs">
        <button
          type="button"
          className={`store-tab-btn ${activeTab === 'temas' ? 'active' : ''}`}
          onClick={() => setActiveTab('temas')}
        >
          🎨 Temas de Sistema ({TEMAS_CATALOGO.length})
        </button>

        <button
          type="button"
          className={`store-tab-btn ${activeTab === 'titulos' ? 'active' : ''}`}
          onClick={() => setActiveTab('titulos')}
        >
          🏷️ Títulos Honoríficos ({TITULOS_CATALOGO.length})
        </button>

        <button
          type="button"
          className={`store-tab-btn ${activeTab === 'boosters' ? 'active' : ''}`}
          onClick={() => setActiveTab('boosters')}
        >
          ⚡ Aceleradores XP
        </button>

        <button
          type="button"
          className={`store-tab-btn ${activeTab === 'cofres' ? 'active' : ''}`}
          onClick={() => setActiveTab('cofres')}
        >
          🎁 Cofres Misteriosos
        </button>
      </div>

      {/* CONTENIDO 1: CATÁLOGO DE TEMAS */}
      {activeTab === 'temas' && (
        <div className="catalog-grid">
          {TEMAS_CATALOGO.map((tema) => {
            const desbloqueado = perfil.temasDesbloqueados.includes(tema.id);
            const equipado = perfil.temaActivo === tema.id;

            return (
              <div
                key={tema.id}
                className={`item-card ${equipado ? 'equipped-card' : ''} rarity-${tema.rarity}`}
              >
                <div className="card-top-indicator">
                  <span className={`rarity-tag ${tema.rarity}`}>
                    {tema.rarity.toUpperCase()}
                  </span>
                  {equipado && <span className="equipped-badge">EN USO</span>}
                </div>

                {/* MINIATURA PREVIA DEL TEMA */}
                <div
                  className="theme-preview-box"
                  style={{
                    backgroundColor: tema.bgPreview,
                    borderColor: tema.acento
                  }}
                >
                  <div className="preview-terminal-header">
                    <span className="pdot" style={{ backgroundColor: tema.acento }}></span>
                    <span className="pdot" style={{ backgroundColor: tema.acento, opacity: 0.5 }}></span>
                  </div>
                  <div className="preview-body" style={{ color: tema.acento }}>
                    <span className="prompt-sym">❯</span> {tema.nombre}
                    <div className="preview-cursor" style={{ backgroundColor: tema.acento }}></div>
                  </div>
                </div>

                <div className="item-info">
                  <h3 className="item-title">{tema.nombre}</h3>
                  <p className="item-desc">{tema.descripcion}</p>
                </div>

                <div className="item-actions">
                  {equipado ? (
                    <button type="button" disabled className="btn-store equipped">
                      ✓ Equipado
                    </button>
                  ) : desbloqueado ? (
                    <button
                      type="button"
                      onClick={() => handleTemaAction(tema)}
                      className="btn-store equip"
                    >
                      Equipar Tema
                    </button>
                  ) : tema.precioCristales ? (
                    <button
                      type="button"
                      onClick={() => handleTemaAction(tema)}
                      className="btn-store buy-crystal"
                      disabled={perfil.cristalesAscension < tema.precioCristales}
                    >
                      💎 {tema.precioCristales} Cristal
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTemaAction(tema)}
                      className="btn-store buy-coins"
                      disabled={perfil.monedas < (tema.precioMonedas || 0)}
                    >
                      🪙 {tema.precioMonedas} Monedas
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENIDO 2: CATÁLOGO DE TÍTULOS */}
      {activeTab === 'titulos' && (
        <div className="catalog-grid">
          {TITULOS_CATALOGO.map((item) => {
            const desbloqueado = titulosUsuario.includes(item.titulo);
            const equipado = tituloActual === item.titulo;

            return (
              <div
                key={item.id}
                className={`item-card ${equipado ? 'equipped-card' : ''}`}
              >
                <div className="card-top-indicator">
                  <span className="rarity-tag">{item.tag}</span>
                  {equipado && <span className="equipped-badge">ACTIVO</span>}
                </div>

                <div className="title-banner-box">
                  <span className="banner-icon">🏷️</span>
                  <h4 className="banner-title-text">{item.titulo}</h4>
                </div>

                <div className="item-info">
                  <p className="item-desc">{item.descripcion}</p>
                </div>

                <div className="item-actions">
                  {equipado ? (
                    <button type="button" disabled className="btn-store equipped">
                      ✓ Mostrando en Perfil
                    </button>
                  ) : desbloqueado ? (
                    <button
                      type="button"
                      onClick={() => handleTituloAction(item)}
                      className="btn-store equip"
                    >
                      Mostrar Título
                    </button>
                  ) : item.precioCristales ? (
                    <button
                      type="button"
                      onClick={() => handleTituloAction(item)}
                      className="btn-store buy-crystal"
                      disabled={perfil.cristalesAscension < item.precioCristales}
                    >
                      💎 {item.precioCristales} Cristal
                    </button>
                  ) : item.precio === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleTituloAction(item)}
                      className="btn-store equip"
                    >
                      Gratis • Equipar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTituloAction(item)}
                      className="btn-store buy-coins"
                      disabled={perfil.monedas < item.precio}
                    >
                      🪙 {item.precio} Monedas
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENIDO 3: ACELERADORES XP (BOOSTERS) */}
      {activeTab === 'boosters' && (
        <div className="catalog-grid boosters-grid">
          <div className="item-card booster-card">
            <div className="booster-icon-wrap cyan">
              <span>⚡</span>
            </div>
            <h3 className="item-title">Microchip Overclock v1</h3>
            <p className="item-desc">
              Aumenta permanentemente tu multiplicador de experiencia en <strong>+0.10x</strong> en todas las lecciones y quizzes.
            </p>
            <div className="booster-effect-box">
              <span>Efecto Permanente:</span>
              <strong>{perfil.multiplicadorXP}x ➔ {parseFloat((perfil.multiplicadorXP + 0.1).toFixed(2))}x</strong>
            </div>
            <button
              type="button"
              className="btn-store buy-coins"
              disabled={perfil.monedas < 350}
              onClick={() => handleComprarBooster(0.1, 350)}
            >
              🪙 350 Monedas
            </button>
          </div>

          <div className="item-card booster-card">
            <div className="booster-icon-wrap purple">
              <span>🚀</span>
            </div>
            <h3 className="item-title">Tarjeta de Red Cuántica v2</h3>
            <p className="item-desc">
              Optimizador neural de alto rendimiento. Añade <strong>+0.25x</strong> a tu factor de ganancia de XP de por vida.
            </p>
            <div className="booster-effect-box">
              <span>Efecto Permanente:</span>
              <strong>{perfil.multiplicadorXP}x ➔ {parseFloat((perfil.multiplicadorXP + 0.25).toFixed(2))}x</strong>
            </div>
            <button
              type="button"
              className="btn-store buy-coins"
              disabled={perfil.monedas < 750}
              onClick={() => handleComprarBooster(0.25, 750)}
            >
              🪙 750 Monedas
            </button>
          </div>

          <div className="item-card booster-card legendary-card">
            <div className="booster-icon-wrap gold">
              <span>💎</span>
            </div>
            <h3 className="item-title">Núcleo de Singularidad Root</h3>
            <p className="item-desc">
              Mejora de grado Endgame. Añade un colosal <strong>+0.50x</strong> de experiencia permanente a tu cuenta.
            </p>
            <div className="booster-effect-box">
              <span>Efecto Permanente:</span>
              <strong>{perfil.multiplicadorXP}x ➔ {parseFloat((perfil.multiplicadorXP + 0.5).toFixed(2))}x</strong>
            </div>
            <button
              type="button"
              className="btn-store buy-crystal"
              disabled={perfil.cristalesAscension < 1}
              onClick={() => handleComprarBooster(0.5, 0, 1)}
            >
              💎 1 Cristal de Ascensión
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO 4: COFRES MISTERIOSOS (LOOT CRATES) */}
      {activeTab === 'cofres' && (
        <div className="catalog-grid crates-grid">
          {/* COFRE 1 */}
          <div className="item-card crate-card">
            <div className="crate-visual">
              <span className={`crate-icon ${openingCofre ? 'shake-anim' : ''}`}>📦</span>
            </div>
            <h3 className="item-title">Cofre de Memoria RAM</h3>
            <p className="item-desc">
              Contiene recursos técnicos aleatorios. Posibilidades:
            </p>
            <ul className="crate-loot-list">
              <li>⚡ 100 - 350 XP (60% probabilidad)</li>
              <li>🪙 120 - 450 Monedas (30% probabilidad)</li>
              <li>💎 1 Cristal de Ascensión (10% probabilidad)</li>
            </ul>

            <button
              type="button"
              className="btn-store buy-coins btn-open-crate"
              disabled={perfil.monedas < 120 || openingCofre}
              onClick={() => handleAbrirCofre(120)}
            >
              {openingCofre ? 'Desencriptando...' : 'Abrir por 🪙 120'}
            </button>
          </div>

          {/* COFRE 2 */}
          <div className="item-card crate-card legendary-crate">
            <div className="crate-visual">
              <span className={`crate-icon gold-crate ${openingCofre ? 'shake-anim' : ''}`}>🗄️</span>
            </div>
            <h3 className="item-title">Servidor Rack Blade Enterprise</h3>
            <p className="item-desc">
              Loot de nivel superior para ingenieros intrépidos:
            </p>
            <ul className="crate-loot-list">
              <li>⚡ 250 - 600 XP multiplicada</li>
              <li>🪙 Bote de hasta 600 Monedas</li>
              <li>💎 Alta probabilidad de Cristal Épico</li>
            </ul>

            <button
              type="button"
              className="btn-store buy-coins btn-open-crate"
              disabled={perfil.monedas < 240 || openingCofre}
              onClick={() => handleAbrirCofre(240)}
            >
              {openingCofre ? 'Desencriptando...' : 'Abrir por 🪙 240'}
            </button>
          </div>

          {/* MODAL DE RESULTADO DEL COFRE */}
          {cofreResultado && (
            <div className="crate-result-overlay" onClick={() => setCofreResultado(null)}>
              <div className="crate-result-card" onClick={(e) => e.stopPropagation()}>
                <span className="result-sparkle">✨</span>
                <h3>¡Recompensa Desbloqueada!</h3>
                <div className="reward-display">
                  {cofreResultado.tipo === 'xp' && (
                    <div className="reward-badge xp">
                      <span className="r-icon">⚡</span>
                      <strong>+{cofreResultado.cantidad} XP</strong>
                    </div>
                  )}
                  {cofreResultado.tipo === 'monedas' && (
                    <div className="reward-badge coins">
                      <span className="r-icon">🪙</span>
                      <strong>+{cofreResultado.cantidad} Monedas</strong>
                    </div>
                  )}
                  {cofreResultado.tipo === 'cristal' && (
                    <div className="reward-badge crystal">
                      <span className="r-icon">💎</span>
                      <strong>+1 Cristal de Ascensión</strong>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-store equip"
                  onClick={() => setCofreResultado(null)}
                >
                  Reclamar al Inventario
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
