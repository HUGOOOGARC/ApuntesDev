import { useState, useRef, useEffect } from 'preact/hooks';

interface VFSNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  permissions: string;
  owner: string;
  group: string;
  size: number;
  date: string;
  children?: Record<string, VFSNode>;
}

// Inicializador del sistema de ficheros virtual
function createInitialVFS(): Record<string, VFSNode> {
  return {
    bin: {
      name: 'bin',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: 4096,
      date: 'Apr 12 10:00',
      children: {
        bash: { name: 'bash', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 1254384, date: 'Apr 12 10:00' },
        ls: { name: 'ls', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 142144, date: 'Apr 12 10:00' },
        cat: { name: 'cat', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 43424, date: 'Apr 12 10:00' },
        chmod: { name: 'chmod', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 68136, date: 'Apr 12 10:00' },
        ping: { name: 'ping', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 88464, date: 'Apr 12 10:00' },
        ip: { name: 'ip', type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 984512, date: 'Apr 12 10:00' },
      },
    },
    etc: {
      name: 'etc',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: 4096,
      date: 'Apr 18 14:22',
      children: {
        passwd: {
          name: 'passwd',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          size: 1845,
          date: 'Apr 18 14:20',
          content: `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nhugo:x:1000:1000:Hugo Sysadmin,,,:/home/hugo:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsshd:x:105:65534::/run/sshd:/usr/sbin/nologin`,
        },
        'os-release': {
          name: 'os-release',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          size: 382,
          date: 'Apr 10 08:15',
          content: `PRETTY_NAME="Ubuntu 24.04 LTS (Noble Numbat)"\nNAME="Ubuntu"\nVERSION_ID="24.04"\nVERSION="24.04 LTS"\nID=ubuntu\nID_LIKE=debian\nHOME_URL="https://apuntesdev.com/"`,
        },
        'resolv.conf': {
          name: 'resolv.conf',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          size: 78,
          date: 'Apr 19 09:30',
          content: `nameserver 1.1.1.1\nnameserver 8.8.8.8\noptions edns0 trust-ad\nsearch lan`,
        },
        fstab: {
          name: 'fstab',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          size: 412,
          date: 'Apr 10 08:00',
          content: `# /etc/fstab: static file system information.\nUUID=4f92d8e1-5b72-4d1a-96e2-7634f1028e3b / ext4 defaults 0 1\nUUID=9b24e6a0-1284-48f1-a129-cb6a1478fe12 none swap sw 0 0`,
        },
        hosts: {
          name: 'hosts',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          size: 154,
          date: 'Apr 10 08:00',
          content: `127.0.0.1 localhost\n127.0.1.1 apuntesdev-srv\n192.168.1.1 gateway.local`,
        },
      },
    },
    home: {
      name: 'home',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: 4096,
      date: 'Apr 10 08:00',
      children: {
        hugo: {
          name: 'hugo',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'hugo',
          group: 'hugo',
          size: 4096,
          date: 'Apr 21 16:45',
          children: {
            'bienvenida.txt': {
              name: 'bienvenida.txt',
              type: 'file',
              permissions: '-rw-r--r--',
              owner: 'hugo',
              group: 'hugo',
              size: 420,
              date: 'Apr 21 16:40',
              content: `¡Bienvenido a la consola interactiva de ApuntesDev!\nAquí puedes practicar comandos reales de Linux directamente desde tu navegador.\n\nComandos sugeridos para probar:\n  - ls -la\n  - pwd\n  - cat bienvenida.txt\n  - cat /etc/passwd\n  - ip a\n  - ping 1.1.1.1\n  - chmod 755 deploy.sh\n  - mkdir mi-proyecto\n  - echo "Hola mundo" > test.txt\n  - help (ver lista completa)`,
            },
            'deploy.sh': {
              name: 'deploy.sh',
              type: 'file',
              permissions: '-rwxr-xr-x',
              owner: 'hugo',
              group: 'hugo',
              size: 215,
              date: 'Apr 21 15:10',
              content: `#!/bin/bash\necho "Desplegando servicios de red y backend..."\nsystemctl restart nginx\necho "¡Despliegue finalizado con éxito!"`,
            },
            'notas.md': {
              name: 'notas.md',
              type: 'file',
              permissions: '-rw-r--r--',
              owner: 'hugo',
              group: 'hugo',
              size: 290,
              date: 'Apr 21 12:30',
              content: `# Tareas Pendientes SMR & Redes\n- [x] Configurar enlace troncal 802.1Q en Cisco\n- [x] Crear pools DHCP en servidor Linux\n- [ ] Hardening SSH: desactivar PermitRootLogin\n- [ ] Ajustar reglas UFW para puerto 443`,
            },
          },
        },
      },
    },
    var: {
      name: 'var',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      size: 4096,
      date: 'Apr 10 08:00',
      children: {
        log: {
          name: 'log',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          size: 4096,
          date: 'Apr 21 18:00',
          children: {
            syslog: {
              name: 'syslog',
              type: 'file',
              permissions: '-rw-r-----',
              owner: 'root',
              group: 'adm',
              size: 1542,
              date: 'Apr 21 18:00',
              content: `systemd[1]: Started Network Time Synchronization.\nkernel: [ 14.281902] eth0: Link is Up - 1Gbps/Full - flow control rx/tx\nsshd[892]: Server listening on 0.0.0.0 port 2222.\nnginx[1024]: Started A high performance web server and a reverse proxy server.`,
            },
            'auth.log': {
              name: 'auth.log',
              type: 'file',
              permissions: '-rw-r-----',
              owner: 'root',
              group: 'adm',
              size: 680,
              date: 'Apr 21 17:50',
              content: `sshd[1240]: Accepted publickey for hugo from 192.168.1.50 port 52180 ssh2: ED25519\nsudo: hugo : TTY=pts/0 ; PWD=/home/hugo ; USER=root ; COMMAND=/bin/systemctl status nginx`,
            },
          },
        },
        www: {
          name: 'www',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'www-data',
          group: 'www-data',
          size: 4096,
          date: 'Apr 15 11:20',
          children: {
            html: {
              name: 'html',
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'www-data',
              group: 'www-data',
              size: 4096,
              date: 'Apr 15 11:20',
              children: {
                'index.html': {
                  name: 'index.html',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'www-data',
                  group: 'www-data',
                  size: 184,
                  date: 'Apr 15 11:20',
                  content: `<!DOCTYPE html>\n<html>\n<head><title>Servidor ApuntesDev</title></head>\n<body><h1>Servidor Web Nginx 1.24 Operativo</h1></body>\n</html>`,
                },
              },
            },
          },
        },
      },
    },
  };
}

interface TerminalEntry {
  id: number;
  type: 'command' | 'output' | 'error';
  prompt?: string;
  text: string;
}

export default function LinuxTerminal() {
  const [vfs, setVfs] = useState<Record<string, VFSNode>>(createInitialVFS());
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'hugo']);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 1,
      type: 'output',
      text: `🐧 ApuntesDev Cloud Shell (Ubuntu 24.04 LTS)\nEscribe 'help' para ver la lista de comandos disponibles.\nEscribe 'ls -la' o 'cat bienvenida.txt' para empezar.`,
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al final al emitir nuevas salidas
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Prompt formateado
  const pathString = '/' + currentPath.join('/');
  const displayPath = pathString.startsWith('/home/hugo')
    ? pathString.replace('/home/hugo', '~')
    : pathString;
  const promptText = `hugo@apuntesdev:${displayPath || '/'}$`;

  // Helper para resolver un nodo del VFS desde una ruta
  const resolveNode = (pathParts: string[], root: Record<string, VFSNode>): { node: VFSNode | null; parent: VFSNode | null; name: string } => {
    if (pathParts.length === 0) return { node: null, parent: null, name: '' };

    let currentChildren = root;
    let parentNode: VFSNode | null = null;
    let targetName = pathParts[pathParts.length - 1];

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const found = currentChildren[part];
      if (!found) return { node: null, parent: parentNode, name: targetName };

      if (i === pathParts.length - 1) {
        return { node: found, parent: parentNode, name: targetName };
      }

      if (found.type !== 'dir' || !found.children) {
        return { node: null, parent: parentNode, name: targetName };
      }

      parentNode = found;
      currentChildren = found.children;
    }

    return { node: null, parent: parentNode, name: targetName };
  };

  // Helper para parsear rutas relativas o absolutas
  const parsePath = (target: string): string[] => {
    let base: string[];
    let trimmed = target.trim();

    if (trimmed.startsWith('/')) {
      base = [];
      trimmed = trimmed.substring(1);
    } else if (trimmed.startsWith('~')) {
      base = ['home', 'hugo'];
      trimmed = trimmed.substring(1);
      if (trimmed.startsWith('/')) trimmed = trimmed.substring(1);
    } else {
      base = [...currentPath];
    }

    const segments = trimmed.split('/').filter(Boolean);
    for (const seg of segments) {
      if (seg === '.') continue;
      if (seg === '..') {
        if (base.length > 0) base.pop();
      } else {
        base.push(seg);
      }
    }
    return base;
  };

  // Obtener los ficheros del directorio actual
  const getCurrentDirectoryChildren = (vfsTree: Record<string, VFSNode>): Record<string, VFSNode> => {
    if (currentPath.length === 0) return vfsTree;
    let curr = vfsTree;
    for (const part of currentPath) {
      if (curr[part] && curr[part].children) {
        curr = curr[part].children!;
      } else {
        return {};
      }
    }
    return curr;
  };

  // Ejecutor de comandos
  const executeCommand = (cmdLine: string) => {
    const raw = cmdLine.trim();
    if (!raw) return;

    // Guardar en historial
    setCmdHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const newEntries: TerminalEntry[] = [
      { id: Date.now(), type: 'command', prompt: promptText, text: raw },
    ];

    // Manejo de redirecciones: echo "texto" > archivo o >> archivo
    const isRedirect = raw.includes('>') || raw.includes('>>');
    let commandToRun = raw;
    let redirectFile = '';
    let redirectAppend = false;

    if (isRedirect) {
      if (raw.includes('>>')) {
        const parts = raw.split('>>');
        commandToRun = parts[0].trim();
        redirectFile = parts[1].trim();
        redirectAppend = true;
      } else {
        const parts = raw.split('>');
        commandToRun = parts[0].trim();
        redirectFile = parts[1].trim();
        redirectAppend = false;
      }
    }

    const tokens = commandToRun.split(' ').filter(Boolean);
    const cmd = tokens[0]?.toLowerCase();
    const args = tokens.slice(1);

    let outputText = '';
    let isError = false;

    switch (cmd) {
      case 'help':
      case 'ayuda':
        outputText = `Comandos Disponibles en ApuntesDev Shell:
  ls [-l, -a, -la] [dir]    Listar archivos y directorios
  cd [dir]                 Cambiar de directorio (~, .., /etc)
  pwd                      Mostrar directorio actual
  cat [archivo]            Mostrar contenido de archivo
  echo [texto] [> arch]    Imprimir o redirigir texto a archivo
  touch [archivo]          Crear archivo vacío
  mkdir [directorio]       Crear nuevo directorio
  rm [-r] [fichero]        Eliminar fichero o directorio
  chmod [octal] [fichero]  Cambiar permisos (ej: chmod 755 script.sh)
  ip a / ifconfig          Mostrar interfaces de red y direcciones IP
  ping [-c N] [host]       Enviar paquetes ICMP de prueba
  whoami                   Mostrar usuario actual
  uname -a                 Información del kernel y arquitectura
  date                     Fecha y hora del sistema
  history                  Ver historial de comandos ejecutados
  clear                    Limpiar pantalla de la terminal`;
        break;

      case 'pwd':
        outputText = pathString || '/';
        break;

      case 'whoami':
        outputText = 'hugo';
        break;

      case 'uname':
        if (args.includes('-a')) {
          outputText = 'Linux apuntesdev-srv 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux';
        } else {
          outputText = 'Linux';
        }
        break;

      case 'date':
        outputText = new Date().toUTCString();
        break;

      case 'clear':
        setHistory([]);
        setCommandInput('');
        return;

      case 'history':
        outputText = cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
        break;

      case 'cd': {
        const target = args[0] || '~';
        const newPath = parsePath(target);
        if (newPath.length === 0) {
          setCurrentPath([]);
        } else {
          const { node } = resolveNode(newPath, vfs);
          if (node && node.type === 'dir') {
            setCurrentPath(newPath);
          } else if (node && node.type === 'file') {
            outputText = `bash: cd: ${target}: No es un directorio`;
            isError = true;
          } else {
            outputText = `bash: cd: ${target}: No existe el archivo o el directorio`;
            isError = true;
          }
        }
        break;
      }

      case 'ls': {
        const hasLong = args.some((a) => a.includes('l'));
        const hasAll = args.some((a) => a.includes('a'));
        const pathArg = args.find((a) => !a.startsWith('-'));

        let targetChildren: Record<string, VFSNode>;
        if (pathArg) {
          const targetPath = parsePath(pathArg);
          if (targetPath.length === 0) {
            targetChildren = vfs;
          } else {
            const { node } = resolveNode(targetPath, vfs);
            if (node && node.type === 'dir' && node.children) {
              targetChildren = node.children;
            } else if (node && node.type === 'file') {
              outputText = node.name;
              break;
            } else {
              outputText = `ls: no se puede acceder a '${pathArg}': No existe el archivo o el directorio`;
              isError = true;
              break;
            }
          }
        } else {
          targetChildren = getCurrentDirectoryChildren(vfs);
        }

        const entries = Object.values(targetChildren);
        const filtered = hasAll ? entries : entries.filter((e) => !e.name.startsWith('.'));

        if (hasLong) {
          const lines = filtered.map((e) => {
            const isDir = e.type === 'dir';
            return `${e.permissions.padEnd(11)} 1 ${e.owner.padEnd(8)} ${e.group.padEnd(8)} ${String(e.size).padStart(7)} ${e.date} ${isDir ? '📁 ' + e.name + '/' : '📄 ' + e.name}`;
          });
          outputText = `total ${filtered.length * 4}\n` + lines.join('\n');
        } else {
          outputText = filtered
            .map((e) => (e.type === 'dir' ? `📁 ${e.name}/` : e.name))
            .join('    ');
        }
        break;
      }

      case 'cat': {
        if (args.length === 0) {
          outputText = 'cat: falta el nombre del archivo';
          isError = true;
          break;
        }
        const targetPath = parsePath(args[0]);
        const { node } = resolveNode(targetPath, vfs);
        if (!node) {
          outputText = `cat: ${args[0]}: No existe el archivo o el directorio`;
          isError = true;
        } else if (node.type === 'dir') {
          outputText = `cat: ${args[0]}: Es un directorio`;
          isError = true;
        } else {
          outputText = node.content ?? '';
        }
        break;
      }

      case 'echo': {
        let text = args.join(' ');
        if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
          text = text.substring(1, text.length - 1);
        }

        if (redirectFile) {
          const filePath = parsePath(redirectFile);
          const fileName = filePath[filePath.length - 1];
          const parentPath = filePath.slice(0, -1);

          const newVfs = JSON.parse(JSON.stringify(vfs));
          const { node: parentNode } = parentPath.length === 0
            ? { node: { type: 'dir', children: newVfs } as VFSNode }
            : resolveNode(parentPath, newVfs);

          if (parentNode && parentNode.children) {
            const existing = parentNode.children[fileName];
            if (existing && existing.type === 'file') {
              existing.content = redirectAppend ? (existing.content + '\n' + text) : text;
              existing.size = existing.content.length;
            } else {
              parentNode.children[fileName] = {
                name: fileName,
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'hugo',
                group: 'hugo',
                size: text.length,
                date: 'Apr 21 18:30',
                content: text,
              };
            }
            setVfs(newVfs);
            outputText = '';
          } else {
            outputText = `bash: ${redirectFile}: No existe el directorio padre`;
            isError = true;
          }
        } else {
          outputText = text;
        }
        break;
      }

      case 'touch': {
        if (args.length === 0) {
          outputText = 'touch: falta el operando archivo';
          isError = true;
          break;
        }
        const fileName = args[0];
        const newVfs = JSON.parse(JSON.stringify(vfs));
        let curr = newVfs;
        for (const p of currentPath) {
          curr = curr[p].children;
        }
        if (!curr[fileName]) {
          curr[fileName] = {
            name: fileName,
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'hugo',
            group: 'hugo',
            size: 0,
            date: 'Apr 21 18:32',
            content: '',
          };
          setVfs(newVfs);
        }
        break;
      }

      case 'mkdir': {
        if (args.length === 0) {
          outputText = 'mkdir: falta el operando';
          isError = true;
          break;
        }
        const dirName = args[0];
        const newVfs = JSON.parse(JSON.stringify(vfs));
        let curr = newVfs;
        for (const p of currentPath) {
          curr = curr[p].children;
        }
        if (curr[dirName]) {
          outputText = `mkdir: no se puede crear el directorio «${dirName}»: El archivo ya existe`;
          isError = true;
        } else {
          curr[dirName] = {
            name: dirName,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            owner: 'hugo',
            group: 'hugo',
            size: 4096,
            date: 'Apr 21 18:33',
            children: {},
          };
          setVfs(newVfs);
        }
        break;
      }

      case 'rm': {
        const isRec = args.includes('-r') || args.includes('-rf');
        const targetName = args.find((a) => !a.startsWith('-'));
        if (!targetName) {
          outputText = 'rm: falta el operando';
          isError = true;
          break;
        }
        const newVfs = JSON.parse(JSON.stringify(vfs));
        let curr = newVfs;
        for (const p of currentPath) {
          curr = curr[p].children;
        }
        const target = curr[targetName];
        if (!target) {
          outputText = `rm: no se puede borrar '${targetName}': No existe el archivo o el directorio`;
          isError = true;
        } else if (target.type === 'dir' && !isRec) {
          outputText = `rm: no se puede borrar '${targetName}': Es un directorio (use -r)`;
          isError = true;
        } else {
          delete curr[targetName];
          setVfs(newVfs);
        }
        break;
      }

      case 'chmod': {
        if (args.length < 2) {
          outputText = 'chmod: faltan operandos (ej: chmod 755 archivo)';
          isError = true;
          break;
        }
        const mode = args[0];
        const fileName = args[1];
        const newVfs = JSON.parse(JSON.stringify(vfs));
        let curr = newVfs;
        for (const p of currentPath) {
          curr = curr[p].children;
        }
        const target = curr[fileName];
        if (!target) {
          outputText = `chmod: no se puede acceder a '${fileName}': No existe el archivo o el directorio`;
          isError = true;
        } else if (/^[0-7]{3,4}$/.test(mode)) {
          const last3 = mode.slice(-3);
          const u = parseInt(last3[0], 10);
          const g = parseInt(last3[1], 10);
          const o = parseInt(last3[2], 10);
          const conv = (val: number) => (val & 4 ? 'r' : '-') + (val & 2 ? 'w' : '-') + (val & 1 ? 'x' : '-');
          target.permissions = (target.type === 'dir' ? 'd' : '-') + conv(u) + conv(g) + conv(o);
          setVfs(newVfs);
          outputText = `Permisos de '${fileName}' actualizados a ${mode} (${target.permissions})`;
        } else {
          outputText = `chmod: modo octal no válido: «${mode}»`;
          isError = true;
        }
        break;
      }

      case 'ip':
      case 'ifconfig':
        outputText = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.150/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86120sec preferred_lft 86120sec
    inet6 fe80::5054:ff:fe12:3456/64 scope link
       valid_lft forever preferred_lft forever`;
        break;

      case 'ping': {
        const host = args.find((a) => !a.startsWith('-')) || '1.1.1.1';
        outputText = `PING ${host} (${host}) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=57 time=14.2 ms
64 bytes from ${host}: icmp_seq=2 ttl=57 time=13.8 ms
64 bytes from ${host}: icmp_seq=3 ttl=57 time=14.5 ms
64 bytes from ${host}: icmp_seq=4 ttl=57 time=13.9 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.812/14.105/14.502/0.274 ms`;
        break;
      }

      default:
        outputText = `bash: ${cmd}: orden no encontrada. Escribe 'help' para ver la lista de comandos disponibles.`;
        isError = true;
    }

    if (outputText) {
      newEntries.push({
        id: Date.now() + 1,
        type: isError ? 'error' : 'output',
        text: outputText,
      });
    }

    setHistory((prev) => [...prev, ...newEntries]);
    setCommandInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(commandInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommandInput(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        setHistoryIndex(nextIndex);
        setCommandInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = commandInput.trim();
      const tokens = current.split(' ');
      const lastToken = tokens[tokens.length - 1] || '';

      const children = getCurrentDirectoryChildren(vfs);
      const candidates = Object.keys(children).filter((name) => name.startsWith(lastToken));

      if (candidates.length === 1) {
        tokens[tokens.length - 1] = candidates[0];
        setCommandInput(tokens.join(' '));
      }
    }
  };

  const reiniciarTerminal = () => {
    setVfs(createInitialVFS());
    setCurrentPath(['home', 'hugo']);
    setHistory([
      {
        id: Date.now(),
        type: 'output',
        text: `Terminal reiniciada con éxito.\nEscribe 'help' para ver la lista de comandos.`,
      },
    ]);
  };

  return (
    <div className="tool-card terminal-tool-card">
      <div className="tool-header">
        <div className="tool-icon-pill">💻</div>
        <div>
          <h3>Simulador de Terminal Linux en Navegador</h3>
          <p>Practica comandos reales de administración en un sistema de archivos virtual en memoria.</p>
        </div>
      </div>

      <div className="terminal-window">
        {/* Barra superior de la consola */}
        <div className="terminal-topbar">
          <div className="window-dots">
            <span className="dot dot--red"></span>
            <span className="dot dot--yellow"></span>
            <span className="dot dot--green"></span>
          </div>
          <div className="window-title">hugo@apuntesdev: {displayPath}</div>
          <div className="window-actions">
            <button
              type="button"
              onClick={reiniciarTerminal}
              className="term-reset-btn"
              title="Restaurar sistema de archivos original"
            >
              🔄 Reiniciar VFS
            </button>
            <span className="online-tag"><span className="pulse-indicator"></span> VFS ACTIVO</span>
          </div>
        </div>

        {/* Cuerpo de la consola */}
        <div
          className="terminal-screen"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry) => (
            <div key={entry.id} className={`terminal-line line-${entry.type}`}>
              {entry.prompt && <span className="term-prompt">{entry.prompt} </span>}
              <span className="term-text">{entry.text}</span>
            </div>
          ))}

          {/* Línea de entrada activa */}
          <div className="terminal-active-line">
            <span className="term-prompt">{promptText} </span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onInput={(e) => setCommandInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              className="term-input"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={terminalEndRef}></div>
        </div>
      </div>

      {/* Sugerencias de Comandos Rápidos */}
      <div className="terminal-hints-bar">
        <span className="hints-label">Atajos y Pruebas:</span>
        <button type="button" onClick={() => executeCommand('ls -la')} className="hint-btn">ls -la</button>
        <button type="button" onClick={() => executeCommand('cat bienvenida.txt')} className="hint-btn">cat bienvenida.txt</button>
        <button type="button" onClick={() => executeCommand('cat /etc/passwd')} className="hint-btn">cat /etc/passwd</button>
        <button type="button" onClick={() => executeCommand('ip a')} className="hint-btn">ip a</button>
        <button type="button" onClick={() => executeCommand('ping -c 4 1.1.1.1')} className="hint-btn">ping 1.1.1.1</button>
        <button type="button" onClick={() => executeCommand('chmod 700 notas.md')} className="hint-btn">chmod 700 notas.md</button>
        <button type="button" onClick={() => executeCommand('help')} className="hint-btn">help</button>
      </div>
    </div>
  );
}
