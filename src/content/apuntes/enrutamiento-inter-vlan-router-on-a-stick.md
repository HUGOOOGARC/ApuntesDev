---
title: "Enrutamiento Inter-VLAN (Router-on-a-Stick) y Rutas Estáticas"
description: "Aprende a comunicar diferentes VLANs mediante la técnica Router-on-a-Stick (ROAS) con subinterfaces dot1Q en routers Cisco y configurar rutas estáticas."
date: "2026-04-18"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🔀 Enrutamiento Inter-VLAN (Router-on-a-Stick) y Rutas Estáticas

Por diseño de seguridad, los hosts situados en diferentes VLANs no pueden comunicarse entre sí en Capa 2, ya que pertenecen a distintos dominios de difusión. Para que un equipo de la **VLAN 10** hable con uno de la **VLAN 20**, el tráfico debe subir obligatoriamente a un dispositivo de **Capa 3 (Router o Switch Multicapa)**.

La técnica más extendida en laboratorios de Cisco Packet Tracer se denomina **Router-on-a-Stick (ROAS)**.

---

## 1. Topología del Router-on-a-Stick

En lugar de utilizar un cable físico diferente para cada VLAN entre el switch y el router, se utiliza un **único cable troncal** conectado a una interfaz física del router, dividida lógicamente en **subinterfaces virtuales**:

```text
       [ ROUTER R1 ]
             │
             │ (Enlace Físico Único G0/0 dividido en subinterfaces G0/0.10 y G0/0.20)
             ▼
     [ SWITCH SW1 (Puerto Trunk) ]
       ├── Puerto Fa0/1 (Access VLAN 10) ──> PC-1 (192.168.10.10)
       └── Puerto Fa0/2 (Access VLAN 20) ──> PC-2 (192.168.20.10)
```

---

## 2. Configuración en el Switch (SW1)

El puerto del switch que conecta hacia el router debe configurarse en modo troncal (**Trunk**) para permitir el paso de tramas etiquetadas con IEEE 802.1Q:

```cisco
Switch> enable
Switch# configure terminal

! Puerto que va conectado al router R1 (Gigabit 0/1)
Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

---

## 3. Configuración en el Router (R1): Subinterfaces

En el router, la interfaz física principal se deja encendida **sin dirección IP**, y se crean subinterfaces lógicas asociadas al identificador de cada VLAN:

```cisco
Router> enable
Router# configure terminal

! 1. Encender la interfaz física principal (Sin asignar IP)
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit

! 2. Crear y configurar la subinterfaz para la VLAN 10
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit

! 3. Crear y configurar la subinterfaz para la VLAN 20
Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit
```

> ⚠️ **Importante:** Cada subinterfaz se convierte en la **Puerta de Enlace Predeterminada (Default Gateway)** de los PCs pertenecientes a esa VLAN.
> - PC-1 (VLAN 10): IP `192.168.10.10` / Gateway `192.168.10.1`
> - PC-2 (VLAN 20): IP `192.168.20.10` / Gateway `192.168.20.1`

---

## 4. Rutas Estáticas: Conectar Redes Remotas

Cuando el router necesita enviar paquetes hacia otra red que no está directamente conectada a sus puertos, el administrador debe indicarle el camino de forma manual mediante una **ruta estática**:

```cisco
! Sintaxis: ip route <Red Destino> <Máscara> <IP del Siguiente Salto o Interfaz de Salida>
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.100.2
```

### La Ruta por Defecto (Gateway de Último Recurso)
Representa a "todo el resto de Internet" (`0.0.0.0/0`). Si el router no encuentra una coincidencia más específica en su tabla, enviará el paquete hacia esta dirección:

```cisco
! Cualquier destino desconocido va hacia la IP del proveedor ISP (195.55.10.1)
Router(config)# ip route 0.0.0.0 0.0.0.0 195.55.10.1
```

---

## 5. Comandos de Verificación y Tabla de Enrutamiento

```cisco
! Ver la tabla de enrutamiento completa del router
Router# show ip route

! Salida típica:
! C - Directamente conectada
! S - Ruta estática configurada manualmente
! S* 0.0.0.0/0 [1/0] via 195.55.10.1

! Ver el estado de las subinterfaces
Router# show ip interface brief
```
