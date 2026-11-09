---
title: "Gestión de Procesos y Servicios con Systemd en Linux"
description: "Aprende a monitorizar procesos con ps y htop, enviar señales de control (SIGTERM/SIGKILL) y gestionar demonios y servicios del sistema con systemctl y journalctl."
date: "2026-04-13"
categoria: "sistemas"
subcategoria: "som"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# ⚙️ Gestión de Procesos y Servicios en Linux

Todo lo que se ejecuta en un sistema operativo Linux es un **proceso**. Cada proceso recibe un número identificador único conocido como **PID (Process ID)**. El primer proceso que arranca el kernel es el proceso padre con **`PID 1`**, que en la mayoría de distribuciones modernas es el gestor de inicialización **Systemd**.

---

## 1. Monitorización de Procesos: `ps`, `top` y `htop`

### El comando `ps` (Snapshot estático de procesos)
```bash
# Ver todos los procesos del sistema con formato extendido
ps aux

# Ver la jerarquía en forma de árbol genealógico (padres e hijos)
ps -ef --forest

# Filtrar un proceso específico por nombre
ps aux | grep nginx
```
Columnas clave de `ps aux`:
- **USER:** Usuario propietario del proceso.
- **PID:** Identificador único del proceso.
- **%CPU y %MEM:** Consumo de procesador y memoria RAM.
- **STAT:** Estado del proceso (`R` = Running/Ejecutando, `S` = Sleeping/Dormido, `Z` = Zombie, `T` = Detenido).

### Monitores dinámicos en tiempo real
```bash
# Monitor básico nativo
top

# Monitor avanzado con barras a color, búsqueda y matar procesos con F9 (Recomendado)
sudo apt install htop -y
htop
```

---

## 2. Envío de Señales a Procesos: `kill` y `pkill`

Cuando un proceso se cuelga o necesita reiniciarse, el administrador le envía una **señal del sistema**:

| Señal | Número | Nombre | Efecto |
|---|---|---|---|
| `SIGHUP` | **1** | Hangup | Recarga la configuración del programa sin detener el proceso |
| `SIGINT` | **2** | Interrupt | Interrupción enviada desde el teclado mediante **`Ctrl + C`** |
| `SIGTERM` | **15** | Terminate | **Cierre ordenado y seguro** (por defecto de `kill`). Permite guardar datos |
| `SIGKILL` | **9** | Kill | **Cierre forzado inmediato**. El kernel fulmina el proceso al instante |

```bash
# Enviar cierre seguro por defecto (señal 15) indicando el PID
kill 14502

# Enviar cierre forzoso inmediato (señal 9) si no responde
kill -9 14502

# Terminar procesos directamente por su nombre sin buscar el PID
killall apache2
pkill -f "python3 script.py"
```

---

## 3. Procesos en Segundo Plano (Background)

- Añadir **`&`** al final de un comando para ejecutarlo en segundo plano liberando la terminal:
  ```bash
  tar -czf backup.tar.gz /home/alumnos/ &
  ```
- **`jobs`**: Muestra los trabajos en segundo plano iniciados en la terminal actual.
- **`fg %1`**: Pasa el trabajo número 1 al primer plano (foreground).
- **`bg %1`**: Reanuda en segundo plano un proceso pausado previamente con `Ctrl + Z`.

---

## 4. Gestión de Servicios y Demonios con `systemctl`

**Systemd** es el estándar para gestionar demonios (servicios en segundo plano) mediante archivos de unidad (`.service`):

```bash
# 1. Comprobar si un servicio está activo, fallido o detenido
sudo systemctl status ssh

# 2. Iniciar, detener y reiniciar un servicio
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2

# 3. Recargar la configuración sin interrumpir las conexiones activas
sudo systemctl reload nginx

# 4. Habilitar el servicio para que arranque automáticamente al encender el PC
sudo systemctl enable mariadb

# 5. Deshabilitar el arranque automático
sudo systemctl disable mariadb

# 6. Comprobar si está habilitado en el arranque
systemctl is-enabled mariadb
```

---

## 5. Auditoría de Logs con `journalctl`

Systemd almacena todos los registros del sistema de forma binaria en su journal:

```bash
# Ver los logs en tiempo real de un servicio concreto (como tail -f)
sudo journalctl -u nginx -f

# Ver únicamente los errores y alertas críticas
sudo journalctl -p err..alert

# Ver los logs del arranque actual
sudo journalctl -b
```
