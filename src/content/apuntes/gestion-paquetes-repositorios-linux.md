---
title: "Gestión de Paquetes y Repositorios en Linux (APT y DPKG)"
description: "Aprende a instalar, actualizar y purgar software en Debian/Ubuntu con APT y DPKG, gestionar repositorios en sources.list y verificar firmas GPG."
date: "2026-04-11"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 📦 Gestión de Paquetes y Repositorios en Linux

En las distribuciones de la familia **Debian y Ubuntu**, el software se empaqueta en archivos con extensión `.deb`. Para instalarlo de forma segura y resolver dependencias automáticamente, se utiliza el sistema de gestión de paquetes **APT (Advanced Package Tool)** trabajando sobre el motor de bajo nivel **dpkg**.

---

## 1. Arquitectura: APT vs DPKG

```text
[ Usuario / Administrador ]
            │
            ▼
        [ APT ]  <--- Gestiona repositorios remotos y resuelve dependencias automáticamente
            │
            ▼
       [ DPKG ]  <--- Instala, desempaqueta y registra archivos .deb a bajo nivel
            │
            ▼
  [ Sistema de Archivos ]
```

- **APT (Alto Nivel):** Se conecta a servidores remotos (repositorios), descarga el paquete necesario y todas sus librerías dependientes, y las instala en el orden correcto.
- **DPKG (Bajo Nivel):** Instala un archivo `.deb` local que ya tengas descargado en disco, pero **no** busca dependencias en internet por sí solo.

---

## 2. Comandos Fundamentales con APT

```bash
# 1. Actualizar la lista de paquetes disponibles en los repositorios remotos
# (NO instala nada nuevo, solo sincroniza metadatos y versiones)
sudo apt update

# 2. Descargar e instalar las versiones actualizadas de todos los programas del sistema
sudo apt upgrade -y

# 3. Buscar si un programa está en los repositorios
apt search wireshark

# 4. Ver información detallada y dependencias de un paquete antes de instalarlo
apt show nmap

# 5. Instalar un paquete
sudo apt install htop curl git -y

# 6. Eliminar un programa conservando sus archivos de configuración
sudo apt remove apache2

# 7. Desinstalar un programa borrando completamente sus configuraciones (Recomendado)
sudo apt purge apache2 -y

# 8. Limpiar paquetes huérfanos que ya no son necesarios para ninguna aplicación
sudo apt autoremove --purge -y

# 9. Limpiar la caché de instaladores descargados en /var/cache/apt/archives/
sudo apt clean
```

---

## 3. Comandos de Bajo Nivel con DPKG

Cuando descargas un instalador oficial de internet (ej. Google Chrome, VS Code o Packet Tracer) en formato `.deb`:

```bash
# Instalar un paquete .deb local
sudo dpkg -i code_amd64.deb

# Si faltan dependencias tras usar dpkg, corregirlas automáticamente con APT:
sudo apt install -f

# Listar todos los paquetes instalados en el sistema
dpkg -l | grep ssh

# Averiguar a qué paquete pertenece un archivo concreto del sistema
dpkg -S /bin/ls
# Salida: coreutils: /bin/ls

# Listar qué archivos ha instalado un paquete concreto
dpkg -L htop
```

---

## 4. Gestión de Repositorios y Archivo `sources.list`

APT consulta los servidores configurados en `/etc/apt/sources.list` y en los archivos individuales dentro de `/etc/apt/sources.list.d/`.

### Estructura de una línea de repositorio:

```text
deb http://deb.debian.org/debian bookworm main contrib non-free
┬── ──────────────────────────── ──────── ─────────────────────
│                 │                 │               └─ Ramas de software
│                 │                 └───────────────── Versión de la distro
│                 └─────────────────────────────────── URL del servidor espejo (mirror)
└───────────────────────────────────────────────────── Tipo de paquete ('deb' = binario, 'deb-src' = código fuente)
```

- **main:** Software 100% libre según las directrices de Debian (DFSG).
- **contrib:** Software libre que depende de componentes propietarios.
- **non-free / non-free-firmware:** Software privativo (controladores de tarjetas Wi-Fi, microcódigo de CPU).

### Añadir Claves GPG de Seguridad

Para evitar ataques de intermediario (Man-in-the-Middle) o paquetes adulterados, los repositorios firman sus índices criptográficamente. Hoy en día, la recomendación de seguridad oficial es guardar los anillos de claves en `/etc/apt/keyrings/`:

```bash
# Descargar y almacenar la clave GPG segura de un software oficial
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```
