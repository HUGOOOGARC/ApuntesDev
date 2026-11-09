---
title: "Cableado Estructurado, Estándares Ethernet y Protocolo ARP"
description: "Aprende los estándares de cableado T568A/B, par trenzado vs fibra óptica, formato de direcciones MAC, tablas CAM de switches y el protocolo ARP."
date: "2026-04-17"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🔌 Cableado Estructurado, Ethernet y Protocolo ARP

La Capa Física y la Capa de Enlace de Datos son los cimientos tangibles de una red local (LAN). Un conector mal crimpado o una colisión en Capa 2 puede dejar incomunicado a todo un departamento.

---

## 1. Medios de Transmisión de Cobre: Par Trenzado (UTP / STP)

El cable de par trenzado utiliza 4 pares de hilos de cobre trenzados entre sí para cancelar las interferencias electromagnéticas externas (*crosstalk*):

- **UTP (Unshielded Twisted Pair):** Sin apantallar. El más común en oficinas por ser flexible y económico.
- **FTP / STP (Shielded Twisted Pair):** Con malla o lámina de aluminio protectora contra campos magnéticos intensos en entornos industriales.

### Categorías de cable UTP:
- **Cat 5e:** Hasta **1 Gbps** a 100 MHz (Distancia máxima estándar: **100 metros**).
- **Cat 6:** Hasta **1 Gbps** a 250 MHz (o 10 Gbps en distancias cortas < 55m).
- **Cat 6a:** Hasta **10 Gbps** a 500 MHz garantizados hasta 100 metros.

---

## 2. Estándares de Crimpar RJ-45: T568A vs T568B

Para terminar un cable en un conector **RJ-45**, los 8 hilos deben colocarse en un orden cromático específico:

```text
Pin   Estándar T568A            Estándar T568B (Más usado)
───   ──────────────────────    ──────────────────────────
 1    Blanco / Verde            Blanco / Naranja
 2    Verde                     Naranja
 3    Blanco / Naranja          Blanco / Verde
 4    Azul                      Azul
 5    Blanco / Azul             Blanco / Azul
 6    Naranja                   Verde
 7    Blanco / Marrón           Blanco / Marrón
 8    Marrón                    Marrón
```

- **Cable Directo (Straight-through):** Mismo estándar en ambos extremos (T568B en ambos lados). Se usa para conectar dispositivos de diferente naturaleza: **PC a Switch**, **Router a Switch**.
- **Cable Cruzado (Crossover):** Un extremo en T568A y el otro en T568B. Se usaba históricamente para conectar dispositivos iguales: **PC a PC**, **Switch a Switch**.
- *(Nota técnica: Hoy en día las tarjetas de red incorporan **Auto-MDIX**, que detecta el tipo de cable y conmuta los pares automáticamente).*

---

## 3. Direcciones MAC y Conmutación en Capa 2

Cada tarjeta de red (NIC) tiene una dirección física grabada de fábrica denominada **dirección MAC (Media Access Control)** de **48 bits** (6 pares de dígitos hexadecimales):

```text
Formato:   [ 00 : 1A : 2B ] : [ 3C : 4D : 5E ]
           └──────────────┘   └──────────────┘
            OUI (Fabricante)   NIC (Número de Serie único)
```

- **Los primeros 24 bits (OUI):** Identifican a la empresa fabricante (ej: Intel, Cisco, Realtek), asignados por el IEEE.
- **Los últimos 24 bits:** Identificador único asignado por el fabricante a esa placa.

### La Tabla CAM del Switch
A diferencia de los antiguos concentradores (*Hubs*) que enviaban cada paquete a todos los puertos, un **Switch** aprende qué dirección MAC está conectada a cada puerto físico y la guarda en su memoria **CAM (Content Addressable Memory)** para enviar las tramas únicamente al destinatario.

---

## 4. El Protocolo ARP (Address Resolution Protocol)

Cuando el equipo `PC-A` (`192.168.1.10`) quiere enviar un paquete al equipo `PC-B` (`192.168.1.50`), conoce su dirección IP, pero para encapsular la trama en Capa 2 **necesita conocer su dirección MAC destino**. Aquí entra en juego **ARP**:

```text
1. ARP Request (Broadcast FF:FF:FF:FF:FF:FF):
   PC-A grita a toda la red: "¿Quién tiene la IP 192.168.1.50? ¡Dime tu MAC!"

2. ARP Reply (Unicast hacia PC-A):
   PC-B responde directamente: "¡Soy yo! Mi dirección MAC es 00:11:22:33:44:55"

3. Caché ARP:
   PC-A guarda la correspondencia IP <-> MAC en su tabla temporal para futuros envíos.
```

### Comandos de Inspección ARP en la Terminal:

En **Linux**:
```bash
# Ver la tabla ARP con las IPs y MACs aprendidas
ip neigh show
# O el comando clásico:
arp -a

# Borrar una entrada de la tabla ARP
sudo ip neigh del 192.168.1.50 dev eth0
```

En **Windows**:
```cmd
arp -a
arp -d *
```
