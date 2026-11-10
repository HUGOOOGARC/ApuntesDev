---
title: "Copias de Seguridad, Niveles de RAID y Sincronización con Rsync"
description: "Aprende la regla de oro 3-2-1 del backup, diferencias entre copias completas, diferenciales e incrementales, niveles de RAID y automatización con rsync."
date: "2026-11-10"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🛡️ Copias de Seguridad, Niveles de RAID y Sincronización con Rsync

La pérdida de datos es uno de los mayores riesgos para cualquier organización. Como técnico informático, dominar el diseño de estrategias de respaldo y la tolerancia a fallos en el almacenamiento es una competencia crítica.

---

## 1. La Regla de Oro del Backup: Estrategia 3-2-1

Es el estándar de la industria para asegurar la supervivencia de la información frente a desastres físicos, ransomware o errores humanos:

* **3 Copias:** Mantener siempre al menos tres copias de los datos importantes (los datos originales en producción + 2 copias de respaldo).
* **2 Medios distintos:** Almacenar las copias en al menos dos tipos de soportes físicos diferentes (ejemplo: disco local NVMe y un servidor NAS de red o cinta/disco externo).
* **1 Copia Fuera de la Sede (*Off-site*):** Conservar al menos una de las copias en una ubicación física remota (ejemplo: almacenamiento Cloud cifrado en la nube o en otro edificio de la empresa).

---

## 2. Tipos de Copias de Seguridad

| Tipo | ¿Qué datos copia? | Tiempo de Backup | Espacio Requerido | Tiempo de Restauración |
| :--- | :--- | :--- | :--- | :--- |
| **Completa (*Full*)** | Todos los archivos seleccionados sin excepción. | Alto | Muy Alto | Muy Rápido (un solo paso). |
| **Diferencial** | Archivos modificados desde el **último backup completo**. | Medio | Moderado | Rápido (Full + Última Diferencial). |
| **Incremental** | Archivos modificados desde el **último backup (sea full o incremental)**. | Muy Rápido | Muy Bajo | Más Lento (Full + todas las incrementales en orden). |

---

## 3. Niveles de RAID (Redundant Array of Independent Disks)

El RAID combina varios discos duros físicos en una unidad lógica para mejorar el rendimiento, la redundancia o ambos. **¡Importante! RAID NO sustituye a un backup:** el borrado accidental o un ataque de ransomware afecta a todos los discos del RAID simultáneamente.

* **RAID 0 (Stripping / Distribución):**
  * *Requisitos:* Mínimo 2 discos.
  * *Ventaja:* Duplica la velocidad de lectura y escritura. Capacidad útil = 100% de la suma.
  * *Desventaja:* **Cero tolerancia a fallos**. Si falla un solo disco, se pierde la totalidad de los datos.
* **RAID 1 (Mirroring / Espejo):**
  * *Requisitos:* Mínimo 2 discos.
  * *Ventaja:* Copia idéntica en tiempo real. Si un disco muere, el sistema sigue funcionando sin interrupciones.
  * *Capacidad Útil:* 50% de la suma total (tamaño del disco más pequeño).
* **RAID 5 (Distribución con Paridad distribuida):**
  * *Requisitos:* Mínimo 3 discos.
  * *Ventaja:* Tolera el fallo de **1 disco**. Buen equilibrio entre velocidad, espacio y seguridad.
  * *Capacidad Útil:* `(N - 1) * Capacidad`. Se pierde el equivalente a 1 disco para datos de paridad.
* **RAID 10 (1+0 - Espejo de Conjuntos en Distribución):**
  * *Requisitos:* Mínimo 4 discos.
  * *Ventaja:* Máxima velocidad y alta tolerancia a fallos (tolera la caída de hasta 1 disco por pareja en espejo). Muy utilizado en servidores de bases de datos.

---

## 4. Automatización de Backups con Rsync en Linux

`rsync` (*Remote Sync*) es el comando definitivo de consola para copias de seguridad eficientes gracias a su algoritmo de transferencia diferencial (solo transmite los bloques de datos modificados).

```bash
# 1. Copia local idéntica con preservación de permisos, propietarios y enlaces
# -a (archive): preserva permisos, fechas, propietarios
# -v (verbose): muestra progreso en consola
# -z (compress): comprime datos durante la transferencia
# -h (human-readable): tamaños legibles en MB/GB
# --delete: borra en el destino los archivos que hayan sido eliminados en el origen
rsync -avzh --delete /home/usuario/documentos/ /media/backup_externo/documentos/

# 2. Sincronización remota a través de túnel SSH seguro
rsync -avz -e ssh /var/www/html/ backupuser@192.168.1.50:/srv/backups/web/

# 3. Simulación de ejecución (Dry-Run) para verificar sin modificar nada
rsync -avzh --dry-run /datos/ /backup/
```
