import { useState, useRef } from 'preact/hooks';

type TabKey = 'bash' | 'cisco' | 'python';

interface TabData {
  id: TabKey;
  filename: string;
  icon: string;
  tag: string;
  lines: Array<{
    num: number;
    content: preact.VNode | string;
  }>;
}

export default function HeroTerminalIDE() {
  const [activeTab, setActiveTab] = useState<TabKey>('bash');
  const [copied, setCopied] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [extraLogs, setExtraLogs] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: parseFloat(rotateX.toFixed(2)), y: parseFloat(rotateY.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCopyCode = async () => {
    let textToCopy = '';
    if (activeTab === 'bash') {
      textToCopy = `sudo nmap -sV -p 22,80,443 192.168.1.1\napuntesdev --status\n✓ Módulos activos: SOM, SOR, Cisco Networking, Python\n✓ Clúster SMR: 100% ONLINE`;
    } else if (activeTab === 'cisco') {
      textToCopy = `Switch(config)# vlan 10,20,30\nSwitch(config-vlan)# name RED_SMR\nSwitch(config)# interface GigabitEthernet0/1\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30\nSwitch(config-if)# no shutdown`;
    } else {
      textToCopy = `@app.post("/api/apunte/completar")\nasync def registrar_progreso(slug: str, token: JWT):\n    user = await db.profiles.find_one({"id": token.uid})\n    xp_ganada = 50 * user.multiplicador_xp\n    await db.profiles.update_one({"id": token.uid}, {"$inc": {"xp": xp_ganada, "coins": 10}})\n    return {"status": "SUCCESS", "xp": xp_ganada}`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Error al copiar código', e);
    }
  };

  const handleRunSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setExtraLogs([]);

    setTimeout(() => {
      setExtraLogs((prev) => [...prev, '[+] Verificando integridad de paquetes... OK (0% drop)']);
    }, 400);

    setTimeout(() => {
      setExtraLogs((prev) => [...prev, '⚡ Simulación completada: Telemetría sincronizada con éxito.']);
      setSimulating(false);
    }, 1200);
  };

  return (
    <div
      ref={cardRef}
      class="hero-terminal-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Brillo volumétrico reactivo de fondo */}
      <div class="terminal-ambient-glow" aria-hidden="true"></div>

      <div class="hero-terminal-card">
        {/* HEADER / WINDOW CHROME */}
        <div class="terminal-chrome">
          <div class="chrome-controls">
            <span class="control-dot dot-close"></span>
            <span class="control-dot dot-min"></span>
            <span class="control-dot dot-max"></span>
          </div>

          {/* PESTAÑAS DEL IDE */}
          <div class="chrome-tabs">
            <button
              type="button"
              class={`chrome-tab ${activeTab === 'bash' ? 'active' : ''}`}
              onClick={() => setActiveTab('bash')}
            >
              <span class="tab-icon">🖥️</span>
              <span class="tab-name">audit_network.sh</span>
            </button>

            <button
              type="button"
              class={`chrome-tab ${activeTab === 'cisco' ? 'active' : ''}`}
              onClick={() => setActiveTab('cisco')}
            >
              <span class="tab-icon">🌐</span>
              <span class="tab-name">cisco_vlan.ios</span>
            </button>

            <button
              type="button"
              class={`chrome-tab ${activeTab === 'python' ? 'active' : ''}`}
              onClick={() => setActiveTab('python')}
            >
              <span class="tab-icon">🐍</span>
              <span class="tab-name">telemetry_api.py</span>
            </button>
          </div>

          {/* ACCIONES DEL HEADER */}
          <div class="chrome-actions">
            <button
              type="button"
              class="chrome-btn btn-run"
              onClick={handleRunSimulation}
              title="Ejecutar simulación"
              disabled={simulating}
            >
              <span class="btn-run-icon">{simulating ? '⏳' : '▶'}</span>
              <span class="btn-run-text">{simulating ? 'Running...' : 'Run'}</span>
            </button>

            <button
              type="button"
              class="chrome-btn btn-copy"
              onClick={handleCopyCode}
              title="Copiar código"
            >
              <span>{copied ? '✅' : '📋'}</span>
            </button>
          </div>
        </div>

        {/* CUERPO DEL EDITOR DE CÓDIGO / CONSOLA */}
        <div class="terminal-editor-body">
          {/* TAB 1: BASH AUDIT */}
          {activeTab === 'bash' && (
            <div class="editor-content fade-in">
              <div class="code-line">
                <span class="line-num">1</span>
                <span class="line-code">
                  <span class="t-prompt">$</span> <span class="t-cmd">sudo nmap</span> <span class="t-flag">-sV -T4 -p</span> <span class="t-val">22,80,443</span> <span class="t-ip">192.168.1.1</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">2</span>
                <span class="line-code t-dim">Starting Nmap 7.94 scan on subnet eth0 at 23:58 CET...</span>
              </div>
              <div class="code-line">
                <span class="line-num">3</span>
                <span class="line-code t-success">
                  [+] 22/tcp  OPEN   OpenSSH 9.6p1 (Ubuntu Security Hardened)
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">4</span>
                <span class="line-code t-success">
                  [+] 80/tcp  OPEN   nginx/1.24.0 (HTTP/2 Reverse Proxy)
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">5</span>
                <span class="line-code t-cyan">
                  [+] 443/tcp OPEN   HTTPS [TLS 1.3 | Curve25519 Verified]
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">6</span>
                <span class="line-code t-dim">Host is up (0.0018s latency). Scan completed in 0.42 seconds.</span>
              </div>
              <div class="code-line">
                <span class="line-num">7</span>
                <span class="line-code">
                  <span class="t-prompt">$</span> <span class="t-cmd">apuntesdev</span> <span class="t-flag">--system-telemetry</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">8</span>
                <span class="line-code t-highlight">
                  ✓ Clúster SMR/ASIR: 40 Apuntes Dominados • Base Supabase Online
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">9</span>
                <span class="line-code">
                  <span class="t-prompt">apuntesdev@cloud:~$</span> <span class="blinking-cursor">▋</span>
                </span>
              </div>

              {extraLogs.map((log, idx) => (
                <div key={idx} class="code-line extra-log-line">
                  <span class="line-num">+</span>
                  <span class="line-code t-accent">{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CISCO VLAN & TRUNK */}
          {activeTab === 'cisco' && (
            <div class="editor-content fade-in">
              <div class="code-line">
                <span class="line-num">1</span>
                <span class="line-code t-comment">! --- CONFIGURACIÓN DE SWITCH CISCO 2960 (CCNA / SMR) ---</span>
              </div>
              <div class="code-line">
                <span class="line-num">2</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch#</span> <span class="t-cmd">configure terminal</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">3</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config)#</span> <span class="t-keyword">vlan</span> <span class="t-val">10,20,30</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">4</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config-vlan)#</span> <span class="t-keyword">name</span> <span class="t-string">RED_AULAS_SMR</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">5</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config)#</span> <span class="t-keyword">interface</span> <span class="t-val">GigabitEthernet0/1</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">6</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config-if)#</span> <span class="t-cmd">switchport mode trunk</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">7</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config-if)#</span> <span class="t-cmd">switchport trunk allowed vlan</span> <span class="t-val">10,20,30</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">8</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config-if)#</span> <span class="t-cmd">spanning-tree portfast trunk</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">9</span>
                <span class="line-code">
                  <span class="t-cisco-prompt">Switch(config-if)#</span> <span class="t-success">no shutdown</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">10</span>
                <span class="line-code t-success">
                  %LINK-3-UPDOWN: Interface Gi0/1, changed state to UP (802.1Q Active)
                </span>
              </div>

              {extraLogs.map((log, idx) => (
                <div key={idx} class="code-line extra-log-line">
                  <span class="line-num">+</span>
                  <span class="line-code t-accent">{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PYTHON FASTAPI / SUPABASE */}
          {activeTab === 'python' && (
            <div class="editor-content fade-in">
              <div class="code-line">
                <span class="line-num">1</span>
                <span class="line-code t-comment"># Gamification Engine • Cálculo Atómico de XP</span>
              </div>
              <div class="code-line">
                <span class="line-num">2</span>
                <span class="line-code">
                  <span class="t-keyword">@router</span>.<span class="t-cmd">post</span>(<span class="t-string">"/api/estudiante/recompensa"</span>)
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">3</span>
                <span class="line-code">
                  <span class="t-keyword">async def</span> <span class="t-def">reclamar_apunte</span>(slug: <span class="t-val">str</span>, user: <span class="t-val">AuthUser</span>):
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">4</span>
                <span class="line-code indent">
                  perfil = <span class="t-keyword">await</span> supabase.profiles.<span class="t-cmd">get</span>(user.id)
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">5</span>
                <span class="line-code indent">
                  xp_ganada = <span class="t-val">50</span> * perfil.<span class="t-val">multiplicador_xp</span>
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">6</span>
                <span class="line-code indent">
                  <span class="t-keyword">await</span> supabase.profiles.<span class="t-cmd">update</span>({'{'}
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">7</span>
                <span class="line-code indent-2">
                  <span class="t-string">"xp"</span>: perfil.xp + xp_ganada,
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">8</span>
                <span class="line-code indent-2">
                  <span class="t-string">"coins"</span>: perfil.coins + <span class="t-val">10</span>,
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">9</span>
                <span class="line-code indent">
                  {'}'}).<span class="t-cmd">eq</span>(<span class="t-string">"id"</span>, user.id)
                </span>
              </div>
              <div class="code-line">
                <span class="line-num">10</span>
                <span class="line-code indent">
                  <span class="t-keyword">return</span> {'{'}<span class="t-string">"status"</span>: <span class="t-string">"DOMINADO"</span>, <span class="t-string">"xp_added"</span>: xp_ganada{'}'}
                </span>
              </div>

              {extraLogs.map((log, idx) => (
                <div key={idx} class="code-line extra-log-line">
                  <span class="line-num">+</span>
                  <span class="line-code t-accent">{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATUS FOOTER BAR */}
        <div class="terminal-footer">
          <div class="footer-left">
            <span class="status-indicator"></span>
            <span class="footer-tag">KERNEL v2.6-RELEASE</span>
            <span class="footer-divider">•</span>
            <span class="footer-branch">main // git:2263603</span>
          </div>
          <div class="footer-right">
            <span class="footer-badge">443 TLS 1.3</span>
            <span class="footer-badge">60 FPS</span>
            <span class="footer-badge lang-badge">{activeTab.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
