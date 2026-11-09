---
title: "Fundamentos de Python: Variables, Tipos de Datos y Operadores"
description: "Iníciate en Python desde cero: variables con convención PEP 8, tipos primitivos, listas, tuplas, diccionarios, operadores lógicos y formateo moderno con f-strings."
date: "2026-04-27"
categoria: "programacion"
subcategoria: "backend"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🐍 Fundamentos de Python: Variables, Tipos y Operadores

Python es uno de los lenguajes de programación más populares y versátiles del mundo, utilizado en desarrollo backend, ciberseguridad, automatización de sistemas, análisis de datos e inteligencia artificial. Su diseño prioriza la **legibilidad del código** mediante una sintaxis limpia y basada en la sangría o indentación.

---

## 1. Características Clave del Lenguaje

- **Interpretado:** No requiere un paso previo de compilación manual a binario; el intérprete de Python ejecuta el código línea a línea.
- **Tipado Dinámico:** No necesitas declarar explícitamente el tipo de una variable (como `int` o `string`); Python infiere el tipo en tiempo de ejecución.
- **Fuertemente Tipado:** Python no realiza conversiones automáticas incoherentes entre tipos incompatibles (por ejemplo, sumar `"5" + 2` provocará un error de tipo `TypeError` en lugar de concatenarlo silenciosamente).

---

## 2. Variables y Nomenclatura (PEP 8)

El estándar oficial de estilo para Python (**PEP 8**) establece el uso de **snake_case** (palabras en minúsculas separadas por guiones bajos) para nombres de variables y funciones:

```python
# ✅ Nombres recomendados (snake_case)
nombre_usuario = "Hugo"
nivel_experiencia = 5
servidor_activo = True
tasa_latencia = 14.8

# ❌ Nombres no recomendados
NombreUsuario = "Hugo"   # Reservado para Clases
x = "Hugo"               # Poco descriptivo
```

---

## 3. Tipos de Datos Primitivos

```python
# Entero (int)
puerto_ssh = 22

# Decimal de coma flotante (float)
temperatura_cpu = 48.75

# Cadena de texto (str)
mensaje_bienvenida = "Bienvenido a ApuntesDev"

# Booleano (bool)
es_administrador = True
mantenimiento_activo = False
```

### Conversión de tipos (*Casting*)
Cuando recibes datos de una entrada de usuario o de una petición web, suelen llegar como cadenas de texto:

```python
texto_edad = "25"
edad_numerica = int(texto_edad)       # Convierte a entero: 25
total_precio = float("19.99")         # Convierte a decimal: 19.99
numero_a_texto = str(100)             # Convierte a cadena: "100"
```

---

## 4. Colecciones Nativas de Datos

Python incluye cuatro estructuras de datos integradas de alto nivel:

```python
# 1. LISTA (list): Ordenada, mutable (modificable), admite duplicados
servidores = ["srv-web-01", "srv-db-01", "srv-dns-01"]
servidores.append("srv-backup-01")   # Añadir elemento al final
servidores[0] = "srv-web-prod"       # Modificar elemento por índice

# 2. TUPLA (tuple): Ordenada, INMUTABLE (no se puede modificar tras crearla)
coordenadas_gps = (40.4168, -3.7038)

# 3. DICCIONARIO (dict): Colección clave-valor asociativa de acceso rápido
perfil_estudiante = {
    "nickname": "HugoDev",
    "rango": "Admin",
    "nivel": 31,
    "xp": 19175,
    "medallas": ["LinuxPro", "CiscoMaster"]
}
# Acceder a un valor por su clave:
print(perfil_estudiante["rango"])          # "Admin"
print(perfil_estudiante.get("puntos", 0))  # Acceso seguro con valor por defecto

# 4. CONJUNTO (set): Elementos únicos, desordenados y sin duplicados
ips_bloqueadas = {"192.168.1.50", "10.0.0.99", "192.168.1.50"}
print(ips_bloqueadas)  # {"192.168.1.50", "10.0.0.99"} (elimina repetidos)
```

---

## 5. Operadores Esenciales

### Operadores Aritméticos Especiales
```python
suma = 10 + 3        # 13
division_real = 7 / 2      # 3.5 (float)
division_entera = 7 // 2   # 3 (descarta decimales)
modulo_resto = 10 % 3      # 1 (resto de la división)
potencia = 2 ** 8          # 256
```

### Operadores Lógicos y de Pertenencia
```python
rol = "sysadmin"
activo = True

# Lógicos (and, or, not)
if rol == "sysadmin" and activo:
    print("Acceso total al servidor concedido.")

# Pertenencia (in, not in)
servicios_validos = ["http", "ssh", "smtp"]
if "ftp" not in servicios_validos:
    print("El protocolo FTP ha sido deshabilitado por seguridad.")
```

---

## 6. Formateo Moderno con f-strings

Introducidas en Python 3.6, las **f-strings** (*formatted string literals*) son el mecanismo más rápido, limpio y legible para interpolar variables y expresiones dentro de cadenas:

```python
usuario = "Hugo"
xp_actual = 19175
xp_necesaria = 20000

print(f"Hola {usuario}, te faltan {xp_necesaria - xp_actual} XP para subir de nivel.")
# Salida: Hola Hugo, te faltan 825 XP para subir de nivel.
```
