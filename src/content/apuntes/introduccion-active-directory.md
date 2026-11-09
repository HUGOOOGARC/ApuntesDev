---
title: "Introducción a Active Directory y DNS (SOR)"
description: "Aprende los conceptos clave de Active Directory, dominios, controladores de dominio y la importancia del servicio DNS en redes corporativas."
date: "2026-03-30"
categoria: "sistemas"
subcategoria: "sor"
dificultad: "Intermedio"
xp_recompensa: 75
monedas_recompensa: 15
draft: false
---

# 🌐 Introducción a Active Directory y DNS en Sistemas Operativos en Red

En los entornos corporativos y empresariales, la gestión centralizada de usuarios, equipos y recursos es vital. Aquí es donde entra en juego **Active Directory (AD)** en entornos Windows Server.

## 1. ¿Qué es Active Directory?

**Active Directory** es un servicio de directorio creado por Microsoft que almacena información sobre los recursos de una red (usuarios, ordenadores, impresoras, políticas de grupo) y hace que esta información sea accesible para los usuarios y administradores.

### Componentes Principales:
- **Dominio:** Es la unidad lógica fundamental de Active Directory. Agrupa objetos (usuarios, equipos) que comparten una misma base de datos de seguridad y políticas comunes.
- **Controlador de Dominio (DC - *Domain Controller*):** Servidor que ejecuta Active Directory, autentica a los usuarios, almacena la base de datos del directorio y aplica las políticas de grupo (GPO).
- **Directivas de Grupo (GPO - *Group Policy Objects*):** Conjunto de reglas que permiten a los administradores gestionar la configuración de los equipos y usuarios de forma centralizada (por ejemplo, prohibir el panel de control o cambiar el fondo de pantalla corporativo).

---

## 2. El Papel Crucial del Servidor DNS

Active Directory **no puede funcionar sin DNS** (*Domain Name System*). El servicio DNS es el encargado de traducir los nombres de los equipos a direcciones IP, pero en Active Directory tiene una función vital adicional: **localizar a los Controladores de Dominio** mediante registros de servicio (SRV).

- Cuando un ordenador cliente quiere unirse a un dominio, consulta al DNS para encontrar qué servidor IP tiene el rol de Controlador de Dominio.
- Sin una correcta configuración de las zonas de búsqueda directa e inversa en el DNS, la red corporativa colapsa y las credenciales de los usuarios no pueden validarse.