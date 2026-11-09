---
title: "Gestión de Permisos en Linux: chmod, chown y Notación Octal"
description: "Aprende el sistema de permisos rwx en Linux, notación simbólica y octal, asignación de propietarios con chown y permisos especiales SUID, SGID y Sticky Bit."
date: "2026-04-07"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🛡️ Gestión de Permisos en Linux: chmod, chown y Notación Octal

En los sistemas operativos basados en Linux/Unix, la seguridad se basa en un modelo estricto de usuarios, grupos y permisos sobre cada archivo y directorio. Comprender este sistema es indispensable para cualquier administrador de sistemas (SOM/SOR).

---

## 1. La Tripleta de Permisos: rwx

Al ejecutar `ls -l` en la terminal, la primera columna muestra los permisos del archivo:

```text
- rwx r-x r-- 1 root alumnos 4096 abr 7 10:00 script.sh
┬ ─── ─── ───
│  │   │   └── Otros / Resto del mundo (Others)
│  │   └────── Grupo propietario (Group)
│  └────────── Usuario propietario (User / Owner)
└───────────── Tipo: '-' = Archivo regular, 'd' = Directorio, 'l' = Enlace simbólico
```

### Significado de cada permiso:

| Permiso | Letra | En Archivos | En Directorios |
|---|---|---|---|
| **Lectura** | `r` (Read) | Permite abrir y ver el contenido del archivo | Permite listar los archivos (`ls`) |
| **Escritura** | `w` (Write) | Permite modificar o guardar cambios | Permite crear, borrar o renombrar archivos dentro |
| **Ejecución** | `x` (Execute) | Permite ejecutarlo como programa/script | Permite acceder o entrar con `cd` |

---

## 2. Notación Numérica Octal (Sistema Binario)

Cada permiso tiene un valor numérico en base 8:

- **Lectura (`r`)**: valor **4**
- **Escritura (`w`)**: valor **2**
- **Ejecución (`x`)**: valor **1**
- **Sin permiso (`-`)**: valor **0**

Sumando los valores de cada grupo de 3 obtenemos un número entre 0 y 7:

| Notación Simbólica | Suma | Valor Octal | Uso común |
|---|---|---|---|
| `rwx` | 4 + 2 + 1 | **7** | Control total (lectura, escritura y ejecución) |
| `rw-` | 4 + 2 + 0 | **6** | Lectura y escritura (archivos normales) |
| `r-x` | 4 + 0 + 1 | **5** | Lectura y ejecución (scripts o carpetas públicas) |
| `r--` | 4 + 0 + 0 | **4** | Solo lectura |
| `---` | 0 + 0 + 0 | **0** | Ningún acceso |

### Ejemplos clásicos de `chmod`:
```bash
# 755: Propietario total (7), Grupo y Otros leen y ejecutan (5) -> Típico de directorios y scripts
chmod 755 /var/www/html

# 644: Propietario lee y escribe (6), Grupo y Otros solo leen (4) -> Típico de archivos de texto o web
chmod 644 /var/www/html/index.html

# 600: Solo el propietario lee y escribe (Claves privadas SSH)
chmod 600 ~/.ssh/id_rsa

# Aplicar permisos de forma recursiva a toda una carpeta (-R)
chmod -R 755 /srv/compartido
```

---

## 3. Cambio de Propietario y Grupo (`chown` y `chgrp`)

Para cambiar a quién pertenece un archivo o carpeta se utiliza el comando `chown` (requiere privilegios de `sudo` o `root`):

```bash
# Cambiar solo el usuario propietario
sudo chown operador script.sh

# Cambiar usuario y grupo a la vez (formato usuario:grupo)
sudo chown www-data:www-data /var/www/html

# Cambiar de forma recursiva a todo el árbol de directorios
sudo chown -R alumno:alumnos /home/alumno/proyectos
```

---

## 4. Permisos Especiales: SUID, SGID y Sticky Bit

| Permiso Especial | Octal | Símbolo | Efecto |
|---|---|---|---|
| **SUID** (Set User ID) | `4xxx` | `s` en usuario | El binario se ejecuta con los privilegios del dueño del archivo (ej. `/usr/bin/passwd`) |
| **SGID** (Set Group ID) | `2xxx` | `s` en grupo | Los nuevos archivos creados en el directorio heredan automáticamente el grupo de la carpeta |
| **Sticky Bit** | `1xxx` | `t` en otros | Solo el dueño del archivo puede borrarlo, aunque todos tengan permiso `w` (ej. carpeta `/tmp`) |

```bash
# Aplicar Sticky Bit a una carpeta compartida
sudo chmod 1777 /tmp/compartido

# Aplicar SGID a una carpeta de equipo de trabajo
sudo chmod 2775 /srv/proyecto-alumnos
```
