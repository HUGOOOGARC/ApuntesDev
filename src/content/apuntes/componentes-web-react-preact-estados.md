---
title: "Fundamentos de Componentes Web: React / Preact, Props y Manejo de Estado"
description: "Aprende el paradigma declarativo de interfaces con React y Preact: creación de componentes funcionales en JSX, paso de propiedades (props) y reactividad con useState y useEffect."
date: "2026-04-26"
categoria: "programacion"
subcategoria: "frontend"
dificultad: "Avanzado"
xp_recompensa: 70
monedas_recompensa: 15
draft: false
---

# ⚛️ Componentes Modernos: React / Preact, Props y Hooks de Estado

En el desarrollo web moderno, crear aplicaciones complejas manipulando manualmente el DOM con `document.querySelector` se vuelve rápidamente inmanejable y propenso a errores de sincronización. Las bibliotecas como **React** y **Preact** introducen el paradigma **declarativo**: describes cómo debe verse la interfaz en función de los datos (*estado*), y el framework se encarga de actualizar el DOM real de forma eficiente mediante un árbol virtual (*Virtual DOM*).

---

## 1. Imperativo vs Declarativo

- **Imperativo (Vanilla JS clásico):** Le dices al navegador paso a paso cada operación física en el árbol DOM:
  ```javascript
  // Modo imperativo: buscar nodo, crear nodo, asignar texto, insertar hijo...
  const btn = document.getElementById('btn');
  btn.innerText = 'Cargando...';
  btn.setAttribute('disabled', 'true');
  ```
- **Declarativo (React / Preact):** Solo defines el estado; la UI se renderiza automáticamente como un reflejo de ese estado:
  ```jsx
  // Modo declarativo: la UI es una función directa del estado
  <button disabled={cargando}>
    {cargando ? 'Cargando...' : 'Guardar Cambios'}
  </button>
  ```

---

## 2. Componentes Funcionales y JSX

Un componente es una función de JavaScript que recibe datos de entrada (**Props**) y devuelve elementos visuales escritos en **JSX** (sintaxis similar a HTML integrada directamente en código JavaScript).

```jsx
// Definición del componente TarjetaApunte con tipado de Props
interface TarjetaProps {
  titulo: string;
  dificultad: 'Basico' | 'Intermedio' | 'Avanzado';
  xp: number;
}

export function TarjetaApunte({ titulo, dificultad, xp }: TarjetaProps) {
  return (
    <article className="card-apunte">
      <div className="badge-tag">{dificultad}</div>
      <h3 className="titulo">{titulo}</h3>
      <span className="xp-label">+{xp} XP Recompensa</span>
    </article>
  );
}
```

---

## 3. Estado Local con el Hook `useState`

El estado representa los datos internos que pueden cambiar durante el ciclo de vida del componente en respuesta a acciones del usuario:

```jsx
import { useState } from 'preact/hooks';

export function ContadorRacha() {
  // Declaración del estado 'dias' y su función modificadora 'setDias'
  const [dias, setDias] = useState(0);

  const incrementarRacha = () => {
    // Inmutabilidad: nunca modifiques 'dias = dias + 1' directamente
    setDias(prev => prev + 1);
  };

  const reiniciarRacha = () => {
    setDias(0);
  };

  return (
    <div className="contador-box">
      <h4>🔥 Racha de Estudio: {dias} días consecutivos</h4>
      <div className="botones-accion">
        <button onClick={incrementarRacha} className="btn-sumar">+1 Día</button>
        <button onClick={reiniciarRacha} className="btn-reset">Reiniciar</button>
      </div>
    </div>
  );
}
```

> **Principio de inmutabilidad:** En React/Preact, el framework solo detecta cambios y re-renderiza la interfaz cuando se llama a la función `set` con un nuevo valor o una nueva referencia en memoria.

---

## 4. Efectos Secundarios con `useEffect`

El Hook `useEffect` permite ejecutar código en respuesta a cambios de estado, o al montarse y desmontarse el componente (como llamadas a APIs externas o suscripciones a eventos de ventana):

```jsx
import { useState, useEffect } from 'preact/hooks';

export function RelojEstudio() {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    // 1. Se ejecuta al montar el componente: iniciar temporizador
    const intervalo = setInterval(() => {
      setSegundos(prev => prev + 1);
    }, 1000);

    // 2. Función de limpieza (cleanup): se ejecuta al desmontar para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, []); // Array de dependencias vacío = solo se ejecuta una vez al montar

  return <p>⏱️ Tiempo en sesión: {segundos} segundos</p>;
}
```

---

## 5. Cuadro Resumen de Hooks Esenciales

| Hook | Propósito Principal | Cuándo Utilizarlo |
| :--- | :--- | :--- |
| `useState` | Almacenar datos reactivos | Formularios, toggles, contadores, filtros activos. |
| `useEffect` | Efectos colaterales | Peticiones HTTP al cargar, sincronización con `localStorage`, timers. |
| `useMemo` | Memorizar cálculos costosos | Evitar recalcular filtros o búsquedas pesadas en cada render. |
| `useCallback` | Memorizar funciones | Pasar funciones a componentes hijos memoizados sin romper la igualdad referencial. |
