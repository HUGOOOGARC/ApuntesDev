---
title: "Manipulación del DOM y Gestión de Eventos con JavaScript Moderno"
description: "Aprende a seleccionar nodos, modificar estilos dinámicamente, escuchar eventos del usuario y crear interfaces interactivas con ES6+."
date: "2026-04-06"
categoria: "programacion"
subcategoria: "frontend"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# ⚡ Manipulación del DOM y Eventos con JavaScript

El **DOM (Document Object Model)** es la representación en forma de árbol de objetos que el navegador genera a partir de tu archivo HTML. Con **JavaScript**, podemos leer, modificar, añadir y eliminar cualquier nodo en tiempo real sin recargar la página.

---

## 1. Selección de Elementos del DOM

En JavaScript moderno (`ES6+`), los métodos estándar más eficientes y versátiles son `querySelector` y `querySelectorAll`:

```javascript
// Seleccionar un único elemento (el primero que coincida con el selector CSS)
const titulo = document.querySelector('#titulo-principal');
const boton = document.querySelector('.btn-accion');

// Seleccionar múltiples elementos (devuelve un NodeList iterable)
const todosLosEnlaces = document.querySelectorAll('nav a');
const tarjetas = document.querySelectorAll('.card');

// Iterar sobre los elementos seleccionados
tarjetas.forEach((tarjeta, index) => {
  console.log(`Tarjeta número ${index + 1}:`, tarjeta);
});
```

---

## 2. Modificación de Contenido y Clases CSS

Nunca concatenes HTML inseguro si proviene del usuario. Emplea las propiedades nativas:

```javascript
const mensaje = document.querySelector('#mensaje-estado');

// Modificar texto de forma segura (sin interpretar HTML malicioso)
mensaje.textContent = '¡Sesión iniciada correctamente!';

// Gestionar clases CSS de forma dinámica con classList (Recomendado)
mensaje.classList.add('activo');        // Añade una clase
mensaje.classList.remove('oculto');     // Quita una clase
mensaje.classList.toggle('modo-oscuro'); // Si está la quita, si no está la añade
const tieneClase = mensaje.classList.contains('activo'); // Devuelve true/false
```

---

## 3. Escucha y Gestión de Eventos (`addEventListener`)

El método `addEventListener` permite vincular una función a cualquier interacción del usuario (clicks, teclado, scroll, formularios):

```javascript
const botonComprar = document.querySelector('#btn-comprar');
const inputBusqueda = document.querySelector('#input-buscar');
const formulario = document.querySelector('#form-registro');

// 1. Evento de Click
botonComprar.addEventListener('click', (evento) => {
  console.log('El usuario ha pulsado el botón!', evento.target);
  botonComprar.disabled = true;
  botonComprar.textContent = 'Procesando...';
});

// 2. Evento de Entrada de Texto en tiempo real
inputBusqueda.addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  console.log('Buscando:', texto);
});

// 3. Control de Formularios con preventDefault
formulario.addEventListener('submit', (e) => {
  // Evita que la página se recargue automáticamente
  e.preventDefault();

  const datos = new FormData(formulario);
  const email = datos.get('email');
  console.log('Email enviado:', email);
});
```

---

## 4. Creación Dinámica de Nodos

Podemos inyectar elementos al vuelo utilizando `document.createElement`:

```javascript
function agregarNotificacion(texto) {
  // Crear el elemento en memoria
  const toast = document.createElement('div');
  toast.className = 'toast-notificacion';
  toast.textContent = texto;

  // Insertarlo al final del body
  document.body.appendChild(toast);

  // Eliminarlo automáticamente tras 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Ejemplo de uso
agregarNotificacion('Has ganado +50 XP 🚀');
```
