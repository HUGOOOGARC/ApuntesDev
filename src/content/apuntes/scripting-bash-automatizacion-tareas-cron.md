---
title: "Scripting en Bash y Automatización con Tareas Programadas (Cron)"
description: "Aprende a programar scripts en Bash para automatizar copias de seguridad y tareas administrativas, con variables, condicionales y programación con cron."
date: "2026-04-15"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Avanzado"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 📜 Scripting en Bash y Automatización con Cron

El scripting en **Bash** es la habilidad que distingue a un operador manual de un verdadero administrador de sistemas. Permite encadenar comandos, evaluar condiciones lógicas, tratar errores y automatizar procesos recurrentes (como copias de seguridad o rotación de logs) mediante el demonio **Cron**.

---

## 1. Anatomía de un Script en Bash

Todo script ejecutable debe comenzar con la línea **Shebang (`#!/bin/bash`)**, que indica al kernel qué intérprete de comandos debe ejecutar el archivo:

```bash
#!/bin/bash

# Este es un comentario
NOMBRE="Operador"
echo "Bienvenido al sistema, $NOMBRE"
```

### Permisos de Ejecución
Para poder ejecutar el script directamente con `./script.sh`:
```bash
chmod +x script.sh
./script.sh
```

---

## 2. Variables Especiales y Argumentos

Al invocar un script con parámetros (ej: `./script.sh archivo.txt backup/`):

| Variable | Significado |
|---|---|
| `$0` | El nombre del script que se está ejecutando |
| `$1, $2, $3...` | Primer, segundo y tercer argumento pasado por consola |
| `$#` | Número total de argumentos pasados al script |
| `$?` | **Código de salida** del último comando ejecutado (`0` = éxito, diferente de 0 = error) |
| `$$` | PID del proceso del propio script |

---

## 3. Estructuras de Control: Condicionales y Bucles

### Condicionales con `if [ condición ]`
> ⚠️ **Sintaxis Crítica:** Debe haber un espacio obligatorio después de `[` y antes de `]`.

```bash
#!/bin/bash

# Comprobar si se ha pasado al menos un argumento
if [ $# -eq 0 ]; then
    echo "Error: Debes indicar el nombre de un archivo."
    exit 1
fi

ARCHIVO=$1

# Comprobar si el archivo existe (-f)
if [ -f "$ARCHIVO" ]; then
    echo "El archivo $ARCHIVO existe y pesa $(stat -c%s "$ARCHIVO") bytes."
else
    echo "El archivo $ARCHIVO no existe."
fi
```

### Operadores de comparación más usados:
- **Numéricos:** `-eq` (igual), `-ne` (distinto), `-gt` (mayor que), `-lt` (menor que), `-ge` (mayor o igual).
- **Archivos:** `-f` (archivo regular existe), `-d` (directorio existe), `-r` (legible), `-w` (escribible), `-x` (ejecutable).

### Bucle `for` para iterar elementos
```bash
#!/bin/bash

echo "Comprobando conectividad con servidores clave..."
SERVIDORES=("8.8.8.8" "1.1.1.1" "192.168.1.1")

for IP in "${SERVIDORES[@]}"; do
    if ping -c 1 -W 1 "$IP" > /dev/null 2>&1; then
        echo "Servidor $IP: ONLINE ✅"
    else
        echo "Servidor $IP: INALCANZABLE ❌"
    fi
done
```

---

## 4. Script Real: Backup Automatizado con Timestamp

Este script empaqueta una carpeta, añade la fecha y hora al nombre y borra copias con más de 7 días de antigüedad:

```bash
#!/bin/bash

ORIGEN="/var/www/html"
DESTINO="/backups"
FECHA=$(date +"%Y-%m-%d_%H%M%S")
ARCHIVO_BACKUP="$DESTINO/backup_web_$FECHA.tar.gz"

# Crear directorio de backup si no existe
mkdir -p "$DESTINO"

echo "Iniciando copia de seguridad..."
tar -czf "$ARCHIVO_BACKUP" "$ORIGEN" 2> /dev/null

if [ $? -eq 0 ]; then
    echo "Backup generado con éxito: $ARCHIVO_BACKUP"
    # Eliminar backups de más de 7 días
    find "$DESTINO" -name "backup_web_*.tar.gz" -mtime +7 -delete
else
    echo "Fallo crítico al generar el backup!" >&2
    exit 1
fi
```

---

## 5. Automatización de Tareas con Cron (`crontab`)

El demonio **cron** ejecuta comandos automáticamente en segundo plano según un horario preestablecido.

Para editar la tabla de tareas del usuario actual:
```bash
crontab -e
```

### Formato de las 5 columnas temporales:
```text
┌───────────── Minuto (0 - 59)
│ ┌─────────── Hora (0 - 23)
│ │ ┌───────── Día del mes (1 - 31)
│ │ │ ┌─────── Mes (1 - 12)
│ │ │ │ ┌───── Día de la semana (0 - 7, donde 0 y 7 son Domingo)
│ │ │ │ │
* * * * * comando_a_ejecutar
```

### Ejemplos prácticos de crontab:
```text
# Ejecutar el script de backup todos los días a las 03:30 de la madrugada
30 3 * * * /root/scripts/backup.sh >> /var/log/backup.log 2>&1

# Ejecutar una comprobación cada 15 minutos de lunes a viernes
*/15 * * * 1-5 /usr/local/bin/check_servicios.sh

# Reiniciar un servicio el día 1 de cada mes a medianoche
0 0 1 * * systemctl restart apache2
```
