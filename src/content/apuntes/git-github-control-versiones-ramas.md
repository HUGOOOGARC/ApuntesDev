---
title: "Control de Versiones Profesional con Git y GitHub: Ramas, Merges y Conflictos"
description: "Aprende el flujo de trabajo moderno con Git: estados de archivos, comandos esenciales, ramificación de características y resolución de conflictos."
date: "2026-11-10"
categoria: "programacion"
subcategoria: "frontend"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🐙 Control de Versiones Profesional con Git y GitHub

**Git** es un sistema de control de versiones distribuido diseñado por Linus Torvalds en 2005 para el desarrollo del kernel Linux. Permite rastrear cada cambio en el código fuente, revertir errores históricos y colaborar en equipo mediante ramas paralelas sin pisar el trabajo de otros desarrolladores.

---

## 1. El Ciclo de Vida de los Estados en Git

Git clasifica los archivos en tres áreas principales de trabajo:

```
  Directorio de Trabajo        Área de Preparación             Repositorio Local
    (Working Directory)        (Staging Area / Index)            (.git history)
  +--------------------+       +--------------------+       +--------------------+
  | Archivos editados  |  ==>  | Archivos listos    |  ==>  | Snapshot permanente|
  | en VS Code         |       | para el commit     |       | con hash SHA-1     |
  +--------------------+       +--------------------+       +--------------------+
        |                            ^                            ^
        |------- git add . ----------|                            |
        |                                                         |
        |------------------- git commit -m "..." -----------------|
```

* **Modificado (*Modified*):** Has cambiado un archivo en tu editor, pero aún no está preparado para guardarse en la historia.
* **Preparado (*Staged*):** Has marcado un archivo modificado con `git add` para incluirlo en la próxima captura (*snapshot*).
* **Confirmado (*Committed*):** Los datos están almacenados de forma segura e inmutable en tu base de datos local de `.git`.

---

## 2. Comandos Diarios Esenciales

```bash
# 1. Iniciar un nuevo repositorio en la carpeta actual
git init

# 2. Configurar identidad global
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"

# 3. Ver el estado de los archivos y ramas
git status

# 4. Añadir cambios al área de preparación (Staging)
git add archivo.py     # Añadir un archivo concreto
git add .              # Añadir todos los cambios de la carpeta

# 5. Crear una instantánea permanente con mensaje descriptivo
git commit -m "feat: implementar autenticación mediante JWT"

# 6. Ver el historial cronológico de commits
git log --oneline --graph --all
```

---

## 3. Trabajo con Ramas (*Branching Strategy*)

Las ramas permiten desarrollar nuevas funcionalidades (*features*) o probar correcciones (*bugfixes*) en un entorno aislado sin comprometer la rama principal (`main`):

```bash
# Crear y cambiar inmediatamente a una nueva rama
git checkout -b feature/login-google
# (En versiones modernas de Git también: git switch -c feature/login-google)

# Listar todas las ramas locales
git branch

# Volver a la rama principal
git checkout main

# Fusionar los cambios de la rama secundaria en la rama actual
git merge feature/login-google

# Eliminar la rama una vez fusionada
git branch -d feature/login-google
```

---

## 4. Resolución de Conflictos de Fusión (*Merge Conflicts*)

Un conflicto ocurre cuando dos desarrolladores modifican **las mismas líneas** de un mismo archivo en diferentes ramas y Git no puede deducir automáticamente cuál tiene la prioridad:

```text
<<<<<<< HEAD (Rama actual: main)
const API_URL = "https://api.apuntesdev.com/v1";
=======
const API_URL = "https://api.apuntesdev.com/v2-beta";
>>>>>>> feature/nueva-api
```

### Pasos para solucionarlo:
1. Abre el archivo en VS Code y decide qué código conservar (puedes pulsar en *"Accept Current Change"*, *"Accept Incoming Change"* o editar el código manualmente).
2. Borra los delimitadores `<<<<<<<`, `=======` y `>>>>>>>`.
3. Guarda el archivo, añade el cambio resuelto con `git add <archivo>` y finaliza la fusión con `git commit -m "fix: resolver conflicto en API_URL"`.

---

## 5. Sincronización con Repositorios Remotos (GitHub / GitLab)

```bash
# Vincular el repositorio local con un repositorio en la nube
git remote add origin https://github.com/usuario/mi-proyecto.git

# Enviar los cambios por primera vez y vincular la rama
git push -u origin main

# Descargar y fusionar los últimos cambios del equipo remoto
git pull origin main
```
