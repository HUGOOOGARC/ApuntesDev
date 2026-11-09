---
title: "El Modelo OSI y TCP/IP: Arquitectura de Protocolos y Encapsulación"
description: "Comprende las 7 capas del modelo OSI, la pila TCP/IP, las Unidades de Datos de Protocolo (PDU) y la diferencia entre los protocolos TCP y UDP."
date: "2026-04-16"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🌐 El Modelo OSI y TCP/IP: Arquitectura de Protocolos

Para que dos dispositivos electrónicos puedan comunicarse a través de un cable o del aire, necesitan seguir un conjunto estandarizado de reglas conocido como **pila de protocolos**. Los dos modelos de referencia fundamentales en redes son el modelo teórico **OSI (Open Systems Interconnection)** y el modelo práctico de Internet **TCP/IP**.

---

## 1. Comparativa de Capas: OSI vs TCP/IP

```text
       MODELO OSI (7 Capas)                  MODELO TCP/IP (4 Capas)
┌─────────────────────────────────┐       ┌───────────────────────────────┐
│ 7. Aplicación (HTTP, DNS, SSH)  │       │                               │
├─────────────────────────────────┤       │  Aplicación                   │
│ 6. Presentación (SSL, JPEG)     │ ────> │  (HTTP, DNS, SSH, FTP, SMTP)  │
├─────────────────────────────────┤       │                               │
│ 5. Sesión (RPC, NetBIOS)        │       │                               │
├─────────────────────────────────┤       ├───────────────────────────────┤
│ 4. Transporte (TCP, UDP)        │ ────> │  Transporte (TCP / UDP)       │
├─────────────────────────────────┤       ├───────────────────────────────┤
│ 3. Red (IP, ICMP, ARP)          │ ────> │  Internet (IPv4 / IPv6 / ICMP)│
├─────────────────────────────────┤       ├───────────────────────────────┤
│ 2. Enlace de Datos (Ethernet)   │ ────> │  Acceso a la Red              │
├─────────────────────────────────┤       │  (Ethernet, Wi-Fi 802.11)     │
│ 1. Física (Cables, Señales, Hz) │ ────> │                               │
└─────────────────────────────────┘       └───────────────────────────────┘
```

### Regla Mnemotécnica para recordar las 7 capas de OSI (de abajo a arriba):
**F**ísico, **E**nlace, **R**ed, **T**ransporte, **S**esión, **P**resentación, **A**plicación
*(“**F**er **E**s **R**ápido **T**ransportando **S**obres **P**or **A**vión”)*

---

## 2. El Proceso de Encapsulación y las PDUs

A medida que los datos viajan desde la aplicación del emisor hacia el cable físico, cada capa añade su propia cabecera (*header*) con metadatos de control. A cada formato de datos se le llama **PDU (Protocol Data Unit)**:

```text
[ Capa de Aplicación ]  ──>  DATOS (Payload)
         │
         ▼ (Añade puerto origen y destino)
[ Capa de Transporte ]  ──>  SEGMENTO (TCP) o DATAGRAMA (UDP)
         │
         ▼ (Añade IP origen y destino)
[ Capa de Red ]         ──>  PAQUETE (Packet)
         │
         ▼ (Añade MAC origen, MAC destino y CRC/Trailer)
[ Capa de Enlace ]      ──>  TRAMA (Frame)
         │
         ▼ (Convierte a impulsos eléctricos o pulsos de luz)
[ Capa Física ]         ──>  BITS (0s y 1s)
```

Al llegar al receptor, se produce el proceso inverso: **Desencapsulación**.

---

## 3. Capa de Transporte: TCP vs UDP

| Característica | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|---|---|---|
| **Conexión** | **Orientado a conexión** (requiere 3-Way Handshake) | **No orientado a conexión** (envía sin verificar) |
| **Fiabilidad** | Garantizada (retransmite paquetes perdidos con ACKs) | No garantizada (si se pierde un paquete, se descarta) |
| **Velocidad** | Más lento debido a la sobrecarga de control | **Ultra rápido** y ligero (cabecera de solo 8 bytes) |
| **Orden** | Reordena los paquetes al recibirlos | Los entrega según van llegando |
| **Casos de uso** | Web (HTTP/HTTPS), Transferencia de archivos (FTP), SSH | Streaming en vivo, llamadas VoIP, videojuegos online, DNS |

### El saludo en 3 vías de TCP (3-Way Handshake):
```text
Cliente                        Servidor
   │                              │
   │ ─── 1. SYN (Sincronizar) ──> │  "¿Podemos hablar? Mi seq = 100"
   │                              │
   │ <── 2. SYN-ACK ───────────── │  "Recibido, hablemos. Mi seq = 300, ack = 101"
   │                              │
   │ ─── 3. ACK (Confirmación) ─> │  "Perfecto. Conexión establecida."
   │                              │
```

---

## 4. Puertos Estándar Más Frecuentes en Examen

Los puertos van del `0` al `65535` y permiten al sistema operativo saber a qué aplicación entregar cada paquete:

- **20 / 21**: FTP (Transferencia de archivos)
- **22**: SSH (Acceso remoto seguro por terminal)
- **23**: Telnet (Acceso remoto sin cifrar - inseguro)
- **25**: SMTP (Envío de correo electrónico)
- **53**: DNS (Resolución de nombres a IP - usa UDP/TCP)
- **67 / 68**: DHCP (Asignación automática de IP)
- **80**: HTTP (Web sin cifrar)
- **443**: HTTPS (Web segura con cifrado SSL/TLS)
- **3389**: RDP (Escritorio remoto de Windows)
