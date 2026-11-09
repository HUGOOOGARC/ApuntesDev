import{n as e,r as t,t as n}from"./hooks.D-pPw_0u.js";import{t as r}from"./jsxRuntime.BZ3oYkZO.js";function i(){return{bin:{name:`bin`,type:`dir`,permissions:`drwxr-xr-x`,owner:`root`,group:`root`,size:4096,date:`Apr 12 10:00`,children:{bash:{name:`bash`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:1254384,date:`Apr 12 10:00`},ls:{name:`ls`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:142144,date:`Apr 12 10:00`},cat:{name:`cat`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:43424,date:`Apr 12 10:00`},chmod:{name:`chmod`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:68136,date:`Apr 12 10:00`},ping:{name:`ping`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:88464,date:`Apr 12 10:00`},ip:{name:`ip`,type:`file`,permissions:`-rwxr-xr-x`,owner:`root`,group:`root`,size:984512,date:`Apr 12 10:00`}}},etc:{name:`etc`,type:`dir`,permissions:`drwxr-xr-x`,owner:`root`,group:`root`,size:4096,date:`Apr 18 14:22`,children:{passwd:{name:`passwd`,type:`file`,permissions:`-rw-r--r--`,owner:`root`,group:`root`,size:1845,date:`Apr 18 14:20`,content:`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
hugo:x:1000:1000:Hugo Sysadmin,,,:/home/hugo:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin`},"os-release":{name:`os-release`,type:`file`,permissions:`-rw-r--r--`,owner:`root`,group:`root`,size:382,date:`Apr 10 08:15`,content:`PRETTY_NAME="Ubuntu 24.04 LTS (Noble Numbat)"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04 LTS"
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://apuntesdev.com/"`},"resolv.conf":{name:`resolv.conf`,type:`file`,permissions:`-rw-r--r--`,owner:`root`,group:`root`,size:78,date:`Apr 19 09:30`,content:`nameserver 1.1.1.1
nameserver 8.8.8.8
options edns0 trust-ad
search lan`},fstab:{name:`fstab`,type:`file`,permissions:`-rw-r--r--`,owner:`root`,group:`root`,size:412,date:`Apr 10 08:00`,content:`# /etc/fstab: static file system information.
UUID=4f92d8e1-5b72-4d1a-96e2-7634f1028e3b / ext4 defaults 0 1
UUID=9b24e6a0-1284-48f1-a129-cb6a1478fe12 none swap sw 0 0`},hosts:{name:`hosts`,type:`file`,permissions:`-rw-r--r--`,owner:`root`,group:`root`,size:154,date:`Apr 10 08:00`,content:`127.0.0.1 localhost
127.0.1.1 apuntesdev-srv
192.168.1.1 gateway.local`}}},home:{name:`home`,type:`dir`,permissions:`drwxr-xr-x`,owner:`root`,group:`root`,size:4096,date:`Apr 10 08:00`,children:{hugo:{name:`hugo`,type:`dir`,permissions:`drwxr-xr-x`,owner:`hugo`,group:`hugo`,size:4096,date:`Apr 21 16:45`,children:{"bienvenida.txt":{name:`bienvenida.txt`,type:`file`,permissions:`-rw-r--r--`,owner:`hugo`,group:`hugo`,size:420,date:`Apr 21 16:40`,content:`¡Bienvenido a la consola interactiva de ApuntesDev!
Aquí puedes practicar comandos reales de Linux directamente desde tu navegador.

Comandos sugeridos para probar:
  - ls -la
  - pwd
  - cat bienvenida.txt
  - cat /etc/passwd
  - ip a
  - ping 1.1.1.1
  - chmod 755 deploy.sh
  - mkdir mi-proyecto
  - echo "Hola mundo" > test.txt
  - help (ver lista completa)`},"deploy.sh":{name:`deploy.sh`,type:`file`,permissions:`-rwxr-xr-x`,owner:`hugo`,group:`hugo`,size:215,date:`Apr 21 15:10`,content:`#!/bin/bash
echo "Desplegando servicios de red y backend..."
systemctl restart nginx
echo "¡Despliegue finalizado con éxito!"`},"notas.md":{name:`notas.md`,type:`file`,permissions:`-rw-r--r--`,owner:`hugo`,group:`hugo`,size:290,date:`Apr 21 12:30`,content:`# Tareas Pendientes SMR & Redes
- [x] Configurar enlace troncal 802.1Q en Cisco
- [x] Crear pools DHCP en servidor Linux
- [ ] Hardening SSH: desactivar PermitRootLogin
- [ ] Ajustar reglas UFW para puerto 443`}}}}},var:{name:`var`,type:`dir`,permissions:`drwxr-xr-x`,owner:`root`,group:`root`,size:4096,date:`Apr 10 08:00`,children:{log:{name:`log`,type:`dir`,permissions:`drwxr-xr-x`,owner:`root`,group:`root`,size:4096,date:`Apr 21 18:00`,children:{syslog:{name:`syslog`,type:`file`,permissions:`-rw-r-----`,owner:`root`,group:`adm`,size:1542,date:`Apr 21 18:00`,content:`systemd[1]: Started Network Time Synchronization.
kernel: [ 14.281902] eth0: Link is Up - 1Gbps/Full - flow control rx/tx
sshd[892]: Server listening on 0.0.0.0 port 2222.
nginx[1024]: Started A high performance web server and a reverse proxy server.`},"auth.log":{name:`auth.log`,type:`file`,permissions:`-rw-r-----`,owner:`root`,group:`adm`,size:680,date:`Apr 21 17:50`,content:`sshd[1240]: Accepted publickey for hugo from 192.168.1.50 port 52180 ssh2: ED25519
sudo: hugo : TTY=pts/0 ; PWD=/home/hugo ; USER=root ; COMMAND=/bin/systemctl status nginx`}}},www:{name:`www`,type:`dir`,permissions:`drwxr-xr-x`,owner:`www-data`,group:`www-data`,size:4096,date:`Apr 15 11:20`,children:{html:{name:`html`,type:`dir`,permissions:`drwxr-xr-x`,owner:`www-data`,group:`www-data`,size:4096,date:`Apr 15 11:20`,children:{"index.html":{name:`index.html`,type:`file`,permissions:`-rw-r--r--`,owner:`www-data`,group:`www-data`,size:184,date:`Apr 15 11:20`,content:`<!DOCTYPE html>
<html>
<head><title>Servidor ApuntesDev</title></head>
<body><h1>Servidor Web Nginx 1.24 Operativo</h1></body>
</html>`}}}}}}}}}function a(){let[a,o]=t(i()),[s,c]=t([`home`,`hugo`]),[l,u]=t(``),[d,f]=t([{id:1,type:`output`,text:`🐧 ApuntesDev Cloud Shell (Ubuntu 24.04 LTS)
Escribe 'help' para ver la lista de comandos disponibles.
Escribe 'ls -la' o 'cat bienvenida.txt' para empezar.`}]),[p,m]=t([]),[h,g]=t(-1),_=e(null),v=e(null);n(()=>{_.current?.scrollIntoView({behavior:`smooth`})},[d]);let y=`/`+s.join(`/`),b=y.startsWith(`/home/hugo`)?y.replace(`/home/hugo`,`~`):y,x=`hugo@apuntesdev:${b||`/`}$`,S=(e,t)=>{if(e.length===0)return{node:null,parent:null,name:``};let n=t,r=null,i=e[e.length-1];for(let t=0;t<e.length;t++){let a=e[t],o=n[a];if(!o)return{node:null,parent:r,name:i};if(t===e.length-1)return{node:o,parent:r,name:i};if(o.type!==`dir`||!o.children)return{node:null,parent:r,name:i};r=o,n=o.children}return{node:null,parent:r,name:i}},C=e=>{let t,n=e.trim();n.startsWith(`/`)?(t=[],n=n.substring(1)):n.startsWith(`~`)?(t=[`home`,`hugo`],n=n.substring(1),n.startsWith(`/`)&&(n=n.substring(1))):t=[...s];let r=n.split(`/`).filter(Boolean);for(let e of r)e!==`.`&&(e===`..`?t.length>0&&t.pop():t.push(e));return t},w=e=>{if(s.length===0)return e;let t=e;for(let e of s)if(t[e]&&t[e].children)t=t[e].children;else return{};return t},T=e=>{let t=e.trim();if(!t)return;m(e=>[...e,t]),g(-1);let n=[{id:Date.now(),type:`command`,prompt:x,text:t}],r=t.includes(`>`)||t.includes(`>>`),i=t,l=``,d=!1;if(r){if(t.includes(`>>`)){let e=t.split(`>>`);i=e[0].trim(),l=e[1].trim(),d=!0}else{let e=t.split(`>`);i=e[0].trim(),l=e[1].trim(),d=!1}}let h=i.split(` `).filter(Boolean),_=h[0]?.toLowerCase(),v=h.slice(1),b=``,T=!1;switch(_){case`help`:case`ayuda`:b=`Comandos Disponibles en ApuntesDev Shell:
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
  clear                    Limpiar pantalla de la terminal`;break;case`pwd`:b=y||`/`;break;case`whoami`:b=`hugo`;break;case`uname`:b=v.includes(`-a`)?`Linux apuntesdev-srv 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux`:`Linux`;break;case`date`:b=new Date().toUTCString();break;case`clear`:f([]),u(``);return;case`history`:b=p.map((e,t)=>`  ${t+1}  ${e}`).join(`
`);break;case`cd`:{let e=v[0]||`~`,t=C(e);if(t.length===0)c([]);else{let{node:n}=S(t,a);n&&n.type===`dir`?c(t):n&&n.type===`file`?(b=`bash: cd: ${e}: No es un directorio`,T=!0):(b=`bash: cd: ${e}: No existe el archivo o el directorio`,T=!0)}break}case`ls`:{let e=v.some(e=>e.includes(`l`)),t=v.some(e=>e.includes(`a`)),n=v.find(e=>!e.startsWith(`-`)),r;if(n){let e=C(n);if(e.length===0)r=a;else{let{node:t}=S(e,a);if(t&&t.type===`dir`&&t.children)r=t.children;else if(t&&t.type===`file`){b=t.name;break}else{b=`ls: no se puede acceder a '${n}': No existe el archivo o el directorio`,T=!0;break}}}else r=w(a);let i=Object.values(r),o=t?i:i.filter(e=>!e.name.startsWith(`.`));if(e){let e=o.map(e=>{let t=e.type===`dir`;return`${e.permissions.padEnd(11)} 1 ${e.owner.padEnd(8)} ${e.group.padEnd(8)} ${String(e.size).padStart(7)} ${e.date} ${t?`📁 `+e.name+`/`:`📄 `+e.name}`});b=`total ${o.length*4}\n`+e.join(`
`)}else b=o.map(e=>e.type===`dir`?`📁 ${e.name}/`:e.name).join(`    `);break}case`cat`:{if(v.length===0){b=`cat: falta el nombre del archivo`,T=!0;break}let e=C(v[0]),{node:t}=S(e,a);t?t.type===`dir`?(b=`cat: ${v[0]}: Es un directorio`,T=!0):b=t.content??``:(b=`cat: ${v[0]}: No existe el archivo o el directorio`,T=!0);break}case`echo`:{let e=v.join(` `);if((e.startsWith(`"`)&&e.endsWith(`"`)||e.startsWith(`'`)&&e.endsWith(`'`))&&(e=e.substring(1,e.length-1)),l){let t=C(l),n=t[t.length-1],r=t.slice(0,-1),i=JSON.parse(JSON.stringify(a)),{node:s}=r.length===0?{node:{type:`dir`,children:i}}:S(r,i);if(s&&s.children){let t=s.children[n];t&&t.type===`file`?(t.content=d?t.content+`
`+e:e,t.size=t.content.length):s.children[n]={name:n,type:`file`,permissions:`-rw-r--r--`,owner:`hugo`,group:`hugo`,size:e.length,date:`Apr 21 18:30`,content:e},o(i),b=``}else b=`bash: ${l}: No existe el directorio padre`,T=!0}else b=e;break}case`touch`:{if(v.length===0){b=`touch: falta el operando archivo`,T=!0;break}let e=v[0],t=JSON.parse(JSON.stringify(a)),n=t;for(let e of s)n=n[e].children;n[e]||(n[e]={name:e,type:`file`,permissions:`-rw-r--r--`,owner:`hugo`,group:`hugo`,size:0,date:`Apr 21 18:32`,content:``},o(t));break}case`mkdir`:{if(v.length===0){b=`mkdir: falta el operando`,T=!0;break}let e=v[0],t=JSON.parse(JSON.stringify(a)),n=t;for(let e of s)n=n[e].children;n[e]?(b=`mkdir: no se puede crear el directorio «${e}»: El archivo ya existe`,T=!0):(n[e]={name:e,type:`dir`,permissions:`drwxr-xr-x`,owner:`hugo`,group:`hugo`,size:4096,date:`Apr 21 18:33`,children:{}},o(t));break}case`rm`:{let e=v.includes(`-r`)||v.includes(`-rf`),t=v.find(e=>!e.startsWith(`-`));if(!t){b=`rm: falta el operando`,T=!0;break}let n=JSON.parse(JSON.stringify(a)),r=n;for(let e of s)r=r[e].children;let i=r[t];i?i.type===`dir`&&!e?(b=`rm: no se puede borrar '${t}': Es un directorio (use -r)`,T=!0):(delete r[t],o(n)):(b=`rm: no se puede borrar '${t}': No existe el archivo o el directorio`,T=!0);break}case`chmod`:{if(v.length<2){b=`chmod: faltan operandos (ej: chmod 755 archivo)`,T=!0;break}let e=v[0],t=v[1],n=JSON.parse(JSON.stringify(a)),r=n;for(let e of s)r=r[e].children;let i=r[t];if(!i)b=`chmod: no se puede acceder a '${t}': No existe el archivo o el directorio`,T=!0;else if(/^[0-7]{3,4}$/.test(e)){let r=e.slice(-3),a=parseInt(r[0],10),s=parseInt(r[1],10),c=parseInt(r[2],10),l=e=>(e&4?`r`:`-`)+(e&2?`w`:`-`)+(e&1?`x`:`-`);i.permissions=(i.type===`dir`?`d`:`-`)+l(a)+l(s)+l(c),o(n),b=`Permisos de '${t}' actualizados a ${e} (${i.permissions})`}else b=`chmod: modo octal no válido: «${e}»`,T=!0;break}case`ip`:case`ifconfig`:b=`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
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
       valid_lft forever preferred_lft forever`;break;case`ping`:{let e=v.find(e=>!e.startsWith(`-`))||`1.1.1.1`;b=`PING ${e} (${e}) 56(84) bytes of data.
64 bytes from ${e}: icmp_seq=1 ttl=57 time=14.2 ms
64 bytes from ${e}: icmp_seq=2 ttl=57 time=13.8 ms
64 bytes from ${e}: icmp_seq=3 ttl=57 time=14.5 ms
64 bytes from ${e}: icmp_seq=4 ttl=57 time=13.9 ms

--- ${e} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.812/14.105/14.502/0.274 ms`;break}default:b=`bash: ${_}: orden no encontrada. Escribe 'help' para ver la lista de comandos disponibles.`,T=!0}b&&n.push({id:Date.now()+1,type:T?`error`:`output`,text:b}),f(e=>[...e,...n]),u(``)};return r(`div`,{className:`tool-card terminal-tool-card`,children:[r(`div`,{className:`tool-header`,children:[r(`div`,{className:`tool-icon-pill`,children:`💻`}),r(`div`,{children:[r(`h3`,{children:`Simulador de Terminal Linux en Navegador`}),r(`p`,{children:`Practica comandos reales de administración en un sistema de archivos virtual en memoria.`})]})]}),r(`div`,{className:`terminal-window`,children:[r(`div`,{className:`terminal-topbar`,children:[r(`div`,{className:`window-dots`,children:[r(`span`,{className:`dot dot--red`}),r(`span`,{className:`dot dot--yellow`}),r(`span`,{className:`dot dot--green`})]}),r(`div`,{className:`window-title`,children:[`hugo@apuntesdev: `,b]}),r(`div`,{className:`window-actions`,children:[r(`button`,{type:`button`,onClick:()=>{o(i()),c([`home`,`hugo`]),f([{id:Date.now(),type:`output`,text:`Terminal reiniciada con éxito.
Escribe 'help' para ver la lista de comandos.`}])},className:`term-reset-btn`,title:`Restaurar sistema de archivos original`,children:`🔄 Reiniciar VFS`}),r(`span`,{className:`online-tag`,children:[r(`span`,{className:`pulse-indicator`}),` VFS ACTIVO`]})]})]}),r(`div`,{className:`terminal-screen`,onClick:()=>v.current?.focus(),children:[d.map(e=>r(`div`,{className:`terminal-line line-${e.type}`,children:[e.prompt&&r(`span`,{className:`term-prompt`,children:[e.prompt,` `]}),r(`span`,{className:`term-text`,children:e.text})]},e.id)),r(`div`,{className:`terminal-active-line`,children:[r(`span`,{className:`term-prompt`,children:[x,` `]}),r(`input`,{ref:v,type:`text`,value:l,onInput:e=>u(e.currentTarget.value),onKeyDown:e=>{if(e.key===`Enter`)T(l);else if(e.key===`ArrowUp`){if(e.preventDefault(),p.length===0)return;let t=h===-1?p.length-1:Math.max(0,h-1);g(t),u(p[t]||``)}else if(e.key===`ArrowDown`){if(e.preventDefault(),h===-1)return;let t=h+1;t>=p.length?(g(-1),u(``)):(g(t),u(p[t]))}else if(e.key===`Tab`){e.preventDefault();let t=l.trim().split(` `),n=t[t.length-1]||``,r=w(a),i=Object.keys(r).filter(e=>e.startsWith(n));i.length===1&&(t[t.length-1]=i[0],u(t.join(` `)))}},className:`term-input`,autoFocus:!0,spellCheck:!1,autoComplete:`off`})]}),r(`div`,{ref:_})]})]}),r(`div`,{className:`terminal-hints-bar`,children:[r(`span`,{className:`hints-label`,children:`Atajos y Pruebas:`}),r(`button`,{type:`button`,onClick:()=>T(`ls -la`),className:`hint-btn`,children:`ls -la`}),r(`button`,{type:`button`,onClick:()=>T(`cat bienvenida.txt`),className:`hint-btn`,children:`cat bienvenida.txt`}),r(`button`,{type:`button`,onClick:()=>T(`cat /etc/passwd`),className:`hint-btn`,children:`cat /etc/passwd`}),r(`button`,{type:`button`,onClick:()=>T(`ip a`),className:`hint-btn`,children:`ip a`}),r(`button`,{type:`button`,onClick:()=>T(`ping -c 4 1.1.1.1`),className:`hint-btn`,children:`ping 1.1.1.1`}),r(`button`,{type:`button`,onClick:()=>T(`chmod 700 notas.md`),className:`hint-btn`,children:`chmod 700 notas.md`}),r(`button`,{type:`button`,onClick:()=>T(`help`),className:`hint-btn`,children:`help`})]})]})}export{a as default};