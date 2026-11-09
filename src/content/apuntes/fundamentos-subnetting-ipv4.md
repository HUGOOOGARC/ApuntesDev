---
title: "Fundamentos de Direccionamiento IPv4, Máscaras y Subnetting"
description: "Aprende el cálculo de direcciones de red, broadcast, máscaras de subred y división de redes con VLSM para SMR."
date: "2026-04-01"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🌐 Fundamentos de Direccionamiento IPv4 y Subnetting

El direccionamiento **IPv4** es la piedra angular de cualquier infraestructura de telecomunicaciones. Comprender cómo se segmentan los paquetes a nivel de Capa 3 (Red) del modelo OSI y cómo calcular rangos válidos es vital para cualquier técnico o administrador de sistemas.

---

## 1. Estructura de una Dirección IPv4

Una dirección IPv4 está compuesta por **32 bits**, divididos en 4 grupos de 8 bits llamados **octetos**, representados en formato decimal punteado:

```text
Formato:   [Octeto 1] . [Octeto 2] . [Octeto 3] . [Octeto 4]
Ejemplo:   192        . 168        . 1         . 10
Binario:   11000000   . 10101000   . 00000001  . 00001010
```

Cada dirección IPv4 se divide lógicamente en dos partes:
1. **Identificador de Red (Net ID):** Indica la red a la que pertenece el dispositivo.
2. **Identificador de Host (Host ID):** Identifica de forma única al dispositivo dentro de esa red.

---

## 2. Clases de Direcciones IPv4 y Rangos Privados (RFC 1918)

Las direcciones IPv4 se agrupan en clases históricas, aunque hoy en día se utiliza **CIDR** (Classless Inter-Domain Routing):

| Clase | Rango Primer Octeto | Máscara por defecto | Rango Privado (RFC 1918) |
|---|---|---|---|
| **Clase A** | `1.0.0.0` - `126.255.255.255` | `255.0.0.0` (/8) | `10.0.0.0` a `10.255.255.255` |
| **Clase B** | `128.0.0.0` - `191.255.255.255` | `255.255.0.0` (/16) | `172.16.0.0` a `172.31.255.255` |
| **Clase C** | `192.0.0.0` - `223.255.255.255` | `255.255.255.0` (/24) | `192.168.0.0` a `192.168.255.255` |

> ⚠️ **Nota:** El rango `127.0.0.0/8` está reservado exclusivamente para pruebas de **Loopback** (`127.0.0.1` = localhost).

---

## 3. Direcciones Reservadas en Toda Subred

En cualquier segmento de red, siempre hay dos direcciones que **no pueden asignarse a ningún host**:

1. **Dirección de Red:** Aquella donde todos los bits de host son `0`. Representa a la red entera.
2. **Dirección de Broadcast:** Aquella donde todos los bits de host son `1`. Se utiliza para enviar mensajes a todos los equipos del segmento.

### Fórmula para Calcular Hosts Disponibles

$$\text{Hosts válidos} = 2^h - 2$$

Donde $h$ es el número de bits disponibles para la parte de host.

---

## 4. Ejemplo Práctico: Subnetting con Notación CIDR (/26)

Imagina que te asignan la red `192.168.10.0/24` y necesitas dividirla en subredes con máscara `/26` (`255.255.255.192`):

- **Bits robados a host:** Pasamos de `/24` a `/26`, es decir, tomamos $2$ bits prestados.
- **Número de subredes creadas:** $2^2 = 4$ subredes.
- **Bits de host restantes:** $32 - 26 = 6$ bits.
- **Hosts útiles por subred:** $2^6 - 2 = 64 - 2 = 62$ hosts por subred.
- **Salto de red:** $256 - 192 = 64$.

### Tabla de Subredes Resultantes:

| Subred | Dirección de Red | Primer Host Útil | Último Host Útil | Dirección Broadcast |
|---|---|---|---|---|
| **Subred 1** | `192.168.10.0` | `192.168.10.1` | `192.168.10.62` | `192.168.10.63` |
| **Subred 2** | `192.168.10.64` | `192.168.10.65` | `192.168.10.126` | `192.168.10.127` |
| **Subred 3** | `192.168.10.128` | `192.168.10.129` | `192.168.10.190` | `192.168.10.191` |
| **Subred 4** | `192.168.10.192` | `192.168.10.193` | `192.168.10.254` | `192.168.10.255` |

---

## 5. Comandos de Verificación en la Terminal

En **Linux**:
```bash
# Ver IP y máscara en notación CIDR
ip -brief addr show

# Ver tabla de enrutamiento
ip route show

# Calcular subredes con herramienta cli
sudo apt install ipcalc -y
ipcalc 192.168.10.0/26
```

En **Windows**:
```cmd
ipconfig /all
route print -4
```
