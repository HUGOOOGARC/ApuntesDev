---
title: "Estructura del Árbol de Directorios en Linux (FHS) y Enlaces"
description: "Aprende el estándar de jerarquía del sistema de archivos (FHS), el propósito de cada directorio raíz y la diferencia entre enlaces duros y simbólicos."
date: "2026-04-10"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 📂 Estructura de Directorios en Linux (FHS) y Enlaces

A diferencia de Windows, donde cada disco o partición tiene su propia letra de unidad (`C:\`, `D:\`), en Linux todos los discos, particiones, dispositivos físicos y procesos virtuales cuelgan de una única raíz denominada **`/` (root)**.

Esta estructura está estandarizada por el **FHS (Filesystem Hierarchy Standard)** para garantizar compatibilidad entre distribuciones (Debian, Ubuntu, Red Hat, Arch, etc.).

---

## 1. El Árbol de Directorios Principal

```text
/ (Directorio Raíz)
├── bin      -> Binarios y comandos esenciales de usuario (ls, cp, cat)
├── sbin     -> Binarios de administración del sistema (iptables, fdisk, reboot)
├── etc      -> Archivos de configuración de todo el sistema y servicios
├── home     -> Carpetas personales de los usuarios normales (/home/alumno)
├── root     -> Directorio personal del superusuario (root)
├── var      -> Datos variables que crecen con el tiempo (logs, colas de correo, webs)
├── tmp      -> Archivos temporales (se limpian periódicamente)
├── dev      -> Dispositivos de hardware representados como archivos (/dev/sda, /dev/null)
├── proc     -> Sistema de archivos virtual con información del kernel y procesos
├── sys      -> Información del hardware y controladores en memoria
├── mnt      -> Puntos de montaje manuales y temporales para discos
├── media    -> Puntos de montaje automáticos para unidades extraíbles (USB, CD)
├── opt      -> Software de terceros o paquetes adicionales
└── usr      -> Programas, librerías y documentación compartida de usuarios
```

### Directorios clave que todo técnico debe memorizar:

- **/etc**: Aquí reside la configuración de los servicios. Por ejemplo:
  - `/etc/passwd`: Cuentas de usuario locales.
  - `/etc/shadow`: Contraseñas cifradas de los usuarios.
  - `/etc/group`: Grupos del sistema.
  - `/etc/fstab`: Tabla de montaje de discos automática.
  - `/etc/network/interfaces` o `/etc/netplan/`: Configuración de red.
- **/var/log**: Registros y logs de eventos (`syslog`, `auth.log`, `dmesg`). Imprescindible para troubleshooting y auditoría forense.
- **/dev**: Representa el hardware. Los discos SATA/NVMe aparecen como `/dev/sda`, `/dev/sdb` o `/dev/nvme0n1`.

---

## 2. Rutas Absolutas vs Rutas Relativas

- **Ruta Absoluta:** Comienza siempre desde la raíz (`/`). Es inequívoca y funciona desde cualquier ubicación:
  ```bash
  cd /var/log/nginx/
  cat /etc/hosts
  ```
- **Ruta Relativa:** Se calcula a partir del directorio actual de trabajo (`pwd`):
  ```bash
  # El punto (.) representa el directorio actual
  # Los dos puntos (..) representan el directorio superior (padre)
  cd ../documentos
  ./script.sh
  ```

---

## 3. Enlaces Simbólicos vs Enlaces Duros

En Linux, los archivos se gestionan mediante **inodos** (estructuras que almacenan metadatos y la ubicación de los bloques en disco).

### Enlaces Duros (Hard Links)
- Crean un nuevo nombre que apunta al **mismo inodo** en disco.
- Si eliminas el archivo original, el contenido **sigue existiendo** mientras quede al menos un enlace duro.
- Limitación: No pueden cruzar diferentes particiones ni apuntar a directorios.

```bash
# Crear un enlace duro
ln archivo_original.txt enlace_duro.txt

# Comprobar que comparten el mismo número de inodo (columna izquierda)
ls -i archivo_original.txt enlace_duro.txt
```

### Enlaces Simbólicos (Soft / Symbolic Links)
- Son equivalentes a los "Accesos directos" de Windows.
- Tienen su propio inodo independiente y simplemente guardan como texto la ruta hacia el archivo destino.
- Si borras el archivo original, el enlace queda "roto" (broken link).
- Pueden cruzar particiones y apuntar a directorios.

```bash
# Crear un enlace simbólico con el parámetro -s
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Ver el enlace simbólico y la flecha apuntando al destino
ls -l /etc/nginx/sites-enabled/default
```

---

## 4. Comandos de Inspección del Árbol de Directorios

```bash
# Ver el espacio ocupado en disco por cada partición en formato legible (GB/MB)
df -h

# Analizar cuánto pesa una carpeta concreta
du -sh /var/log

# Árbol visual de carpetas (instalar con sudo apt install tree si no está)
tree -L 2 /etc
```
