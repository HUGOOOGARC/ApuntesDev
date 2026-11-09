import { useState, useMemo } from 'preact/hooks';

// Helper para convertir octetos a número de 32 bits y viceversa
function ipToInt(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');
}

function intToBinary(int: number): string[] {
  return [
    ((int >>> 24) & 255).toString(2).padStart(8, '0'),
    ((int >>> 16) & 255).toString(2).padStart(8, '0'),
    ((int >>> 8) & 255).toString(2).padStart(8, '0'),
    (int & 255).toString(2).padStart(8, '0'),
  ];
}

function isValidIpv4(ip: string): boolean {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const n = parseInt(p, 10);
    return n >= 0 && n <= 255;
  });
}

function getIpClass(firstOctet: number): { clase: string; privada: boolean; tipo: string } {
  if (firstOctet === 10) return { clase: 'Clase A', privada: true, tipo: 'Privada (RFC 1918)' };
  if (firstOctet === 172) return { clase: 'Clase B', privada: true, tipo: 'Privada (RFC 1918)' };
  if (firstOctet === 192) return { clase: 'Clase C', privada: true, tipo: 'Privada (RFC 1918)' };
  if (firstOctet === 127) return { clase: 'Loopback', privada: false, tipo: 'Loopback Localhost' };
  if (firstOctet >= 1 && firstOctet <= 126) return { clase: 'Clase A', privada: false, tipo: 'Pública de Internet' };
  if (firstOctet >= 128 && firstOctet <= 191) return { clase: 'Clase B', privada: false, tipo: 'Pública de Internet' };
  if (firstOctet >= 192 && firstOctet <= 223) return { clase: 'Clase C', privada: false, tipo: 'Pública de Internet' };
  if (firstOctet >= 224 && firstOctet <= 239) return { clase: 'Clase D', privada: false, tipo: 'Multicast' };
  return { clase: 'Clase E', privada: false, tipo: 'Experimental / Reservada' };
}

export default function SubnettingCalculator() {
  const [ipInput, setIpInput] = useState('192.168.1.130');
  const [cidr, setCidr] = useState(26);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [mostrarSubredes, setMostrarSubredes] = useState(false);
  const [nuevaMascara, setNuevaMascara] = useState(28);

  const ipValida = isValidIpv4(ipInput);

  // Cálculos de subred
  const calculos = useMemo(() => {
    if (!ipValida) return null;

    const ipNum = ipToInt(ipInput);
    const maskNum = cidr === 0 ? 0 : ((~0 << (32 - cidr)) >>> 0);
    const wildcardNum = (~maskNum) >>> 0;
    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | wildcardNum) >>> 0;

    const totalIps = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalIps - 2;

    const firstHostNum = cidr >= 31 ? netNum : netNum + 1;
    const lastHostNum = cidr >= 31 ? bcastNum : bcastNum - 1;

    const firstOctet = (ipNum >>> 24) & 255;
    const claseInfo = getIpClass(firstOctet);

    return {
      ipStr: ipInput.trim(),
      ipNum,
      maskStr: intToIp(maskNum),
      maskNum,
      wildcardStr: intToIp(wildcardNum),
      networkStr: intToIp(netNum),
      netNum,
      broadcastStr: intToIp(bcastNum),
      bcastNum,
      firstHostStr: intToIp(firstHostNum),
      lastHostStr: intToIp(lastHostNum),
      totalIps,
      usableHosts,
      claseInfo,
      ipBinary: intToBinary(ipNum),
      maskBinary: intToBinary(maskNum),
    };
  }, [ipInput, cidr, ipValida]);

  // Generador de VLSM / subredes divididas
  const listaSubredes = useMemo(() => {
    if (!calculos || !mostrarSubredes || nuevaMascara <= cidr) return [];

    const numSubredes = Math.min(Math.pow(2, nuevaMascara - cidr), 64); // Límite de seguridad
    const tamano = Math.pow(2, 32 - nuevaMascara);
    const res = [];

    for (let i = 0; i < numSubredes; i++) {
      const net = (calculos.netNum + i * tamano) >>> 0;
      const bcast = (net + tamano - 1) >>> 0;
      const first = nuevaMascara >= 31 ? net : net + 1;
      const last = nuevaMascara >= 31 ? bcast : bcast - 1;
      res.push({
        indice: i + 1,
        red: intToIp(net),
        rango: `${intToIp(first)} - ${intToIp(last)}`,
        broadcast: intToIp(bcast),
        hosts: nuevaMascara >= 31 ? 2 : tamano - 2,
      });
    }
    return res;
  }, [calculos, mostrarSubredes, nuevaMascara, cidr]);

  const copiarTexto = async (texto: string, clave: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(clave);
      setTimeout(() => setCopiado(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="tool-card">
      <div className="tool-header">
        <div className="tool-icon-pill">🌐</div>
        <div>
          <h3>Calculadora Visual de Subnetting IPv4 & VLSM</h3>
          <p>Desglose a nivel de bits, rangos útiles de hosts y cálculo de máscaras en tiempo real.</p>
        </div>
      </div>

      {/* Controles de Entrada */}
      <div className="tool-controls-grid">
        <div className="control-group">
          <label htmlFor="ip-input">Dirección IPv4</label>
          <div className="input-with-button">
            <input
              id="ip-input"
              type="text"
              value={ipInput}
              onInput={(e) => setIpInput(e.currentTarget.value)}
              placeholder="ej: 192.168.1.130"
              className={`tool-input ${!ipValida ? 'input-error' : ''}`}
            />
          </div>
          {!ipValida && <span className="error-hint">Formato IPv4 inválido (ej: 192.168.1.1)</span>}
        </div>

        <div className="control-group">
          <div className="label-row">
            <label htmlFor="cidr-slider">Máscara CIDR</label>
            <span className="cidr-highlight">/{cidr} ({calculos ? calculos.maskStr : '...'})</span>
          </div>
          <input
            id="cidr-slider"
            type="range"
            min="1"
            max="32"
            value={cidr}
            onInput={(e) => {
              const val = parseInt(e.currentTarget.value, 10);
              setCidr(val);
              if (val >= nuevaMascara) setNuevaMascara(Math.min(val + 1, 30));
            }}
            className="cidr-slider"
          />
          <div className="slider-ticks">
            <span>/8</span>
            <span>/16</span>
            <span>/24</span>
            <span>/26</span>
            <span>/30</span>
            <span>/32</span>
          </div>
        </div>
      </div>

      {/* Botones de presets rápidos de clase */}
      <div className="presets-bar">
        <span className="presets-label">Presets Rápidos:</span>
        <button type="button" onClick={() => { setIpInput('10.0.0.1'); setCidr(8); }} className="preset-btn">
          Clase A (/8)
        </button>
        <button type="button" onClick={() => { setIpInput('172.16.0.1'); setCidr(16); }} className="preset-btn">
          Clase B (/16)
        </button>
        <button type="button" onClick={() => { setIpInput('192.168.1.1'); setCidr(24); }} className="preset-btn">
          Clase C (/24)
        </button>
        <button type="button" onClick={() => { setIpInput('192.168.10.128'); setCidr(26); }} className="preset-btn">
          Subred /26 (62 hosts)
        </button>
        <button type="button" onClick={() => { setIpInput('10.255.0.1'); setCidr(30); }} className="preset-btn">
          Enlace Punto a Punto (/30)
        </button>
      </div>

      {calculos && (
        <>
          {/* Desglose visual de Bits */}
          <div className="bit-matrix-section">
            <div className="bit-matrix-header">
              <h4>Desglose Binario de 32 Bits (Red vs Host)</h4>
              <div className="bit-legend">
                <span className="legend-item"><span className="legend-dot red-dot"></span> Bits de Red ({cidr})</span>
                <span className="legend-item"><span className="legend-dot host-dot"></span> Bits de Host ({32 - cidr})</span>
              </div>
            </div>

            <div className="octets-container">
              {calculos.ipBinary.map((octetBin, octetIndex) => (
                <div key={octetIndex} className="octet-block">
                  <div className="octet-title">Octeto {octetIndex + 1} ({parseInt(octetBin, 2)})</div>
                  <div className="bits-row">
                    {octetBin.split('').map((bit, bitIndex) => {
                      const absoluteBitIndex = octetIndex * 8 + bitIndex;
                      const isNetworkBit = absoluteBitIndex < cidr;
                      return (
                        <span
                          key={bitIndex}
                          className={`bit-badge ${isNetworkBit ? 'bit-net' : 'bit-host'}`}
                          title={`Bit ${absoluteBitIndex + 1}: ${isNetworkBit ? 'RED' : 'HOST'}`}
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas de Resultados */}
          <div className="results-grid">
            <div className="result-card">
              <span className="result-label">Dirección de Red (Network ID)</span>
              <div className="result-value-row">
                <span className="result-value accent-text">{calculos.networkStr}</span>
                <button
                  type="button"
                  onClick={() => copiarTexto(calculos.networkStr, 'net')}
                  className="copy-chip"
                >
                  {copiado === 'net' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Dirección de Broadcast</span>
              <div className="result-value-row">
                <span className="result-value">{calculos.broadcastStr}</span>
                <button
                  type="button"
                  onClick={() => copiarTexto(calculos.broadcastStr, 'bcast')}
                  className="copy-chip"
                >
                  {copiado === 'bcast' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Rango Útil de Hosts</span>
              <div className="result-value-row">
                <span className="result-value text-small">
                  {calculos.firstHostStr} <span className="arrow-sep">→</span> {calculos.lastHostStr}
                </span>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Máscara Decimal</span>
              <div className="result-value-row">
                <span className="result-value">{calculos.maskStr}</span>
                <button
                  type="button"
                  onClick={() => copiarTexto(calculos.maskStr, 'mask')}
                  className="copy-chip"
                >
                  {copiado === 'mask' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Wildcard Mask (Cisco OSPF / ACL)</span>
              <div className="result-value-row">
                <span className="result-value">{calculos.wildcardStr}</span>
                <button
                  type="button"
                  onClick={() => copiarTexto(calculos.wildcardStr, 'wild')}
                  className="copy-chip"
                >
                  {copiado === 'wild' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Capacidad de Hosts Útiles</span>
              <div className="result-value-row">
                <span className="result-value highlight-num">
                  {calculos.usableHosts.toLocaleString()} <span className="unit-label">hosts</span>
                </span>
                <span className="total-badge">({calculos.totalIps.toLocaleString()} IPs en total)</span>
              </div>
            </div>

            <div className="result-card">
              <span className="result-label">Clasificación IPv4</span>
              <div className="result-value-row">
                <span className="result-value">{calculos.claseInfo.clase}</span>
                <span className="scope-tag">{calculos.claseInfo.tipo}</span>
              </div>
            </div>
          </div>

          {/* Sección Expandible: División en Subredes VLSM */}
          <div className="vlsm-accordion">
            <button
              type="button"
              onClick={() => setMostrarSubredes(!mostrarSubredes)}
              className="vlsm-toggle-btn"
            >
              <span>⚡ {mostrarSubredes ? 'Ocultar' : 'Calcular'} División en Subredes (VLSM) para esta red</span>
              <span>{mostrarSubredes ? '▲' : '▼'}</span>
            </button>

            {mostrarSubredes && (
              <div className="vlsm-panel">
                <div className="vlsm-controls">
                  <label>Dividir /{cidr} usando nueva máscara más específica:</label>
                  <select
                    value={nuevaMascara}
                    onChange={(e) => setNuevaMascara(parseInt(e.currentTarget.value, 10))}
                    className="tool-select"
                  >
                    {Array.from({ length: 32 - cidr }, (_, i) => cidr + 1 + i).map((m) => (
                      <option key={m} value={m}>
                        /{m} — Genera {Math.pow(2, m - cidr)} subredes de {Math.pow(2, 32 - m) - 2} hosts c/u
                      </option>
                    ))}
                  </select>
                </div>

                <div className="subnets-table-wrapper">
                  <table className="subnets-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subred (ID Red)</th>
                        <th>Rango Útil</th>
                        <th>Broadcast</th>
                        <th>Hosts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaSubredes.map((s) => (
                        <tr key={s.indice}>
                          <td><span className="subnet-badge">{s.indice}</span></td>
                          <td><code>{s.red}/{nuevaMascara}</code></td>
                          <td>{s.rango}</td>
                          <td>{s.broadcast}</td>
                          <td><strong className="hosts-strong">{s.hosts}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
