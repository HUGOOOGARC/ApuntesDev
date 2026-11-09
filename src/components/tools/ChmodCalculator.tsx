import { useState, useMemo } from 'preact/hooks';

interface Permisos {
  r: boolean;
  w: boolean;
  x: boolean;
}

interface PermisosEspeciales {
  suid: boolean;
  sgid: boolean;
  sticky: boolean;
}

export default function ChmodCalculator() {
  const [propietario, setPropietario] = useState<Permisos>({ r: true, w: true, x: true }); // 7
  const [grupo, setGrupo] = useState<Permisos>({ r: true, w: false, x: true }); // 5
  const [otros, setOtros] = useState<Permisos>({ r: true, w: false, x: false }); // 4
  const [especiales, setEspeciales] = useState<PermisosEspeciales>({ suid: false, sgid: false, sticky: false });

  const [nombreArchivo, setNombreArchivo] = useState('script.sh');
  const [esRecursivo, setEsRecursivo] = useState(false);
  const [usuarioChown, setUsuarioChown] = useState('www-data');
  const [grupoChown, setGrupoChown] = useState('www-data');
  const [copiado, setCopiado] = useState<string | null>(null);

  // Calcular valor numérico de un grupo
  const calcularValor = (p: Permisos): number => {
    return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
  };

  const calcularEspecialesValor = (e: PermisosEspeciales): number => {
    return (e.suid ? 4 : 0) + (e.sgid ? 2 : 0) + (e.sticky ? 1 : 0);
  };

  const valorPropietario = useMemo(() => calcularValor(propietario), [propietario]);
  const valorGrupo = useMemo(() => calcularValor(grupo), [grupo]);
  const valorOtros = useMemo(() => calcularValor(otros), [otros]);
  const valorEspeciales = useMemo(() => calcularEspecialesValor(especiales), [especiales]);

  const octal = `${valorEspeciales > 0 ? valorEspeciales : ''}${valorPropietario}${valorGrupo}${valorOtros}`;
  const octal4Digits = `${valorEspeciales}${valorPropietario}${valorGrupo}${valorOtros}`;

  // Formato simbólico: ej. -rwxr-xr--
  const simbolico = useMemo(() => {
    const formatTriplet = (p: Permisos, specialChar?: string) => {
      let r = p.r ? 'r' : '-';
      let w = p.w ? 'w' : '-';
      let x = p.x ? 'x' : '-';

      if (specialChar === 'suid') {
        x = p.x ? 's' : 'S';
      } else if (specialChar === 'sgid') {
        x = p.x ? 's' : 'S';
      } else if (specialChar === 'sticky') {
        x = p.x ? 't' : 'T';
      }

      return `${r}${w}${x}`;
    };

    const u = formatTriplet(propietario, especiales.suid ? 'suid' : undefined);
    const g = formatTriplet(grupo, especiales.sgid ? 'sgid' : undefined);
    const o = formatTriplet(otros, especiales.sticky ? 'sticky' : undefined);

    return `-${u}${g}${o}`;
  }, [propietario, grupo, otros, especiales]);

  // Manejador para cuando el usuario escribe el octal directamente (sincronización bidireccional)
  const aplicarOctalString = (str: string) => {
    const clean = str.replace(/[^0-7]/g, '');
    let digits = clean;
    if (digits.length === 3) {
      setEspeciales({ suid: false, sgid: false, sticky: false });
      const u = parseInt(digits[0], 10);
      const g = parseInt(digits[1], 10);
      const o = parseInt(digits[2], 10);
      setPropietario({ r: !!(u & 4), w: !!(u & 2), x: !!(u & 1) });
      setGrupo({ r: !!(g & 4), w: !!(g & 2), x: !!(g & 1) });
      setOtros({ r: !!(o & 4), w: !!(o & 2), x: !!(o & 1) });
    } else if (digits.length === 4) {
      const s = parseInt(digits[0], 10);
      const u = parseInt(digits[1], 10);
      const g = parseInt(digits[2], 10);
      const o = parseInt(digits[3], 10);
      setEspeciales({ suid: !!(s & 4), sgid: !!(s & 2), sticky: !!(s & 1) });
      setPropietario({ r: !!(u & 4), w: !!(u & 2), x: !!(u & 1) });
      setGrupo({ r: !!(g & 4), w: !!(g & 2), x: !!(g & 1) });
      setOtros({ r: !!(o & 4), w: !!(o & 2), x: !!(o & 1) });
    }
  };

  const aplicarPreset = (u: number, g: number, o: number, s: number = 0) => {
    setEspeciales({ suid: !!(s & 4), sgid: !!(s & 2), sticky: !!(s & 1) });
    setPropietario({ r: !!(u & 4), w: !!(u & 2), x: !!(u & 1) });
    setGrupo({ r: !!(g & 4), w: !!(g & 2), x: !!(g & 1) });
    setOtros({ r: !!(o & 4), w: !!(o & 2), x: !!(o & 1) });
  };

  const copiarTexto = async (texto: string, clave: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(clave);
      setTimeout(() => setCopiado(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Explicación humana
  const explicacionHumana = useMemo(() => {
    const describe = (nombre: string, p: Permisos) => {
      const acciones = [];
      if (p.r) acciones.push('Leer');
      if (p.w) acciones.push('Escribir / Modificar');
      if (p.x) acciones.push('Ejecutar / Entrar');
      if (acciones.length === 0) return `${nombre}: Ningún acceso denegado total.`;
      return `${nombre}: Puede ${acciones.join(', ')}.`;
    };

    return [
      describe('Propietario (User)', propietario),
      describe('Grupo (Group)', grupo),
      describe('Otros (Others)', otros),
    ];
  }, [propietario, grupo, otros]);

  const comandoChmod = `chmod ${esRecursivo ? '-R ' : ''}${octal} ${nombreArchivo}`;
  const comandoChmodSimbolico = `chmod ${esRecursivo ? '-R ' : ''}u=${propietario.r ? 'r' : ''}${propietario.w ? 'w' : ''}${propietario.x ? 'x' : ''},g=${grupo.r ? 'r' : ''}${grupo.w ? 'w' : ''}${grupo.x ? 'x' : ''},o=${otros.r ? 'r' : ''}${otros.w ? 'w' : ''}${otros.x ? 'x' : ''} ${nombreArchivo}`;
  const comandoChown = `chown ${esRecursivo ? '-R ' : ''}${usuarioChown}:${grupoChown} ${nombreArchivo}`;

  const esPeligroso777 = valorPropietario === 7 && valorGrupo === 7 && valorOtros === 7;

  return (
    <div className="tool-card">
      <div className="tool-header">
        <div className="tool-icon-pill">🔒</div>
        <div>
          <h3>Generador Visual de Permisos Linux (chmod & chown)</h3>
          <p>Calcula permisos octales, notación simbólica y comandos de administración con validación en tiempo real.</p>
        </div>
      </div>

      {/* Presets Rápidos */}
      <div className="presets-bar">
        <span className="presets-label">Presets Recomendados:</span>
        <button type="button" onClick={() => aplicarPreset(6, 4, 4)} className="preset-btn">
          644 (Archivos Web / Conf)
        </button>
        <button type="button" onClick={() => aplicarPreset(7, 5, 5)} className="preset-btn">
          755 (Scripts / Directorios)
        </button>
        <button type="button" onClick={() => aplicarPreset(6, 0, 0)} className="preset-btn">
          600 (Claves SSH / Secretos)
        </button>
        <button type="button" onClick={() => aplicarPreset(7, 0, 0)} className="preset-btn">
          700 (Carpeta .ssh privada)
        </button>
        <button type="button" onClick={() => aplicarPreset(7, 7, 7)} className="preset-btn preset-btn--danger">
          777 (Total - No usar en Prod)
        </button>
        <button type="button" onClick={() => aplicarPreset(7, 7, 7, 1)} className="preset-btn">
          1777 (Directorio /tmp con Sticky)
        </button>
      </div>

      {/* Banner de Advertencia para 777 */}
      {esPeligroso777 && (
        <div className="warning-banner">
          ⚠️ <strong>Riesgo de Seguridad Crítico:</strong> El permiso <code>777</code> permite que cualquier usuario o proceso del sistema operativo lea, modifique o elimine el archivo. En servidores de producción se desaconseja totalmente; utiliza <code>755</code> o <code>644</code>.
        </div>
      )}

      {/* Matriz Interactiva de Permisos */}
      <div className="chmod-matrix-container">
        {/* Columna 1: Propietario */}
        <div className="permission-column">
          <div className="column-header">
            <span className="role-badge role-user">👤 Propietario (u)</span>
            <span className="octal-digit">{valorPropietario}</span>
          </div>
          <div className="checkboxes-stack">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={propietario.r}
                onChange={(e) => setPropietario({ ...propietario, r: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Lectura (r)</span>
              <span className="perm-val">+4</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={propietario.w}
                onChange={(e) => setPropietario({ ...propietario, w: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Escritura (w)</span>
              <span className="perm-val">+2</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={propietario.x}
                onChange={(e) => setPropietario({ ...propietario, x: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Ejecución (x)</span>
              <span className="perm-val">+1</span>
            </label>
          </div>
        </div>

        {/* Columna 2: Grupo */}
        <div className="permission-column">
          <div className="column-header">
            <span className="role-badge role-group">👥 Grupo (g)</span>
            <span className="octal-digit">{valorGrupo}</span>
          </div>
          <div className="checkboxes-stack">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={grupo.r}
                onChange={(e) => setGrupo({ ...grupo, r: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Lectura (r)</span>
              <span className="perm-val">+4</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={grupo.w}
                onChange={(e) => setGrupo({ ...grupo, w: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Escritura (w)</span>
              <span className="perm-val">+2</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={grupo.x}
                onChange={(e) => setGrupo({ ...grupo, x: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Ejecución (x)</span>
              <span className="perm-val">+1</span>
            </label>
          </div>
        </div>

        {/* Columna 3: Otros */}
        <div className="permission-column">
          <div className="column-header">
            <span className="role-badge role-others">🌍 Otros (o)</span>
            <span className="octal-digit">{valorOtros}</span>
          </div>
          <div className="checkboxes-stack">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={otros.r}
                onChange={(e) => setOtros({ ...otros, r: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Lectura (r)</span>
              <span className="perm-val">+4</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={otros.w}
                onChange={(e) => setOtros({ ...otros, w: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Escritura (w)</span>
              <span className="perm-val">+2</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={otros.x}
                onChange={(e) => setOtros({ ...otros, x: e.currentTarget.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="perm-label">Ejecución (x)</span>
              <span className="perm-val">+1</span>
            </label>
          </div>
        </div>
      </div>

      {/* Permisos Especiales (SUID, SGID, Sticky Bit) */}
      <div className="special-perms-box">
        <span className="special-title">Permisos Especiales Avanzados:</span>
        <div className="special-options-row">
          <label className="special-checkbox">
            <input
              type="checkbox"
              checked={especiales.suid}
              onChange={(e) => setEspeciales({ ...especiales, suid: e.currentTarget.checked })}
            />
            <span className="checkbox-custom"></span>
            <span><strong>SUID (+4000)</strong>: Ejecuta como propietario</span>
          </label>

          <label className="special-checkbox">
            <input
              type="checkbox"
              checked={especiales.sgid}
              onChange={(e) => setEspeciales({ ...especiales, sgid: e.currentTarget.checked })}
            />
            <span className="checkbox-custom"></span>
            <span><strong>SGID (+2000)</strong>: Ejecuta/hereda grupo</span>
          </label>

          <label className="special-checkbox">
            <input
              type="checkbox"
              checked={especiales.sticky}
              onChange={(e) => setEspeciales({ ...especiales, sticky: e.currentTarget.checked })}
            />
            <span className="checkbox-custom"></span>
            <span><strong>Sticky Bit (+1000)</strong>: Solo creador elimina</span>
          </label>
        </div>
      </div>

      {/* Panel de Comandos y Sincronización */}
      <div className="chmod-outputs-container">
        <div className="output-row">
          <div className="octal-input-box">
            <label>Octal Directo:</label>
            <input
              type="text"
              value={octal}
              maxLength={4}
              onInput={(e) => aplicarOctalString(e.currentTarget.value)}
              className="octal-input"
            />
          </div>

          <div className="symbolic-box">
            <label>Notación Simbólica:</label>
            <span className="symbolic-text">{simbolico}</span>
          </div>

          <div className="file-target-box">
            <label>Fichero o Carpeta destino:</label>
            <input
              type="text"
              value={nombreArchivo}
              onInput={(e) => setNombreArchivo(e.currentTarget.value)}
              placeholder="script.sh"
              className="file-input"
            />
          </div>

          <div className="recursive-box">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={esRecursivo}
                onChange={(e) => setEsRecursivo(e.currentTarget.checked)}
              />
              <span className="switch-slider"></span>
              <span>Recursivo (-R)</span>
            </label>
          </div>
        </div>

        {/* Comandos listos para copiar */}
        <div className="code-commands-grid">
          <div className="command-card">
            <div className="command-header">
              <span className="command-badge">Comando Numérico (Recomendado)</span>
              <button
                type="button"
                onClick={() => copiarTexto(comandoChmod, 'chmod-num')}
                className="copy-btn-sm"
              >
                {copiado === 'chmod-num' ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <pre><code>{comandoChmod}</code></pre>
          </div>

          <div className="command-card">
            <div className="command-header">
              <span className="command-badge">Comando Simbólico</span>
              <button
                type="button"
                onClick={() => copiarTexto(comandoChmodSimbolico, 'chmod-sym')}
                className="copy-btn-sm"
              >
                {copiado === 'chmod-sym' ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <pre><code>{comandoChmodSimbolico}</code></pre>
          </div>
        </div>

        {/* Generador de Chown */}
        <div className="chown-section">
          <div className="chown-inputs-row">
            <label>Cambiar Propietario y Grupo (<code>chown</code>):</label>
            <div className="chown-inputs">
              <input
                type="text"
                value={usuarioChown}
                onInput={(e) => setUsuarioChown(e.currentTarget.value)}
                placeholder="usuario"
                className="chown-user-input"
              />
              <span>:</span>
              <input
                type="text"
                value={grupoChown}
                onInput={(e) => setGrupoChown(e.currentTarget.value)}
                placeholder="grupo"
                className="chown-user-input"
              />
            </div>
          </div>
          <div className="chown-command-box">
            <code>{comandoChown}</code>
            <button
              type="button"
              onClick={() => copiarTexto(comandoChown, 'chown')}
              className="copy-btn-sm"
            >
              {copiado === 'chown' ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Explicación Humana */}
        <div className="human-explanation">
          <h4>💡 Explicación en Lenguaje Natural:</h4>
          <ul>
            {explicacionHumana.map((linea, idx) => (
              <li key={idx}>{linea}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
