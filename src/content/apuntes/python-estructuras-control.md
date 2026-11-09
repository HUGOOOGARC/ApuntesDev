---
title: "Masterclass: Estructuras de Control, If, While y For en Python"
description: "Guía definitiva de nivel experto con un script unificado que integra condiciones, bucles while y for para programación backend."
date: "2026-03-30"
categoria: "programacion"
subcategoria: "backend"
dificultad: "Masterclass"
xp_recompensa: 100
monedas_recompensa: 25
draft: false
---

<div class="masterclass-badge">⚡ CURSO OFICIAL DE BACKEND — NIVEL SMR</div>

# Script Unificado: If, While y For en Python

En la programación backend y la administración de sistemas, los scripts inteligentes combinan la toma de decisiones lógicas (`if`) con bucles condicionales (`while`) y recorridos secuenciales (`for`). 

A continuación, tienes un script integral que une todas estas estructuras en un flujo de trabajo profesional.

---

## 💻 Script Integral de Backend (Ejemplo Unificado)

Este script simula el arranque y monitorización de un clúster de servicios utilizando de forma combinada **condicionales**, **while** y **for**:

```python
# Script integral de backend: Monitor de servicios y control de accesos
def monitor_sistema():
    servicios = ["SSH", "HTTP", "DNS", "DHCP", "FTP"]
    intentos_maximos = 3
    sistema_bloqueado = False

    print("=== INICIANDO MONITOR BACKEND ===")

    # 1. Condicional de seguridad inicial (if / else)
    if sistema_bloqueado:
        print("⛔ Alerta CRÍTICA: El sistema se encuentra bloqueado.")
        return
    else:
        print("✅ Sistema operativo y seguro. Verificando servicios...")

    # 2. Bucle while para simular reintentos de conexión por socket
    intento = 1
    while intento <= intentos_maximos:
        print(f"\n[Intento de enlace {intento}/{intentos_maximos}]")
        if intento == 3:
            print("⚠️ Último intento de reconexión al socket principal.")
        intento += 1

    # 3. Bucle for para iterar y auditar la lista de servicios activos
    print("\n--- Auditoría de Servicios de Red ---")
    for index, servicio in enumerate(servicios, start=1):
        if servicio == "HTTP" or servicio == "SSH":
            estado = "ACTIVO (Crítico)"
        else:
            estado = "ACTIVO (Estándar)"
            
        print(f"  [{index}] Servicio {servicio}: {estado}")

monitor_sistema()