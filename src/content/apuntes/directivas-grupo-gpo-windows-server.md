---
title: "Directivas de Grupo (GPO) en Windows Server y Active Directory"
description: "Aprende a diseñar, vincular y aplicar GPOs en Active Directory: orden de procesamiento LSDOU, mapeo de unidades de red, restricciones de seguridad y gpupdate."
date: "2026-04-14"
categoria: "sistemas"
subcategoria: "sor"
dificultad: "Avanzado"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🏛️ Directivas de Grupo (GPO) en Windows Server

En una red corporativa o en un aula de informática, configurar cada equipo cliente manualmente es inviable. Las **Directivas de Grupo (GPO - Group Policy Objects)** permiten a los administradores de red centralizar la configuración de miles de ordenadores y usuarios desde el Controlador de Dominio (DC).

---

## 1. Orden de Procesamiento y Jerarquía (LSDOU)

Cuando un equipo Windows enciende y un usuario inicia sesión, las directivas no se aplican al azar; siguen una jerarquía estricta conocida por las siglas **LSDOU**:

```text
1. [ Local ]     ──> Directivas locales del propio equipo cliente (gpedit.msc)
         │
         ▼
2. [ Sitio ]     ──> Directivas aplicadas a la ubicación física de red (Site)
         │
         ▼
3. [ Dominio ]   ──> Directivas que afectan a TODOS los equipos y usuarios del dominio
         │
         ▼
4. [ OU ]        ──> Directivas vinculadas a Unidades Organizativas (y sub-OUs anidadas)
```

> ⚠️ **Regla de Prevalencia:** La directiva que se aplica más tarde **sobrescribe** a las anteriores si hay un conflicto. Por tanto, una GPO vinculada a una **OU específica tiene mayor prioridad** que una GPO de Dominio.

---

## 2. Tipos de Configuración en una GPO

Toda directiva de grupo se divide en dos secciones independientes:

1. **Configuración del Equipo (Computer Configuration):** Se aplica durante el arranque del sistema operativo, antes de que nadie inicie sesión. Afecta a la máquina física/virtual sin importar quién inicie sesión (ej: cortafuegos, scripts de inicio, actualizaciones de Windows).
2. **Configuración de Usuario (User Configuration):** Se aplica en el momento en que un usuario concreto introduce su contraseña y carga su perfil (ej: fondo de pantalla corporativo, bloqueo del Panel de Control, mapeo de unidades de red personales).

---

## 3. Ejemplos Prácticos de Implementación

### Caso A: Bloquear el acceso al Panel de Control y Configuración
Ideal para ordenadores de alumnos o puestos de atención al público:

1. Abrir la consola **`gpmc.msc`** (Administración de directivas de grupo).
2. Crear y vincular una GPO llamada `GPO_Restriccion_Alumnos` sobre la OU *Alumnos*.
3. Navegar a:
   `Configuración de usuario -> Directivas -> Plantillas administrativas -> Panel de control`
4. Habilitar la directiva: **"Prohibir el acceso a Configuración de PC y al Panel de control"**.

### Caso B: Mapeo Automático de Carpetas Compartidas (Unidad de Red)
Permite que al iniciar sesión aparezca automáticamente una unidad `Z:` con los apuntes:

1. Navegar en la GPO a:
   `Configuración de usuario -> Preferencias -> Configuración de Windows -> Asignaciones de unidades`
2. Crear una nueva unidad mapeada:
   - **Acción:** `Crear` o `Actualizar`.
   - **Ubicación:** `\\servidor-archivos\apuntes_smr`
   - **Letra de unidad:** `Z:`
   - **Etiqueta:** `Recursos Educativos SMR`

---

## 4. Opciones Avanzadas de Herencia

- **Bloquear Herencia (Block Inheritance):** Se configura sobre una OU. Impide que las directivas de los niveles superiores (Dominio o Sitio) se apliquen a los objetos dentro de esa OU.
- **Exigida / Forzada (Enforced):** Se activa sobre una GPO específica. Hace que dicha directiva se aplique **obligatoriamente**, saltándose cualquier bloqueo de herencia que exista debajo.

---

## 5. Comandos de Diagnóstico y Actualización

Por defecto, los clientes Windows refrescan sus GPOs cada 90 minutos con un retraso aleatorio de hasta 30 minutos. Para forzar la actualización inmediata en una máquina cliente:

```cmd
:: Forzar la aplicación inmediata de todas las directivas de equipo y usuario
gpupdate /force

:: Generar un informe detallado en pantalla de qué GPOs se están aplicando
gpresult /r

:: Exportar un informe gráfico completo en formato HTML para auditoría
gpresult /h C:\reporte_gpo.html
```
