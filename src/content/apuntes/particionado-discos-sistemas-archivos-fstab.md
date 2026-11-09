---
title: "Particionado de Discos, Formateo y Montaje Automático en /etc/fstab"
description: "Aprende a particionar discos con MBR y GPT (fdisk/gdisk), formatear en ext4/NTFS, montar sistemas de archivos y configurar el arranque en /etc/fstab."
date: "2026-04-12"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 💾 Particionado de Discos, Formateo y /etc/fstab

La administración del almacenamiento secundario es una competencia nuclear en el currículo de **Sistemas Operativos Monopuestos (SOM)**. Antes de que el sistema operativo pueda almacenar archivos en un disco físico, debe seguirse un flujo de tres fases: **Particionar -> Formatear -> Montar**.

---

## 1. El Ciclo de Vida del Almacenamiento

```text
[ Disco Físico ] ──(Particionar)──> [ Partición ] ──(Formatear)──> [ Sistema de Archivos ] ──(Montar)──> [ Punto de Montaje ]
   /dev/sdb                            /dev/sdb1                         ext4 / NTFS / xfs                   /datos
```

---

## 2. Comparativa: Tablas MBR vs GPT

| Característica | MBR (Master Boot Record) | GPT (GUID Partition Table) |
|---|---|---|
| **Lanzamiento** | Año 1983 (Antiguo / Legacy BIOS) | Estándar moderno (UEFI) |
| **Tamaño Máximo de Disco** | **2 TB** por unidad | Hasta **9.4 ZB** (Zettabytes) |
| **Límite de Particiones** | Máximo 4 particiones primarias (o 3 primarias + 1 extendida) | Hasta **128 particiones** primarias directas |
| **Redundancia** | No tiene copia de respaldo (falla un sector y se pierde la tabla) | Guarda una copia de seguridad al final del disco |
| **Herramienta en Linux** | `fdisk` | `gdisk` o `fdisk` moderno |

---

## 3. Identificación y Particionado con `fdisk`

Para explorar los discos conectados al sistema:

```bash
# Listar todos los bloques y particiones en formato de árbol
lsblk -f

# Ver detalles de tamaño y sectores de todos los discos
sudo fdisk -l
```

### Crear particiones interactivamente en un disco nuevo (`/dev/sdb`):
```bash
sudo fdisk /dev/sdb
```
Comandos dentro de la consola de `fdisk`:
- `m`: Muestra el menú de ayuda con todos los comandos.
- `p`: Muestra la tabla de particiones actual del disco.
- `g`: Inicializa una nueva tabla de particiones en formato **GPT** moderno.
- `n`: Crea una **nueva partición** (te pedirá número, primer sector y tamaño final, ej: `+20G`).
- `t`: Cambia el tipo de partición (ej. Linux filesystem o Linux swap).
- `w`: **Escribe y guarda los cambios en el disco físico** (irreversible).
- `q`: Sale sin guardar ningún cambio.

---

## 4. Formatear la Partición (Crear Sistema de Archivos)

Una partición vacía es solo un rango de sectores contiguos. Debemos formatearla con el comando `mkfs` (Make Filesystem):

```bash
# Formatear en ext4 (Estándar nativo de Linux con journaling)
sudo mkfs.ext4 /dev/sdb1

# Formatear en NTFS (Compatible con Windows)
sudo mkfs.ntfs -f /dev/sdb2

# Formatear en FAT32 (Máxima compatibilidad para memorias USB universales)
sudo mkfs.vfat -F 32 /dev/sdc1
```

---

## 5. Montaje Manual (`mount` y `umount`)

En Linux, no existen letras de unidad. Las particiones se asocian a un directorio vacío denominado **Punto de Montaje**:

```bash
# 1. Crear el directorio de montaje
sudo mkdir -p /mnt/almacen

# 2. Montar la partición en el directorio
sudo mount /dev/sdb1 /mnt/almacen

# 3. Comprobar que está montada y disponible
df -h | grep almacen

# 4. Desmontar la partición (Importante: no debes estar dentro del directorio)
sudo umount /mnt/almacen
```

---

## 6. Montaje Permanente en `/etc/fstab` con UUID

Si reinicias la máquina, los montajes manuales se pierden. Para que el disco se monte automáticamente al encender el equipo, debemos configurarlo en `/etc/fstab`.

> ⚠️ **Regla de Oro:** Nunca uses nombres como `/dev/sdb1` en `fstab` porque si conectas otro disco el orden de las letras puede cambiar. Usa siempre el identificador único **UUID**.

### Paso 1: Averiguar el UUID de la partición
```bash
sudo blkid /dev/sdb1
# Salida: /dev/sdb1: UUID="9a78c1b2-3d4e-4f5a-8b9c-0123456789ab" TYPE="ext4"
```

### Paso 2: Añadir la línea a `/etc/fstab`
Editamos `/etc/fstab` y añadimos al final respetando las 6 columnas:

```text
# <Dispositivo>                              <Punto Montaje>  <Tipo>  <Opciones>  <Dump>  <Pass/Check>
UUID=9a78c1b2-3d4e-4f5a-8b9c-0123456789ab    /mnt/almacen     ext4    defaults    0       2
```

- **defaults:** Aplica las opciones estándar (`rw`, `suid`, `dev`, `exec`, `auto`, `nouser`, `async`).
- **Dump (0):** Desactiva las copias de seguridad de la utilidad dump.
- **Pass (2):** Orden de comprobación del disco en el arranque con `fsck` (1 = partición raíz `/`, 2 = resto de particiones, 0 = no comprobar).

### Paso 3: Probar la configuración sin reiniciar
```bash
# Prueba montar todo lo especificado en fstab. Si hay un error de sintaxis, te avisará aquí
sudo mount -a
```
