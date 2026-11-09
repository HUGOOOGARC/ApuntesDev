---
title: "Acceso Remoto Seguro: Bastionado de SSH y VPNs con WireGuard"
description: "Aprende a proteger las conexiones de administración remota: bastionado de OpenSSH mediante llaves Ed25519 y despliegue de túneles VPN modernos de alto rendimiento con WireGuard."
date: "2026-04-23"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Avanzado"
xp_recompensa: 75
monedas_recompensa: 15
draft: false
---

# 🔐 Acceso Remoto Seguro: Bastionado de SSH y VPN con WireGuard

Administrar servidores e infraestructuras a través de redes inseguras (como Internet) exige canales de comunicación con cifrado robusto y autenticación mutua. Los antiguos protocolos en texto plano como **Telnet** o **FTP** exponen credenciales a cualquier observador en la red. En este módulo aprenderás a proteger la administración con **OpenSSH blindado** y a crear túneles privados con la VPN moderna **WireGuard**.

---

## 1. Por qué SSH y Criptografía Asimétrica

**SSH** (*Secure Shell*, puerto TCP 22 por defecto) utiliza criptografía asimétrica para la autenticación y negociación de claves simétricas de sesión. En lugar de depender de contraseñas vulnerables a fuerza bruta, el estándar profesional utiliza pares de claves criptográficas:
- **Clave Privada (Private Key):** Se almacena exclusivamente en tu ordenador de trabajo, protegida con una frase de paso (*passphrase*). **Nunca se comparte ni se sube a un servidor.**
- **Clave Pública (Public Key):** Se instala en el servidor en el archivo `~/.ssh/authorized_keys`.

```text
[ Cliente (Tú) ]                                     [ Servidor SSH ]
    ├── Clave Privada (id_ed25519)                      └── Clave Pública autorizada
    │                                                        (authorized_keys)
    └── Desafío firmado digitalmente ───────────────► Verifica la firma (OK)
```

---

## 2. Generación de Claves con Curvas Elípticas (Ed25519)

El algoritmo clásico RSA requiere 4096 bits para ser seguro hoy en día. El estándar moderno recomendado es **Ed25519**, que ofrece mayor seguridad con claves de solo 256 bits, mayor velocidad y resistencia a ataques de canal lateral:

```bash
# 1. Generar par de claves Ed25519 con comentario identificativo
ssh-keygen -t ed25519 -C "hugo-admin@apuntesdev.com"

# 2. Copiar la clave pública al servidor remoto de forma segura
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@192.168.1.100
```

---

## 3. Bastionado (*Hardening*) del Servidor OpenSSH

Edita el archivo de configuración del demonio SSH en el servidor:
```bash
sudo nano /etc/ssh/sshd_config
```

Aplica las siguientes directivas de máxima seguridad:

```ini
# Cambiar el puerto por defecto para mitigar escáneres masivos de bots
Port 2222

# Deshabilitar inicio de sesión directo como root (obliga a usar sudo)
PermitRootLogin no

# Deshabilitar autenticación por contraseña (solo se admiten llaves criptográficas)
PasswordAuthentication no
PermitEmptyPasswords no

# Habilitar autenticación por llave pública
PubkeyAuthentication yes

# Limitar los intentos máximos de autenticación antes de cortar la conexión
MaxAuthTries 3

# Desactivar reenvío de agentes X11 innecesarios
X11Forwarding no

# Restringir el acceso exclusivamente a usuarios autorizados
AllowUsers sysadmin hugo-admin
```

### Probar la configuración antes de reiniciar el servicio
**Regla de oro de la administración de sistemas:** Nunca reinicies SSH sin comprobar antes la sintaxis:
```bash
# Comprobar sintaxis sin reiniciar (si no devuelve nada, está correcto)
sudo sshd -t

# Reiniciar el servicio
sudo systemctl restart sshd
```

> **Consejo vital:** Mantén abierta tu sesión actual de terminal y abre una segunda ventana para probar el acceso por el nuevo puerto (`ssh -p 2222 hugo-admin@servidor`). Si algo falla, aún tendrás la primera terminal abierta para corregirlo.

---

## 4. Redes Privadas Virtuales (VPN): Concepto

Una **VPN** crea un túnel cifrado punto a punto a través de una red pública (Internet), encapsulando los paquetes de red originales dentro de paquetes seguros:

```text
[ Portátil Remoto ] ──(Túnel Cifrado WireGuard UDP 51820)──► [ Servidor VPN ] ──► [ Red Interna LAN ]
 (IP: 10.0.0.2)                                               (IP: 10.0.0.1)      (192.168.10.0/24)
```

A diferencia de protocolos pesados con millones de líneas de código como OpenVPN o IPsec, **WireGuard** está integrado directamente en el kernel Linux desde la versión 5.6:
- **Solo ~4.000 líneas de código:** Auditable y con una superficie de ataque mínima.
- **Rendimiento extremo:** Criptografía moderna (ChaCha20-Poly1305, Curve25519, BLAKE2s) acelerada por hardware.
- **Conexión instantánea:** No tiene estados pesados de handshake; si la IP cambia (ej. de Wi-Fi a 4G), la conexión no se corta (*roaming* transparente).

---

## 5. Despliegue de WireGuard en Linux

### Generación de claves en el Servidor
```bash
sudo apt install wireguard
cd /etc/wireguard
umask 077
wg genkey | tee server_private.key | wg pubkey > server_public.key
```

### Configuración del Servidor (`/etc/wireguard/wg0.conf`)
```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <CONTENIDO_DE_server_private.key>
# Habilitar NAT/Enrutamiento al levantar el túnel
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Cliente 1 (Portátil Hugo)
[Peer]
PublicKey = <CLAVE_PUBLICA_DEL_CLIENTE>
AllowedIPs = 10.0.0.2/32
```

### Configuración del Cliente (`wg0-client.conf`)
```ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = <CLAVE_PRIVADA_DEL_CLIENTE>
DNS = 1.1.1.1

[Peer]
PublicKey = <CLAVE_PUBLICA_DEL_SERVIDOR>
Endpoint = vpn.miempresa.com:51820
# Enrutar todo el tráfico por la VPN (Full Tunnel)
AllowedIPs = 0.0.0.0/0
# Mantener el túnel activo a través de NAT/Routers cada 25 segundos
PersistentKeepalive = 25
```

### Control y monitorización del túnel
```bash
# Levantar la interfaz de la VPN
sudo wg-quick up wg0

# Habilitar en el arranque del sistema
sudo systemctl enable wg-quick@wg0

# Comprobar el estado, datos transferidos y último apretón de manos (handshake)
sudo wg show
```

Salida esperada:
```text
interface: wg0
  public key: oP8K1...7bA=
  private key: (hidden)
  listening port: 51820

peer: dU6N2...4kL=
  endpoint: 88.24.12.5:49152
  allowed ips: 10.0.0.2/32
  latest handshake: 14 seconds ago
  transfer: 4.82 MiB received, 18.23 MiB sent
```

---

## 6. Resumen Comparativo de Seguridad

| Parámetro | Telnet / FTP | SSH Estándar | SSH Hardened | WireGuard VPN |
| :--- | :--- | :--- | :--- | :--- |
| **Cifrado de datos** | ❌ No (Texto claro) | ✅ Sí | ✅ Sí (Ed25519) | ✅ Sí (ChaCha20) |
| **Protección fuerza bruta** | ❌ Nula | ⚠️ Media | 🔒 Máxima (Llaves obligatorias) | 🔒 Imposible (Sin puerto abierto detectable) |
| **Alcance** | 1 Servicio | Terminal / SFTP | Terminal / SFTP | **Toda la red privada (Capa 3)** |
