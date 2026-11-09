---
title: "Comandos Básicos de Linux en la Terminal"
description: "Aprende a moverte por la terminal, gestionar archivos y controlar procesos en sistemas Linux."
date: "2026-03-30"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🖥️ Comandos Básicos de Linux en la Terminal

La terminal es la herramienta fundamental en cualquier sistema operativo en red o monopuesto basado en Unix/Linux. Aquí tienes los comandos esenciales que todo técnico en SMR debe dominar.

## 1. Navegación por Directorios

Para moverte por el sistema de archivos de Linux utilizamos los siguientes comandos:

- **`pwd`** (*Print Working Directory*): Muestra la ruta absoluta del directorio actual en el que te encuentras.
- **`ls`**: Lista los archivos y carpetas del directorio actual.
  * `ls -l`: Muestra una lista detallada (permisos, propietario, tamaño, fecha).
  * `ls -la`: Muestra también los archivos ocultos (los que empiezan por punto).
- **`cd [directorio]`**: Cambia de directorio.
  * `cd ..`: Sube un nivel en la jerarquía de carpetas.
  * `cd ~`: Te devuelve al directorio personal (*Home*).

---

## 2. Gestión de Archivos y Directorios

- **`mkdir [nombre]`**: Crea una nueva carpeta o directorio.
- **`touch [archivo]`**: Crea un archivo vacío o actualiza su fecha de modificación.
- **`cp [origen] [destino]`**: Copia archivos o carpetas.
- **`mv [origen] [destino]`**: Mueve o renombra archivos y carpetas.
- **`rm [archivo]`**: Elimina un archivo. (Usa `rm -r` para carpetas completas).