---
title: "Seguridad en Redes Inalámbricas: Wi-Fi 6, WPA2 vs WPA3 y Autenticación RADIUS"
description: "Estándares 802.11 ax/be, vulnerabilidades históricas de WEP/WPA y arquitectura de seguridad empresarial con servidores RADIUS (802.1X)."
date: "2026-11-10"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 📶 Seguridad en Redes Inalámbricas: Wi-Fi 6, WPA2 vs WPA3 y RADIUS

Las redes de área local inalámbricas (**WLAN**) según el estándar **IEEE 802.11** transmiten datos mediante ondas de radiofrecuencia a través del aire. Dado que el medio físico no tiene fronteras delimitadas por paredes, la seguridad criptográfica y la autenticación son de vital importancia.

---

## 1. Evolución de los Estándares Wi-Fi

| Nombre Comercial | Estándar IEEE | Frecuencias Operativas | Ancho de Canal | Velocidad Teórica Máx. |
| :--- | :--- | :--- | :--- | :--- |
| **Wi-Fi 4** | 802.11n | 2.4 GHz y 5 GHz | 20 / 40 MHz | ~600 Mbps |
| **Wi-Fi 5** | 802.11ac | Exclusivo 5 GHz | 20 / 40 / 80 / 160 MHz | ~6.9 Gbps (MU-MIMO) |
| **Wi-Fi 6 / 6E**| 802.11ax | 2.4 GHz, 5 GHz y 6 GHz | Hasta 160 MHz (OFDMA) | ~9.6 Gbps |
| **Wi-Fi 7** | 802.11be | 2.4 GHz, 5 GHz y 6 GHz | Hasta 320 MHz (MLO) | ~46 Gbps |

---

## 2. Comparativa de Protocolos de Seguridad Inalámbrica

```
   [Inseguro / Obsoleto]               [Estándar Actual]              [Máxima Seguridad]
          WEP               --->             WPA2            --->            WPA3
     Cifrado RC4 (Roto)                 Cifrado AES-CCMP               Cifrado GCMP-256
Handshake vulnerable a IVs           4-Way Handshake (KRACK)         Protocolo SAE (Dragonfly)
```

1. **WEP (Wired Equivalent Privacy - 1997):** Totalmente obsoleto y vulnerable. Emplea el algoritmo de flujo RC4 con vectores de inicialización (IV) de 24 bits. Una clave WEP puede romperse en menos de dos minutos capturando paquetes de red.
2. **WPA2 (Wi-Fi Protected Access 2 - 2004):** Estándar que introdujo el cifrado robusto por bloques **AES con CCMP**. Utiliza el intercambio de 4 vías (*4-Way Handshake*). En entornos domésticos (WPA2-Personal / PSK), un atacante que capture el handshake puede intentar ataques de diccionario fuera de línea (*offline dictionary attacks*).
3. **WPA3 (2018):**
   * **Protocolo SAE (*Simultaneous Authentication of Equals* / Dragonfly):** Impide ataques de fuerza bruta offline aunque se use una contraseña sencilla; cada intento requiere interacción con el punto de acceso (AP).
   * **Secreto hacia adelante (*Forward Secrecy*):** Si alguien descifra la contraseña maestra en el futuro, no podrá descifrar el tráfico capturado en el pasado.
   * **Cifrado de 192 bits (Suite B):** Disponible en la versión Enterprise para redes de alta confidencialidad.

---

## 3. WPA-Personal (PSK) vs. WPA-Enterprise (802.1X / RADIUS)

* **Modo Personal (PSK - Pre-Shared Key):** Todos los usuarios y dispositivos comparten la misma contraseña maestra. Inconveniente empresarial: si un empleado deja la empresa, hay que cambiar la contraseña en todos los equipos del edificio.
* **Modo Enterprise (IEEE 802.1X):** Cada usuario tiene sus propias credenciales individuales (nombre de usuario y contraseña o certificado digital). El punto de acceso no valida la clave, sino que delega la autenticación en un servidor centralizado **RADIUS** (*Remote Authentication Dial-In User Service*), como FreeRADIUS o Microsoft Network Policy Server (NPS) conectado a Active Directory.

```
+------------+       EAPOL (802.1X)       +----------------+       RADIUS / UDP 1812       +---------------+
|  Cliente   |  <=====================>  | Punto Acceso   |  <===========================> | Servidor      |
|  (Suplic.) |                           | (Autenticador) |                                | RADIUS / AD   |
+------------+                           +----------------+                                +---------------+
```

---

## 4. Buenas Prácticas para Redes Wi-Fi Corporativas

1. **Aislamiento de Clientes (*AP Client Isolation*):** Impide que dos dispositivos conectados a la misma red Wi-Fi puedan comunicarse entre sí, evitando escaneos de red o ataques de intermediario (Man-in-the-Middle / ARP Spoofing).
2. **Segmentación por VLAN:** Separar mediante SSIDs distintos la red de empleados (VLAN 10), la red de invitados (VLAN 20 sin acceso a la intranet) y los dispositivos IoT/impresoras (VLAN 30).
3. **Desactivar WPS (*Wi-Fi Protected Setup*):** El PIN de 8 dígitos de WPS contiene vulnerabilidades de diseño por fuerza bruta (herramientas como Reaver). Debe estar siempre deshabilitado en entornos profesionales.
