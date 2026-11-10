---
title: "Listas de Control de Acceso (ACLs) en Routers Cisco: Estándar y Extendidas"
description: "Domina el filtrado de paquetes en capa de red y transporte con routers Cisco IOS. Configuración de ACLs estándar y extendidas numeradas y con nombre."
date: "2026-11-10"
categoria: "redes"
subcategoria: "routing-switching"
dificultad: "Avanzado"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🛑 Listas de Control de Acceso (ACLs) en Routers Cisco

Una **Lista de Control de Acceso (ACL)** es un conjunto secuencial de directivas o reglas que un router Cisco aplica al tráfico entrante o saliente por sus interfaces físicas para permitir (*permit*) o denegar (*deny*) el paso de paquetes de red.

---

## 1. Tipos de ACLs en Cisco IOS

```
                            +-------------------------------+
                            |   Listas de Control de Acceso |
                            +---------------+---------------+
                                            |
                    +-----------------------+-----------------------+
                    |                                               |
        +-----------v-----------+                       +-----------v-----------+
        |     ACLs Estándar     |                       |    ACLs Extendidas    |
        +-----------------------+                       +-----------------------+
        | • Rango: 1 - 99       |                       | • Rango: 100 - 199    |
        | • Solo IP Origen      |                       | • IP Origen y Destino |
        | • Ubicación: Cerca    |                       | • Protocolo y Puertos |
        |   del DESTINO         |                       | • Cerca del ORIGEN    |
        +-----------------------+                       +-----------------------+
```

### Reglas de Oro del Procesamiento de ACLs:
1. **Evaluación Secuencial:** El router procesa las líneas en estricto orden de arriba a abajo (Línea 10, Línea 20...). En cuanto un paquete coincide con una regla, se ejecuta la acción (*permit* o *deny*) y **se detiene la evaluación**.
2. **Denegación Implícita Final (*Implicit Deny All*):** Al final de **toda** lista de acceso existe una regla invisible no escrita que deniega todo el tráfico no permitido explícitamente (`deny ip any any`). Si no incluyes al menos un `permit`, todo el tráfico morirá en la interfaz.

---

## 2. Máscara Wildcard (Máscara Inversa)

Las ACLs no utilizan la máscara de subred convencional, sino la **máscara wildcard**. Los bits a `0` indican que el bit de la IP debe coincidir exactamente, mientras que los bits a `1` son ignorados ("no me importa"):

* Máscara `/24` (255.255.255.0) $\rightarrow$ Wildcard: **`0.0.0.255`**
* Máscara `/26` (255.255.255.192) $\rightarrow$ Wildcard: **`0.0.0.63`**
* Un único host exacto (255.255.255.255) $\rightarrow$ Wildcard: **`0.0.0.0`** (o palabra clave `host`).
* Cualquier dirección IP (0.0.0.0 255.255.255.255) $\rightarrow$ Palabra clave **`any`**.

---

## 3. Configuración de una ACL Estándar

*Caso práctico:* Bloquear al host `192.168.10.50` para que no acceda a la red de contabilidad, permitiendo al resto de su subred:

```bash
Router# configure terminal

! Crear la ACL estándar número 10
Router(config)# access-list 10 deny host 192.168.10.50
Router(config)# access-list 10 permit 192.168.10.0 0.0.0.255

! Aplicar la ACL a la interfaz de salida hacia contabilidad
Router(config)# interface GigabitEthernet0/0/1
Router(config-if)# ip access-group 10 out
Router(config-if)# exit
```

---

## 4. Configuración de una ACL Extendida con Nombre

Las ACLs extendidas permiten un filtrado quirúrgico: podemos especificar el protocolo de capa 4 (TCP, UDP, ICMP) y el puerto de destino (ej: HTTP 80, HTTPS 443, DNS 53, SSH 22).

*Caso práctico:* Permitir que la subred de desarrollo (`10.0.0.0/24`) solo pueda navegar por la web (puertos 80 y 443) y hacer consultas DNS (puerto 53), bloqueando todo el resto:

```bash
Router# configure terminal

! Crear ACL extendida con nombre descriptivo
Router(config)# ip access-list extended FILTRADO_DESARROLLO

! Permitir navegación Web HTTP (80) y HTTPS (443)
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 any eq 443

! Permitir consultas DNS por UDP
Router(config-ext-nacl)# permit udp 10.0.0.0 0.0.0.255 any eq 53

! Denegar explícitamente y registrar en log cualquier intento de ping ICMP
Router(config-ext-nacl)# deny icmp 10.0.0.0 0.0.0.255 any log

! La regla implícita deny ip any any bloquea todo lo demás automáticamente
Router(config-ext-nacl)# exit

! Aplicar lo más cerca posible del ORIGEN en sentido de entrada (IN)
Router(config)# interface GigabitEthernet0/0/0
Router(config-if)# ip access-group FILTRADO_DESARROLLO in
Router(config-if)# end
```

---

## 5. Comandos de Verificación y Diagnóstico

```bash
! Ver las ACLs configuradas y el contador de paquetes que han coincidido (matches)
Router# show access-lists

! Ver en qué interfaces está aplicada una lista y en qué dirección
Router# show ip interface GigabitEthernet0/0/0 | include access list
```
