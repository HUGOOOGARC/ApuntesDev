---
title: "JavaScript Asíncrono: Promesas, Async/Await y Consumo de APIs con Fetch"
description: "Domina el modelo asíncrono de JavaScript, el Event Loop, la gestión de Promesas con async/await y cómo consumir APIs REST con fetch() y manejo robusto de errores."
date: "2026-04-25"
categoria: "programacion"
subcategoria: "frontend"
dificultad: "Intermedio"
xp_recompensa: 60
monedas_recompensa: 15
draft: false
---

# ⚡ JavaScript Asíncrono: Promesas, Async/Await y la API Fetch

JavaScript es un lenguaje de **un solo hilo de ejecución** (*single-threaded*). Esto significa que solo puede ejecutar una instrucción a la vez en su pila de llamadas (*Call Stack*). Para evitar que operaciones lentas (como una petición de red a un servidor o una lectura de base de datos) congelen la interfaz de usuario, JavaScript delega estas tareas al motor del navegador mediante el **Event Loop**.

---

## 1. El Event Loop y el Modelo Asíncrono

```text
[ Call Stack (Síncrono) ] ────► Tarea pesada (ej. fetch) ────► [ Web APIs del Navegador ]
          │                                                               │
          ▼                                                               ▼
   Ejecuta código local                                            Espera respuesta de red
          │                                                               │
          ▼                                                               ▼
[ Pila vacía ] ◄── Pasa tareas ◄── [ Microtask Queue (Promesas) ] ◄────── Terminado
```

Cuando una tarea en segundo plano finaliza, su función de retorno se coloca en la cola de tareas (*Microtask Queue*). El **Event Loop** vigila constantemente la pila: en cuanto la pila principal está vacía, extrae las tareas pendientes y las ejecuta.

---

## 2. De los Callbacks a las Promesas

Una **Promesa** (`Promise`) es un objeto que representa el resultado eventual (con éxito o con error) de una operación asíncrona.

Posee 3 estados posibles:
1. `pending`: Estado inicial, la operación aún no ha terminado.
2. `fulfilled`: La operación se completó con éxito (se resuelve con `.then()`).
3. `rejected`: La operación falló (se captura con `.catch()`).

```javascript
// Creación de una promesa que simula un retraso de red
const obtenerDatosSimulados = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exito = true;
      if (exito) {
        resolve({ usuario: "Hugo", rol: "Admin" });
      } else {
        reject(new Error("Error de conexión al servidor"));
      }
    }, 1500);
  });
};
```

---

## 3. La Revolución de `async` y `await`

La sintaxis `async / await` introducida en ES2017 permite escribir código asíncrono que se lee y se comporta de manera similar al código síncrono tradicional, mejorando drásticamente la legibilidad:

```javascript
async function cargarPerfil() {
  try {
    console.log("Cargando perfil...");
    const datos = await obtenerDatosSimulados();
    console.log("Perfil cargado:", datos.usuario);
  } catch (error) {
    console.error("No se pudo cargar el perfil:", error.message);
  } finally {
    console.log("Proceso finalizado (con éxito o error).");
  }
}

cargarPerfil();
```

---

## 4. Consumo de APIs REST con `fetch()`

La función global `fetch()` es el estándar moderno de los navegadores para realizar solicitudes HTTP por red.

### Petición GET con control de errores

> **Atención al comportamiento de fetch:** `fetch()` **no** rechaza la promesa ante un error HTTP como 404 (No encontrado) o 500 (Error de servidor). Solo la rechaza si hay un fallo de red físico (sin internet). Por eso **siempre** debemos comprobar `response.ok`:

```javascript
async function obtenerUsuarios() {
  const url = 'https://jsonplaceholder.typicode.com/users';

  try {
    const respuesta = await fetch(url);

    // 1. Verificar si el código HTTP es 200-299
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
    }

    // 2. Parsear el cuerpo de la respuesta como JSON
    const usuarios = await respuesta.json();
    
    // 3. Renderizar en el DOM
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = usuarios
      .slice(0, 5)
      .map(u => `<li><strong>${u.name}</strong> (${u.email})</li>`)
      .join('');

  } catch (error) {
    console.error("Fallo al consumir la API:", error);
    document.getElementById('error-msg').textContent = "No se pudieron obtener los datos.";
  }
}
```

### Petición POST (Envío de datos JSON al servidor)

Para enviar información (como un registro de usuario o un nuevo post):

```javascript
async function crearPublicacion(titulo, contenido) {
  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: titulo,
        body: contenido,
        userId: 1
      })
    });

    if (!respuesta.ok) throw new Error("Error al publicar datos");

    const resultado = await respuesta.json();
    console.log("Publicación creada con ID asignado:", resultado.id);
  } catch (err) {
    console.error("Error en POST:", err);
  }
}
```
