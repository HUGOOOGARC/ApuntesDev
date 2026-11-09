---
title: "Seguridad Perimetral: Cortafuegos (UFW / iptables) y NAT"
description: "Aprende a proteger servidores y redes perimetrales con cortafuegos de filtrado de paquetes de estado (UFW e iptables), reglas avanzadas y traducción de direcciones NAT/PAT."
date: "2026-04-22"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Avanzado"
xp_recompensa: 75
monedas_recompensa: 15
draft: false
---

# 🛡️ Seguridad Perimetral: Cortafuegos (UFW e iptables) y NAT

Un cortafuegos (*firewall*) es la primera línea de defensa perimetral de cualquier infraestructura de red. Su misión principal es inspeccionar el tráfico de red entrante y saliente, aplicando un conjunto de políticas de seguridad para permitir o denegar el paso de paquetes en función de direcciones IP, puertos y estados de conexión.

---

## 1. Tipos de Cortafuegos: Stateless vs Stateful

- **Filtrado sin estado (Stateless / Packet Filtering clásico):** Inspecciona cada paquete de forma aislada comparando cabeceras IP y TCP/UDP. No recuerda si un paquete entrante es una respuesta legítima a una petición que inició tu propio servidor.
- **Filtrado con inspección de estados (Stateful Inspection):** Mantiene una tabla en memoria (*conntrack*) con el estado de cada flujo de conexión TCP/UDP/ICMP:
  - `NEW`: Paquete inicial que solicita abrir una conexión nueva (ej. TCP SYN).
  - `ESTABLISHED`: Paquetes que forman parte de una conexión ya validada y bidireccional.
  - `RELATED`: Conexiones accesorias iniciadas por un servicio activo (como canales de datos en FTP pasivo o mensajes de error ICMP).
  - `INVALID`: Paquetes corruptos, mal formados o que no pertenecen a ninguna sesión conocida (deben ser descartados de inmediato).

---

## 2. Gestión Simplificada con UFW (Ubuntu / Debian)

**UFW** (*Uncomplicated Firewall*) es una interfaz de alto nivel para gestionar el filtrado de red del kernel Linux de forma intuitiva y sin riesgo de quedar bloqueado accidentalmente.

### Política por defecto (Default Deny)

El principio de mínimo privilegio en seguridad dicta que todo lo no explícitamente permitido debe ser bloqueado:

```bash
# 1. Denegar todas las conexiones entrantes no autorizadas
sudo ufw default deny incoming

# 2. Permitir el tráfico saliente originado en el servidor
sudo ufw default allow outgoing
```

### Reglas de apertura de servicios

```bash
# Permitir SSH (¡vital antes de activar el firewall en un servidor remoto!)
sudo ufw allow 22/tcp comment 'Acceso SSH remoto'

# Permitir servidores Web (HTTP 80 y HTTPS 443)
sudo ufw allow http
sudo ufw allow https
# O equivalente por puertos:
sudo ufw allow 80,443/tcp

# Permitir acceso a Base de Datos MySQL sólo desde una subred de confianza
sudo ufw allow from 192.168.10.0/24 to any port 3306 proto tcp comment 'Acceso MySQL desde LAN interna'
```

### Habilitación y gestión de reglas

```bash
# Habilitar el cortafuegos (persistente entre reinicios)
sudo ufw enable

# Consultar el estado y las reglas numeradas
sudo ufw status numbered
```

Salida típica:
```text
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere                   # Acceso SSH remoto
[ 2] 80,443/tcp                 ALLOW IN    Anywhere                  
[ 3] 3306/tcp                   ALLOW IN    192.168.10.0/24            # Acceso MySQL LAN
```

Para eliminar una regla concreta por su número:
```bash
sudo ufw delete 3
```

---

## 3. Arquitectura Interna de iptables / Netfilter

Bajo el capó, el kernel de Linux utiliza el framework **Netfilter**, controlado históricamente mediante **iptables** (y modernamente mediante `nftables`).

`iptables` organiza las reglas en **Tablas** (`tables`) y **Cadenas** (`chains`):

```text
                               [ Paquete Entrante ]
                                        │
                                        ▼
                                 [ PREROUTING ] (DNAT / Port Forwarding)
                                        │
                                        ▼
                           ¿Es para este host local?
                              /                    \
                         (Sí)                       (No)
                          /                           \
                         ▼                             ▼
                    [ INPUT ]                     [ FORWARD ]
                         │                             │
                   (Proceso Local)                     │
                         │                             │
                         ▼                             ▼
                    [ OUTPUT ] ──────────────► [ POSTROUTING ] (SNAT / Masquerade)
                                                       │
                                                       ▼
                                              [ Paquete Saliente ]
```

### Tablas principales:
1. `filter`: Tabla por defecto para decisiones de seguridad (`ACCEPT`, `DROP`, `REJECT`).
   - Cadenas: `INPUT` (paquetes con destino al propio servidor), `OUTPUT` (paquetes generados por el servidor), `FORWARD` (paquetes enrutados a través del servidor hacia otros equipos).
2. `nat`: Modifica las cabeceras de red para traducir direcciones o puertos.
   - Cadenas: `PREROUTING`, `POSTROUTING`, `OUTPUT`.

---

## 4. Traducción de Direcciones de Red: NAT y Port Forwarding

### SNAT / Masquerading (Compartir Internet con una LAN)
Permite que todos los dispositivos con IPs privadas (ej. `192.168.1.0/24`) salgan a Internet utilizando la única IP pública del router/servidor:

```bash
# 1. Habilitar reenvío de paquetes en el kernel
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf

# 2. Aplicar enmascaramiento en la interfaz WAN (ej. eth0)
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# 3. Permitir el tráfico de reenvío para conexiones establecidas
sudo iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
```

### DNAT / Port Forwarding (Publicar servidores internos hacia el exterior)
Redirige el tráfico que llega al router en un puerto público hacia un equipo privado de la LAN:

```bash
# Redirigir el puerto público 8080 hacia el servidor web interno 192.168.1.50 en el puerto 80
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80

# Permitir el paso del paquete reenviado en la cadena FORWARD
sudo iptables -A FORWARD -p tcp -d 192.168.1.50 --dport 80 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
```

---

## 5. Resumen de Buenas Prácticas de Hardening

1. **Denegar por defecto:** Todo lo que no esté en la lista blanca de puertos y orígenes debe ser descartado silenciosamente con `DROP` (evita dar información a escáneres con `REJECT`).
2. **Filtrar por origen en servicios críticos:** Nunca dejes puertos administrativos como SSH, phpMyAdmin o consolas de bases de datos expuestos a `0.0.0.0/0`.
3. **Controlar la tabla conntrack:** Permitir siempre `ESTABLISHED,RELATED` al inicio de las reglas para reducir el consumo de CPU al evaluar paquetes de flujos activos.
