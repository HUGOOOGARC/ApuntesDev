---
title: "Enrutamiento Dinámico con OSPFv2 en Routers Cisco"
description: "Aprende el funcionamiento del protocolo de estado de enlace OSPF (Open Shortest Path First), cálculo de wildcards, áreas y configuración en Cisco IOS."
date: "2026-04-19"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Avanzado"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🚀 Enrutamiento Dinámico con OSPFv2 en Cisco

En redes medianas o grandes con decenas de routers, mantener rutas estáticas manualmente es insostenible: si un cable submarino o un enlace se corta, la red queda aislada hasta que un administrador modifique la configuración.

Los protocolos de **enrutamiento dinámico** permiten que los routers intercambien información entre sí de forma automática y recalculen rutas alternativas en cuestión de segundos ante caídas de enlace. El protocolo estándar abierto más utilizado del mundo es **OSPF (Open Shortest Path First)**.

---

## 1. Características Clave de OSPF

- **Algoritmo de Estado de Enlace (Link-State):** Utiliza el algoritmo SPF de Dijkstra para calcular el árbol de caminos más cortos.
- **Métrica basada en Coste (Cost):** El coste es inversamente proporcional al **ancho de banda** del enlace. A mayor velocidad (ej. 1 Gbps vs 10 Mbps), menor coste y mayor preferencia.
- **Convergencia Rápida:** Si un enlace cae, propaga inmediatamente paquetes LSA (*Link-State Advertisements*).
- **Diseño Jerárquico en Áreas:** Todas las áreas deben conectarse al área central de red troncal: el **Área 0 (Backbone)**.

---

## 2. El Concepto de Máscara Wildcard (Máscara Invertida)

A diferencia de las máscaras de red normales, OSPF utiliza **máscaras wildcard**, donde los bits en `0` indican comprobación exacta y los bits en `1` indican "no importa":

### Regla para calcular la Wildcard:
Resta la máscara de subred normal a `255.255.255.255`:

```text
    255 . 255 . 255 . 255
 -  255 . 255 . 255 . 0     (Máscara /24)
 ─────────────────────────
      0 .   0 .   0 . 255   (Wildcard para /24)

Otro ejemplo para máscara /26 (255.255.255.192):
    255 . 255 . 255 . 255
 -  255 . 255 . 255 . 192
 ─────────────────────────
      0 .   0 .   0 .  63   (Wildcard para /26)
```

---

## 3. Configuración de OSPF en Cisco IOS

Imaginemos un router conectado a dos redes que debe anunciar al resto de la topología:
- Red LAN: `192.168.10.0/24` en GigabitEthernet 0/0
- Enlace WAN: `10.0.0.0/30` en GigabitEthernet 0/1

```cisco
Router> enable
Router# configure terminal

! 1. Iniciar el proceso OSPF (el número '1' es el Process ID local)
Router(config)# router ospf 1

! 2. Asignar un identificador único al router (Router ID de 32 bits)
Router(config-router)# router-id 1.1.1.1

! 3. Publicar las redes directamente conectadas en el Área 0
Router(config-router)# network 192.168.10.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.3 area 0

! 4. Buena práctica: Interfaz pasiva hacia la LAN de usuarios
! (Evita enviar paquetes Hello de OSPF innecesarios hacia los ordenadores de los alumnos)
Router(config-router)# passive-interface gigabitEthernet 0/0

Router(config-router)# exit
```

---

## 4. Requisitos para Formar Vecindad (Adjacency)

Para que dos routers vecinos levanten una relación OSPF y comiencen a intercambiar tablas, deben coincidir en:
1. Pertenecer a la misma **Área** (ej: Área 0).
2. Tener la misma **máscara de subred** en el enlace compartido.
3. Coincidir en los temporizadores **Hello** (10s) y **Dead Interval** (40s).
4. Coincidir en la contraseña de autenticación (si está habilitada).

---

## 5. Comandos de Diagnóstico y Monitoreo OSPF

```cisco
! 1. Ver qué routers vecinos ha descubierto y su estado (Debe decir 'FULL')
Router# show ip ospf neighbor

! 2. Ver las rutas aprendidas específicamente mediante OSPF (Identificadas con la letra 'O')
Router# show ip route ospf

! 3. Ver parámetros generales del protocolo y las interfaces activas
Router# show ip ospf interface brief
```
