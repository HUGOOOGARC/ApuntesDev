---
title: "Direccionamiento IPv6, Reglas de Compresión y Autoconfiguración SLAAC"
description: "Aprende la estructura de 128 bits de IPv6, tipos de direcciones (Global Unicast, Link-Local), reglas de omisión de ceros y autoconfiguración automática con SLAAC."
date: "2026-04-20"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🌌 Direccionamiento IPv6 y Autoconfiguración SLAAC

El agotamiento oficial de las direcciones **IPv4** (que solo dispone de unos 4.300 millones de direcciones de 32 bits) motivó la creación de **IPv6**. Con una longitud de **128 bits**, IPv6 ofrece un espacio prácticamente ilimitado: aproximadamente $3.4 \times 10^{38}$ direcciones únicas (unos 340 sextillones de IPs).

---

## 1. Estructura y Notación de una Dirección IPv6

Las direcciones IPv6 se representan mediante **8 grupos de 4 dígitos hexadecimales** (llamados *hextetos* o bloques de 16 bits), separados por dos puntos (`:`):

```text
Formato: 2001 : 0db8 : 85a3 : 0000 : 0000 : 8a2e : 0370 : 7334
Bits:    └16─┘   └16─┘   └16─┘   └16─┘   └16─┘   └16─┘   └16─┘   └16─┘  = 128 bits
```

Se divide en:
- **Prefijo de Red (Normalmente /64):** Los primeros 64 bits identifican la red y subred global.
- **Identificador de Interfaz (Interface ID):** Los últimos 64 bits identifican de forma única al host dentro de ese segmento.

---

## 2. Reglas de Abreviación y Compresión (Obligatorias en Examen)

Para que las direcciones no sean kilométricas, existen dos reglas oficiales de compresión:

### Regla 1: Omisión de los ceros iniciales en cada hexteto
Los ceros a la izquierda dentro de cualquier bloque pueden eliminarse:
- `0db8` se convierte en `db8`.
- `0000` se convierte en `0`.
- `0370` se convierte en `370` *(Ojo: los ceros finales NO se pueden quitar)*.

### Regla 2: Sustitución por doble dos puntos (`::`)
Una serie contigua de uno o más bloques formados exclusivamente por ceros (`0000:0000`) puede reemplazarse por **`::`**:
> ⚠️ **Restricción Estricta:** El símbolo `::` solo puede aparecer **una única vez** en toda la dirección para evitar ambigüedad al descomprimir.

### Ejemplo de Compresión Completa:
```text
Original:    2001 : 0db8 : 0000 : 0000 : 0000 : 0000 : 0000 : 0001
Regla 1:     2001 : db8  : 0    : 0    : 0    : 0    : 0    : 1
Regla 2:     2001 : db8  :: 1  (¡Dirección final compacta!)
```

---

## 3. Tipos de Direcciones IPv6 Esenciales

A diferencia de IPv4, en IPv6 **no existe el concepto de Broadcast**. Las comunicaciones son Unicast, Multicast o Anycast.

| Tipo de Dirección | Rango de Prefijo | Propósito |
|---|---|---|
| **Global Unicast (GUA)** | `2000::/3` (2000:: a 3fff::) | IP pública enrutable por todo Internet (equivalente a IP pública IPv4) |
| **Link-Local (LLA)** | `fe80::/10` (fe80:: a febf::) | IP para comunicarse **únicamente dentro del mismo cable/segmento**. No cruza routers |
| **Loopback** | `::1/128` | Dirección local de bucle invertido (equivalente al `127.0.0.1` de IPv4) |
| **Dirección no especificada** | `::/128` | Indica ausencia de IP (equivalente a `0.0.0.0` de IPv4) |
| **Multicast** | `ff00::/8` | Mensajes dirigidos a grupos de dispositivos (ej. `ff02::1` = todos los nodos) |

---

## 4. Autoconfiguración Automática con SLAAC

**SLAAC (Stateless Address Autoconfiguration)** permite que un dispositivo cliente obtenga conectividad a Internet de forma autónoma sin necesidad de que exista un servidor DHCP:

1. El router envía periódicamente mensajes **ICMPv6 RA (Router Advertisement)** anunciando el prefijo de red (ej. `2001:db8:acad:1::/64`).
2. El cliente recibe el prefijo y genera por sí mismo los 64 bits restantes de su interfaz (mediante el algoritmo EUI-64 basado en su MAC o mediante aleatoriedad para proteger su privacidad).
3. Realiza una comprobación **DAD (Duplicate Address Detection)** para verificar que nadie más tiene esa IP y ya tiene conectividad completa.

---

## 5. Configuración de IPv6 en Routers Cisco

```cisco
Router> enable
Router# configure terminal

! 1. OBLIGATORIO: Habilitar el enrutamiento de paquetes IPv6 en el kernel del router
Router(config)# ipv6 unicast-routing

! 2. Configurar la interfaz con IP Global Unicast y Link-Local personalizada
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# ipv6 address 2001:db8:acad:1::1/64
Router(config-if)# ipv6 address fe80::1 link-local
Router(config-if)# no shutdown
Router(config-if)# exit

! 3. Verificar estado
Router# show ipv6 interface brief
```
