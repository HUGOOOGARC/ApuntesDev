---
title: "Bases de Datos Relacionales: SQL, SQLite y Conexión Segura con Python"
description: "Aprende el lenguaje SQL desde cero (DDL, DML, JOINs) y cómo interactuar con bases de datos relacionales en Python mediante sqlite3 previniendo ataques de inyección SQL."
date: "2026-04-30"
categoria: "programacion"
subcategoria: "backend"
dificultad: "Avanzado"
xp_recompensa: 75
monedas_recompensa: 15
draft: false
---

# 🗄️ Bases de Datos Relacionales: SQL y Conexión Segura con Python

Casi cualquier aplicación backend necesita almacenar datos de forma persistente y estructurada. Las **Bases de Datos Relacionales (RDBMS)** organizan la información en tablas compuestas por filas (registros) y columnas (campos), garantizando la integridad referencial mediante el lenguaje estándar **SQL** (*Structured Query Language*).

---

## 1. Fundamentos de SQL: Tablas y Claves

- **Clave Primaria (Primary Key):** Identificador único e irrepetible para cada fila (habitualmente un entero autoincremental o un UUID).
- **Clave Foránea (Foreign Key):** Campo que apunta a la clave primaria de otra tabla para crear relaciones consistentes.

```sql
-- DDL: Creación de tablas de usuarios y apuntes completados
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    xp INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lecciones_completadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    apunte_slug TEXT NOT NULL,
    completado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);
```

---

## 2. Operaciones CRUD Básicas en SQL

```sql
-- Create (Insertar)
INSERT INTO usuarios (username, email, xp) 
VALUES ('HugoDev', 'hugo@apuntesdev.com', 19500);

-- Read (Consultar)
SELECT username, xp FROM usuarios 
WHERE xp >= 1000 
ORDER BY xp DESC 
LIMIT 10;

-- Read con Relación (INNER JOIN)
SELECT u.username, l.apunte_slug, l.completado_en
FROM usuarios u
INNER JOIN lecciones_completadas l ON u.id = l.usuario_id
WHERE u.username = 'HugoDev';

-- Update (Modificar datos existentes)
UPDATE usuarios 
SET xp = xp + 50 
WHERE username = 'HugoDev';

-- Delete (Eliminar registros)
DELETE FROM usuarios 
WHERE id = 99;
```

---

## 3. Conexión a SQLite desde Python (`sqlite3`)

Python incluye en su biblioteca estándar el módulo `sqlite3`, que permite trabajar con una base de datos SQL completa en un único archivo sin necesidad de instalar servidores externos pesados:

```python
import sqlite3

def inicializar_bd():
    # Se conecta al archivo (se crea automáticamente si no existe)
    conexion = sqlite3.connect("academia.db")
    cursor = conexion.cursor()

    # Activar soporte de claves foráneas en SQLite
    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS estudiantes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            xp INTEGER DEFAULT 0
        )
    """)

    # Confirmar cambios en disco y cerrar
    conexion.commit()
    conexion.close()
    print("Base de datos inicializada correctamente.")
```

---

## 4. 🛡️ Prevención Absoluta de Inyecciones SQL (SQL Injection)

La **Inyección SQL** es una de las vulnerabilidades más críticas de la historia de la informática (Top 1 de OWASP). Ocurre cuando se concatenan directamente variables de usuario dentro de una consulta SQL:

```python
# ⛔ CÓDIGO PELIGROSO (VULNERABLE A INYECCIÓN SQL)
# Si un atacante introduce en 'usuario_input': "' OR '1'='1"
query_insegura = f"SELECT * FROM estudiantes WHERE nombre = '{usuario_input}'"
cursor.execute(query_insegura)  # ¡El atacante extrae todos los datos o borra la tabla!
```

### ✅ Solución Oficial: Consultas Parametrizadas
Usa placeholders `?` (parámetros vinculados). El motor de base de datos trata el valor como un dato literal puro, neutralizando cualquier intento de inyección:

```python
import sqlite3

def registrar_estudiante(nombre: str, email: str, xp_inicial: int = 0):
    try:
        with sqlite3.connect("academia.db") as conexion:
            cursor = conexion.cursor()
            
            # Consulta parametrizada segura con tupla de valores
            sql = "INSERT INTO estudiantes (nombre, email, xp) VALUES (?, ?, ?)"
            cursor.execute(sql, (nombre, email, xp_inicial))
            
            print(f"Estudiante '{nombre}' registrado con ID: {cursor.lastrowid}")
            
    except sqlite3.IntegrityError:
        print(f"Error: El email '{email}' ya se encuentra registrado.")

def consultar_top_ranking(limite: int = 5):
    with sqlite3.connect("academia.db") as conexion:
        cursor = conexion.cursor()
        cursor.execute("SELECT nombre, xp FROM estudiantes ORDER BY xp DESC LIMIT ?", (limite,))
        
        # Recuperar todas las filas devueltas
        filas = cursor.fetchall()
        for posicion, (nombre, xp) in enumerate(filas, start=1):
            print(f"#{posicion} {nombre} - {xp} XP")
```
