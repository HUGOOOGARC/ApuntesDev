---
title: "Virtualización: Hipervisores Tipo 1 vs Tipo 2 y Contenedores Docker"
description: "Comprende la diferencia entre virtualización completa por hardware y contenedores ligeros. Tipos de hipervisores y primeros pasos con Docker."
date: "2026-11-10"
categoria: "sistemas"
subcategoria: "sor"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 📦 Virtualización: Hipervisores Tipo 1 vs Tipo 2 y Contenedores Docker

La virtualización es la tecnología angular sobre la que se asientan los centros de datos modernos, el Cloud Computing y los laboratorios de administración de sistemas (SMR/ASIR). Permite ejecutar múltiples entornos aislados sobre una única máquina física.

---

## 1. Tipos de Hipervisores (Hypervisors / VMM)

El **hipervisor** o monitor de máquina virtual (*VMM*) es la capa de software o firmware encargada de crear, gestionar y asignar recursos de hardware (CPU, RAM, disco y red) a las máquinas virtuales invitadas (*guests*).

| Característica | Hipervisor Tipo 1 (*Bare-Metal*) | Hipervisor Tipo 2 (*Hosted*) |
| :--- | :--- | :--- |
| **Instalación** | Directamente sobre el hardware físico (sin SO anfitrión). | Como una aplicación dentro de un Sistema Operativo previo (Windows/Linux/macOS). |
| **Rendimiento** | Máximo rendimiento y latencia mínima de E/S. | Ligera pérdida de rendimiento por la sobrecarga del SO anfitrión. |
| **Uso Principal** | Servidores de producción, centros de datos empresariales. | Estaciones de trabajo de técnicos, entornos de pruebas y docencia. |
| **Ejemplos Reales** | **Proxmox VE (KVM)**, **VMware ESXi**, **Microsoft Hyper-V Server**, **Xen**. | **VirtualBox**, **VMware Workstation / Fusion**, **KVM con interfaz virt-manager**. |

---

## 2. Máquinas Virtuales vs. Contenedores (Docker)

La diferencia fundamental radica en qué capa del sistema se abstrae y comparte:

```
+---------------------------+       +---------------------------+
|      Máquinas Virtuales    |       |    Contenedores Docker    |
+---------------------------+       +---------------------------+
| App A     | App B         |       | App A     | App B         |
| Bins/Libs | Bins/Libs     |       | Bins/Libs | Bins/Libs     |
| Guest OS  | Guest OS      |       +-----------+---------------+
+-----------+---------------+       |     Motor Docker (Daemon)  |
|         Hipervisor        |       +---------------------------+
+---------------------------+       |       Kernel Linux Único  |
|      Hardware Físico      |       +---------------------------+
|                           |       |      Hardware Físico      |
+---------------------------+       +---------------------------+
```

1. **Máquinas Virtuales (VM):** Cada máquina virtual incluye una copia completa de un sistema operativo invitado (*Guest OS*), su propio kernel virtualizado, controladores y memoria RAM asignada fija. Proporcionan un aislamiento total de seguridad.
2. **Contenedores (Docker / Podman):** No virtualizan el hardware ni cargan un nuevo kernel. Comparten directamente el **kernel del sistema anfitrión** utilizando tecnologías nativas de Linux (*cgroups* para limitar CPU/RAM y *namespaces* para aislar procesos, red y usuarios). Arrancan en milisegundos y pesan megabytes en lugar de gigabytes.

---

## 3. Comandos Esenciales de Docker para el Administrador

Para gestionar servicios contenerizados en Linux mediante Docker CLI:

```bash
# 1. Comprobar el estado del demonio de Docker
sudo systemctl status docker

# 2. Descargar y arrancar un contenedor web Nginx en segundo plano (puerto 8080 local -> 80 contenedor)
docker run -d --name mi-servidor-web -p 8080:80 nginx:alpine

# 3. Listar contenedores en ejecución
docker ps

# 4. Listar TODOS los contenedores (incluidos los detenidos)
docker ps -a

# 5. Ver el consumo en tiempo real de CPU y memoria de cada contenedor
docker stats

# 6. Entrar a una terminal interactiva dentro del contenedor en ejecución
docker exec -it mi-servidor-web /bin/sh

# 7. Detener y eliminar un contenedor
docker stop mi-servidor-web
docker rm mi-servidor-web
```

---

## 4. Docker Compose: Orquestación de Múltiples Servicios

En entornos reales se utiliza **Docker Compose** para definir infraestructuras multicontenedor (ejemplo: Servidor Web + Base de Datos PostgreSQL) en un único archivo declarativo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    restart: always

  basedatos:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: laboratorio_smr
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: PasswordSuperSegura123
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Para levantar toda la infraestructura descrita con un solo comando:
```bash
docker compose up -d
```
