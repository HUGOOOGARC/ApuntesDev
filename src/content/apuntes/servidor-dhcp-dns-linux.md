---
title: "Configuración de Servidor DHCP y DNS en Linux (Debian / Ubuntu)"
description: "Aprende a desplegar y configurar isc-dhcp-server y Bind9 para asignación automática de parámetros de red y resolución de nombres."
date: "2026-04-03"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🛰️ Configuración de Servidores DHCP y DNS en Linux

En una red local corporativa o de aula, la gestión automática del direccionamiento IP y la resolución de nombres de dominio son dos de los servicios de infraestructura más críticos.

---

## 1. El Proceso DORA en DHCP

El protocolo **DHCP (Dynamic Host Configuration Protocol)** utiliza el puerto UDP `67` en el servidor y `68` en el cliente. Sigue un intercambio de 4 fases conocido como **DORA**:

1. **Discover (Broadcast):** El cliente busca un servidor DHCP en la red (`0.0.0.0:68` -> `255.255.255.255:67`).
2. **Offer (Unicast o Broadcast):** El servidor ofrece una IP con sus opciones de configuración.
3. **Request (Broadcast):** El cliente acepta formalmente la oferta elegida.
4. **Acknowledge (Unicast o Broadcast):** El servidor confirma el arrendamiento (*lease*) y activa los parámetros.

---

## 2. Instalación y Configuración de ISC-DHCP-Server

### Paso 1: Instalación del paquete
```bash
sudo apt update
sudo apt install isc-dhcp-server -y
```

### Paso 2: Definir la interfaz de escucha
Editamos `/etc/default/isc-dhcp-server` para especificar la tarjeta de red (por ejemplo, `eth0` o `enp0s3`):

```bash
INTERFACESv4="enp0s3"
```

### Paso 3: Configurar el archivo `dhcpd.conf`
Abrimos `/etc/dhcp/dhcpd.conf` y añadimos el bloque de la subred:

```text
# Subred 192.168.1.0/24 con rango dinámico y opciones
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.50 192.168.1.150;
    option routers 192.168.1.1;
    option domain-name-servers 192.168.1.10, 8.8.8.8;
    option domain-name "empresa.local";
    default-lease-time 86400;     # 24 horas
    max-lease-time 172800;        # 48 horas
}

# Reserva estática por MAC (IP fija para una impresora)
host impresora-laser {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.1.200;
}
```

### Paso 4: Validar sintaxis y reiniciar
```bash
# Validar errores antes de reiniciar
sudo dhcpd -t

# Reiniciar el servicio
sudo systemctl restart isc-dhcp-server
sudo systemctl status isc-dhcp-server
```

---

## 3. Servidor DNS con BIND9 (Resolución de Zona Directa)

### Instalación
```bash
sudo apt install bind9 bind9utils dnsutils -y
```

### Declaración de la zona en `/etc/bind/named.conf.local`:
```text
zone "empresa.local" {
    type master;
    file "/etc/bind/db.empresa.local";
};
```

### Archivo de Zona `/etc/bind/db.empresa.local`:
```text
$TTL    604800
@       IN      SOA     ns1.empresa.local. admin.empresa.local. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
; Servidores de nombres (NS)
@       IN      NS      ns1.empresa.local.

; Registros A (Nombre a IP)
ns1     IN      A       192.168.1.10
servidor IN     A       192.168.1.10
router  IN      A       192.168.1.1

; Alias (CNAME)
www     IN      CNAME   servidor.empresa.local.
```

Comprobamos y reiniciamos BIND9:
```bash
named-checkconf
named-checkzone empresa.local /etc/bind/db.empresa.local
sudo systemctl restart bind9
```

---

## 4. Pruebas de Diagnóstico desde el Cliente

Para verificar que el cliente obtiene IP y resuelve nombres:

```bash
# Renovar IP por DHCP en Linux
sudo dhclient -r
sudo dhclient -v

# Probar resolución DNS con dig o nslookup
dig @192.168.1.10 www.empresa.local
nslookup servidor.empresa.local
```
