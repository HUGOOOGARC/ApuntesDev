---
title: "Programación Orientada a Objetos (POO): Clases, Herencia y Polimorfismo"
description: "Domina la POO en Python: modelado de entidades mediante Clases e Instancias, el método __init__, encapsulación con @property, herencia múltiple y métodos mágicos dunder."
date: "2026-04-29"
categoria: "programacion"
subcategoria: "backend"
dificultad: "Avanzado"
xp_recompensa: 75
monedas_recompensa: 15
draft: false
---

# 🧱 Programación Orientada a Objetos en Python: Clases y Herencia

La **Programación Orientada a Objetos (POO)** es el paradigma predominante para organizar sistemas de software complejos. En lugar de pensar en el programa como una secuencia de datos y funciones sueltas, lo estructuramos en **Objetos**: entidades independientes que combinan sus propios datos (*atributos*) con el comportamiento para interactuar con ellos (*métodos*).

---

## 1. Clases, Objetos y el Constructor `__init__`

Una **Clase** es el plano o molde de diseño, mientras que un **Objeto** es una instancia concreta creada a partir de ese plano:

```python
class Servidor:
    # Atributo de clase (compartido por todas las instancias)
    tipo_hardware = "x86_64"

    # Constructor: se ejecuta automáticamente al instanciar el objeto
    def __init__(self, hostname: str, ip: str, ram_gb: int):
        # Atributos de instancia (propios de cada servidor)
        self.hostname = hostname
        self.ip = ip
        self.ram_gb = ram_gb
        self.encendido = False

    # Método de instancia
    def encender(self):
        if not self.encendido:
            self.encendido = True
            print(f"[{self.hostname}] Servidor iniciado en la IP {self.ip}.")
        else:
            print(f"[{self.hostname}] Ya se encuentra encendido.")

    def apagar(self):
        self.encendido = False
        print(f"[{self.hostname}] Servidor detenido.")

# Instanciación de objetos
servidor_web = Servidor("srv-web-01", "192.168.1.10", 16)
servidor_db = Servidor("srv-mysql-01", "192.168.1.20", 64)

servidor_web.encender()
```

---

## 2. Encapsulación y el Decorador `@property`

En Python no existen palabras clave como `private` o `public` estrictas como en Java o C#. En su lugar, se utilizan convenciones de nomenclatura:
- `self.nombre`: Atributo público.
- `self._puerto`: Atributo protegido (aviso a desarrolladores de no modificarlo directamente).
- `self.__password`: Atributo privado (*Name Mangling* para dificultar su sobrescritura accidental).

Para controlar la lectura y modificación segura de un atributo utilizamos **getters y setters con `@property`**:

```python
class Usuario:
    def __init__(self, username: str, xp: int):
        self.username = username
        self._xp = max(0, xp)  # Evita inicializar con XP negativo

    # Getter
    @property
    def xp(self) -> int:
        return self._xp

    # Setter con validación de negocio
    @xp.setter
    def xp(self, nuevo_valor: int):
        if nuevo_valor < 0:
            raise ValueError("El valor de experiencia no puede ser negativo.")
        self._xp = nuevo_valor

# Uso
perfil = Usuario("HugoDev", 1500)
print(perfil.xp)      # Acceso como si fuera un atributo: 1500
perfil.xp = 1800      # Llama al setter validado
```

---

## 3. Herencia y la Función `super()`

La **Herencia** permite crear una clase hija especializada a partir de una clase padre, reutilizando toda su lógica y extendiendo sus capacidades:

```python
# Clase Padre
class DispositivoRed:
    def __init__(self, marca: str, modelo: str, ip_admin: str):
        self.marca = marca
        self.modelo = modelo
        self.ip_admin = ip_admin

    def reiniciar(self):
        print(f"Reiniciando dispositivo {self.marca} {self.modelo}...")

# Clase Hija (Hereda de DispositivoRed)
class Switch(DispositivoRed):
    def __init__(self, marca: str, modelo: str, ip_admin: str, num_puertos: int):
        # Llama al constructor de la clase padre
        super().__init__(marca, modelo, ip_admin)
        self.num_puertos = num_puertos
        self.vlans_activas = [1]  # VLAN 1 por defecto

    def crear_vlan(self, vlan_id: int):
        if vlan_id not in self.vlans_activas:
            self.vlans_activas.append(vlan_id)
            print(f"VLAN {vlan_id} activada en switch {self.modelo}.")

# Prueba
sw_cisco = Switch("Cisco", "Catalyst 2960", "192.168.1.2", 24)
sw_cisco.crear_vlan(10)
sw_cisco.reiniciar()  # Método heredado de la clase padre
```

---

## 4. Métodos Mágicos (*Dunder Methods*)

Los métodos mágicos (comienzan y terminan con doble guion bajo `__`) definen cómo se comporta tu clase ante operadores nativos de Python:

```python
class ItemTienda:
    def __init__(self, nombre: str, precio_monedas: int):
        self.nombre = nombre
        self.precio_monedas = precio_monedas

    # Representación legible para humanos al imprimir con print()
    def __str__(self) -> str:
        return f"Item '{self.nombre}' ({self.precio_monedas} monedas)"

    # Comparación de igualdad al usar el operador '=='
    def __eq__(self, otro) -> bool:
        if isinstance(otro, ItemTienda):
            return self.nombre == otro.nombre and self.precio_monedas == otro.precio_monedas
        return False

item1 = ItemTienda("Tema Cyberpunk", 500)
print(item1)  # Salida: Item 'Tema Cyberpunk' (500 monedas)
```
