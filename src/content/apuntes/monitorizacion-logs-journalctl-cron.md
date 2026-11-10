---
title: "Monitorización de Logs en Linux: Journalctl, Syslog y Detección de Amenazas"
description: "Aprende a inspeccionar registros del sistema con systemd journalctl, auditar intentos de acceso en auth.log y detectar ataques de fuerza bruta."
date: "2026-11-10"
categoria: "sistemas"
subcategoria: "sor"
dificultad: "Avanzado"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🔍 Monitorización de Logs en Linux: Journalctl, Syslog y Detección de Amenazas

En la administración de servidores Linux (Debian, Ubuntu, Red Hat), los archivos de registro o **logs** son la fuente principal de verdad para diagnosticar fallos de arranque, caídas de servicios y auditoría forense ante incidentes de ciberseguridad.

---

## 1. El Sistema Tradicional de Logs (`/var/log`)

En las distribuciones Linux tradicionales administradas por `rsyslog`, los registros se guardan en texto plano en el directorio `/var/log`:

* **`/var/log/auth.log` (Debian/Ubuntu) o `/var/log/secure` (RHEL/CentOS):** Registra todos los intentos de autenticación en el sistema (inicios de sesión SSH, elevaciones con `sudo`, contraseñas erróneas).
* **`/var/log/syslog` o `/var/log/messages`:** Registro global de mensajes informativos, advertencias y fallos del kernel y servicios del sistema.
* **`/var/log/dmesg`:** Mensajes emitidos por el kernel durante la secuencia de arranque del hardware físico (detección de CPU, RAM, controladoras SATA/NVMe).
* **`/var/log/nginx/` o `/var/log/apache2/`:** Registros de accesos (`access.log`) y errores (`error.log`) de servidores web.

---

## 2. Dominando `journalctl` (Systemd Journal)

Con la llegada de **systemd**, los logs se capturan en un formato binario estructurado y de alto rendimiento gestionado por el servicio `systemd-journald`. Se consultan mediante la herramienta `journalctl`:

```bash
# 1. Ver los logs en tiempo real siguiendo nuevas entradas (equivalente a tail -f)
journalctl -f

# 2. Filtrar logs exclusivamente del arranque actual del sistema
journalctl -b

# 3. Filtrar los logs de un servicio específico (ej: servidor web Nginx o SSH)
journalctl -u nginx.service
journalctl -u ssh.service

# 4. Filtrar por nivel de prioridad o severidad
# Niveles: emerg(0), alert(1), crit(2), err(3), warning(4), notice(5), info(6), debug(7)
journalctl -p err -b

# 5. Filtrar por rango temporal específico
journalctl --since "2026-11-10 08:00:00" --until "2026-11-10 12:00:00"
journalctl --since "1 hour ago"

# 6. Comprobar cuánto espacio en disco ocupan los logs y limpiarlos
journalctl --disk-usage
sudo journalctl --vacuum-size=200M   # Retener como máximo 200MB de logs
sudo journalctl --vacuum-time=14d    # Retener logs de los últimos 14 días
```

---

## 3. Auditoría de Ciberseguridad: Detección de Ataques de Fuerza Bruta SSH

Un servidor expuesto a Internet en el puerto 22 recibe miles de intentos automatizados de intrusión mediante diccionarios de contraseñas. Con estos comandos puedes auditar intentos sospechosos:

```bash
# Contar intentos fallidos de login SSH y mostrar las IPs atacantes
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -10

# Ver qué usuarios del sistema han utilizado el comando 'sudo' recientemente
sudo grep -i "sudo:" /var/log/auth.log | grep -i "COMMAND"
```

---

## 4. Rotación de Logs con `logrotate`

Para evitar que los archivos de log crezcan indefinidamente hasta colapsar el almacenamiento del disco, Linux utiliza la utilidad **`logrotate`** (configurada en `/etc/logrotate.conf` y `/etc/logrotate.d/`).

Ejemplo de directiva de rotación:
```text
/var/log/servidor_custom/*.log {
    weekly          # Rotar cada semana
    rotate 4        # Mantener solo los últimos 4 archivos comprimidos
    compress        # Comprimir logs antiguos en formato gzip (.gz)
    missingok       # No arrojar error si el archivo no existe
    notifempty      # No rotar si el archivo está vacío
    create 0640 root adm
}
```
