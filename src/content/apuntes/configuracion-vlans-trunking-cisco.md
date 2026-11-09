---
title: "Configuración de VLANs y Enlaces Trunk (802.1Q) en Cisco"
description: "Aprende a crear VLANs, configurar puertos en modo access y trunk, y habilitar el estándar IEEE 802.1Q en switches Cisco IOS."
date: "2026-04-02"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🔀 Configuración de VLANs y Trunking (802.1Q) en Cisco

Las **VLANs (Virtual Local Area Networks)** permiten segmentar lógicamente una red conmutada a nivel de Capa 2 (Enlace de Datos). Reducen el dominio de difusión (broadcast domain), aumentan la seguridad y optimizan el ancho de banda disponible.

---

## 1. Topología y Escenario

Imaginemos un entorno corporativo donde aislaremos el tráfico de **Administración** y **Alumnos**:

- **VLAN 10:** `ADMIN` — Red `192.168.10.0/24`
- **VLAN 20:** `ALUMNOS` — Red `192.168.20.0/24`
- **Puertos FastEthernet 0/1 - 0/10:** Pertenecen a la VLAN 10 (Access)
- **Puertos FastEthernet 0/11 - 0/20:** Pertenecen a la VLAN 20 (Access)
- **Puerto GigabitEthernet 0/1:** Enlace Troncal (Trunk) hacia otro Switch o Router

---

## 2. Creación de VLANs en Cisco IOS

Accedemos al modo de configuración global e instanciamos las bases de datos de VLAN:

```cisco
Switch> enable
Switch# configure terminal

! Creación de la VLAN 10
Switch(config)# vlan 10
Switch(config-vlan)# name ADMIN
Switch(config-vlan)# exit

! Creación de la VLAN 20
Switch(config)# vlan 20
Switch(config-vlan)# name ALUMNOS
Switch(config-vlan)# exit
```

---

## 3. Asignación de Puertos de Acceso (Access Ports)

Un puerto en modo **access** solo puede pertenecer a una única VLAN y no etiqueta las tramas que van al host final:

```cisco
! Configuración de un rango de puertos para la VLAN 10
Switch(config)# interface range fastEthernet 0/1 - 10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# exit

! Configuración de un rango de puertos para la VLAN 20
Switch(config)# interface range fastEthernet 0/11 - 20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit
```

---

## 4. Configuración del Enlace Troncal (Trunk 802.1Q)

El enlace troncal transporta el tráfico de múltiples VLANs a través de un único cable físico añadiendo una etiqueta de 4 bytes en la cabecera Ethernet según el estándar **IEEE 802.1Q**:

```cisco
Switch(config)# interface gigabitEthernet 0/1
! En switches multicapa o modelos que soporten ISL, definimos primero el encapsulation:
! Switch(config-if)# switchport trunk encapsulation dot1q
Switch(config-if)# switchport mode trunk

! Opcional: Filtrar las VLANs permitidas por el troncal (Buena práctica de seguridad)
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# exit
```

---

## 5. Comandos de Verificación y Diagnóstico

Para comprobar que todo está funcionando correctamente, ejecutamos:

```cisco
! Ver todas las VLANs y puertos asignados
Switch# show vlan brief

! Ver el estado y negociación de los enlaces troncales
Switch# show interfaces trunk

! Ver detalles de una interfaz específica
Switch# show interfaces fa0/1 switchport
```

> 💡 **Consejo de Examen:** Nunca uses la `VLAN 1` (default) para tráfico de usuarios en producción; cámbiala como medida de hardening contra ataques de *VLAN Hopping*.
