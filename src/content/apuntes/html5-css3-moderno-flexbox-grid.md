---
title: "HTML5 Semántico y CSS3 Moderno: Maquetación con Flexbox y CSS Grid"
description: "Aprende las bases de la maquetación web moderna con etiquetas semánticas de HTML5, cajas flexibles con Flexbox y rejillas con CSS Grid."
date: "2026-04-05"
categoria: "programacion"
subcategoria: "frontend"
dificultad: "Basico"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🎨 HTML5 Semántico y CSS3 Moderno: Flexbox y Grid

La maquetación web ha evolucionado drásticamente. Atrás quedaron los tiempos de maquetar con tablas o flotados (`float: left`). Hoy en día, los estándares modernos se apoyan en **HTML5 semántico**, **Flexbox** para componentes unidimensionales y **CSS Grid** para estructuras bidimensionales complejas.

---

## 1. Estructura Semántica en HTML5

Utilizar etiquetas semánticas mejora la accesibilidad (lectores de pantalla para personas con discapacidad visual) y el posicionamiento SEO:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Web Moderna</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Cabecera principal -->
  <header>
    <nav>
      <ul>
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#cursos">Cursos</a></li>
      </ul>
    </nav>
  </header>

  <!-- Contenido principal único de la página -->
  <main>
    <section id="hero">
      <h1>Aprende Desarrollo Web</h1>
      <p>Directo al grano y con proyectos reales.</p>
    </section>

    <article>
      <h2>Artículo Técnico</h2>
      <p>Contenido reutilizable e independiente.</p>
    </article>

    <aside>
      <h3>Barra Lateral</h3>
      <p>Enlaces relacionados, publicidad o widgets.</p>
    </aside>
  </main>

  <!-- Pie de página -->
  <footer>
    <p>&copy; 2026 ApuntesDev. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
```

---

## 2. Flexbox: Distribución Unidimensional (Eje X o Y)

Flexbox es la herramienta ideal para alinear elementos en filas o columnas (por ejemplo, menús de navegación, tarjetas o barras de botones).

### Propiedades clave del Contenedor (`display: flex`)

```css
.contenedor-flex {
  display: flex;
  flex-direction: row;        /* 'row' (horizontal) o 'column' (vertical) */
  justify-content: space-between; /* Alinea en el eje principal: flex-start, center, space-between, space-around */
  align-items: center;        /* Alinea en el eje secundario: stretch, center, flex-start, flex-end */
  gap: 1rem;                  /* Espacio homogéneo entre los hijos */
  flex-wrap: wrap;            /* Permite que los elementos pasen a la siguiente línea si no caben */
}
```

### Centrado perfecto en Flexbox (El Santo Grial)
```css
.caja-centrada {
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center;     /* Centrado vertical */
  min-height: 100vh;
}
```

---

## 3. CSS Grid: Maquetación Bidimensional (Filas y Columnas simultáneas)

CSS Grid te permite diseñar cuadrículas completas de manera declarativa sin necesidad de anidar múltiples `divs`:

```css
.galeria-grid {
  display: grid;
  /* Crea columnas automáticas que se adaptan al ancho de la pantalla: mínimo 280px, máximo 1 fracción */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.tarjeta {
  background: #1e1e24;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333;
  transition: transform 0.2s ease;
}

.tarjeta:hover {
  transform: translateY(-5px);
  border-color: #4ade80;
}
```

---

## 4. Media Queries: Diseño Responsive para Móviles

Para adaptar la web a teléfonos móviles y tablets:

```css
/* Estilos por defecto para Desktop */
.sidebar {
  display: block;
  width: 300px;
}

/* En pantallas de 768px o menos (Móviles y Tablets) */
@media (max-width: 768px) {
  .contenedor-flex {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sidebar {
    display: none; /* Oculta la barra lateral en móviles */
  }

  h1 {
    font-size: 2rem;
  }
}
```
