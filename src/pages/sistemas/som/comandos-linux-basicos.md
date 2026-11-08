---
layout: ../../../layouts/Layout.astro
title: "Comandos Básicos de Linux (SOM)"
description: "Aprende a moverte por la terminal, gestionar archivos y controlar procesos en sistemas Linux."
date: "2026-03-30"
---

# 🖥️ Comandos Básicos de Linux en la Terminal

La terminal es la herramienta fundamental en cualquier sistema operativo en red o monopuesto basado en Unix/Linux. Aquí tienes los comandos esenciales que todo técnico en SMR debe dominar.

## 1. Navegación por Directorios

Para moverte por el sistema de archivos de Linux utilizamos los siguientes comandos:

* **`pwd`** (*Print Working Directory*): Muestra la ruta absoluta del directorio actual en el que te encuentras.
* **`ls`**: Lista los archivos y carpetas del directorio actual.
  * `ls -l`: Muestra una lista detallada (permisos, propietario, tamaño, fecha).
  * `ls -la`: Muestra también los archivos ocultos (los que empiezan por punto).
* **`cd [directorio]`**: Cambia de directorio.
  * `cd ..`: Sube un nivel en la jerarquía de carpetas.
  * `cd ~`: Te devuelve al directorio personal (*Home*).

---

## 2. Gestión de Archivos y Directorios

* **`mkdir [nombre]`**: Crea una nueva carpeta o directorio.
* **`touch [archivo]`**: Crea un archivo vacío o actualiza su fecha de modificación.
* **`cp [origen] [destino]`**: Copia archivos o carpetas.
* **`mv [origen] [destino]`**: Mueve o renombra archivos y carpetas.
* **`rm [archivo]`**: Elimina un archivo. (Usa `rm -r` para carpetas completas).

---

## 💡 Pon a prueba lo aprendido

<div style="text-align: center; margin: 3rem 0;">
  <button id="btn-completar-apunte" class="btn-completar" onclick="completarEstudio()">
    ✨ ¡Completar Apunte (+50 XP y +10 🪙)!
  </button>
</div>

<script>
  import { completarApunte, perfilStore } from '../../../store/progreso';

  window.addEventListener('DOMContentLoaded', async () => {
    const idApunte = 'som-comandos-linux';
    const perfil = perfilStore.get();
    const btn = document.getElementById('btn-completar-apunte');

    if (perfil.apuntesCompletados.includes(idApunte)) {
      btn.textContent = '✅ Apunte Completado (Dominado)';
      btn.classList.add('dominado');
      btn.disabled = true;
    }
  });

  window.completarEstudio = async () => {
    const idApunte = 'som-comandos-linux';
    const completado = await completarApunte(idApunte, 50, 10);
    const btn = document.getElementById('btn-completar-apunte');

    if (completado) {
      btn.textContent = '🎉 ¡Ganado! (+50 XP)';
      btn.classList.add('dominado');
      btn.disabled = true;
      alert('¡Has ganado 50 XP y 10 Monedas por completar este apunte!');
    }
  };
</script>