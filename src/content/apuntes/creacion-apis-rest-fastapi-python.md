---
title: "Desarrollo de APIs RESTful con FastAPI y Pydantic en Python"
description: "Aprende a construir servicios web backend modernos de alto rendimiento: arquitectura REST, validación de esquemas con Pydantic y documentación interactiva automática Swagger con FastAPI."
date: "2026-05-01"
categoria: "programacion"
subcategoria: "backend"
dificultad: "Avanzado"
xp_recompensa: 80
monedas_recompensa: 20
draft: false
---

# 🚀 Creación de APIs REST con FastAPI y Pydantic en Python

Una **API REST** (*Representational State Transfer*) es el canal estándar que conecta las interfaces de usuario (como nuestra web en Astro/React o una app móvil) con los servidores y bases de datos backend. **FastAPI** es actualmente el framework web de Python más moderno, rápido y demandado en la industria gracias a su soporte nativo asíncrono (`async/await`) y su integración con **Pydantic** para la validación automática de datos.

---

## 1. Principios de la Arquitectura REST

Las APIs REST se basan en el protocolo HTTP para realizar operaciones sobre recursos:

| Método HTTP | Propósito CRUD | Código de Estado Típico |
| :--- | :--- | :--- |
| `GET` | Leer o consultar recursos existentes | `200 OK` |
| `POST` | Crear un nuevo recurso | `201 Created` |
| `PUT` / `PATCH` | Actualizar un recurso existente | `200 OK` |
| `DELETE` | Eliminar un recurso | `204 No Content` / `200 OK` |

### Códigos de Estado Clave
- `200 OK`: Operación exitosa.
- `201 Created`: Recurso creado satisfactoriamente en el servidor.
- `400 Bad Request`: Datos de petición mal formados o inválidos.
- `401 Unauthorized`: El cliente no está autenticado (falta token o credencial).
- `404 Not Found`: El recurso solicitado no existe.
- `500 Internal Server Error`: Fallo no controlado en el servidor.

---

## 2. Validación de Datos con Pydantic (`BaseModel`)

Pydantic permite definir esquemas de datos tipados. Si un cliente envía una petición con un tipo incorrecto (por ejemplo, texto en un campo numérico), FastAPI devuelve automáticamente un error `422 Unprocessable Entity` con el detalle exacto sin que tengas que programar validaciones manuales:

```python
from pydantic import BaseModel, Field
from typing import Optional

class ApunteCreacion(BaseModel):
    titulo: str = Field(..., min_length=5, max_length=120)
    categoria: str = Field(..., pattern="^(sistemas|redes|programacion)$")
    xp_recompensa: int = Field(default=50, ge=10, le=500)
    descripcion: Optional[str] = None

class ApunteRespuesta(ApunteCreacion):
    id: int
    completado: bool = False
```

---

## 3. Construcción del Servidor con FastAPI

```python
from fastapi import FastAPI, HTTPException, status
from typing import List

app = FastAPI(
    title="ApuntesDev API",
    description="API RESTful backend para gestión de apuntes y progreso del estudiante",
    version="1.0.0"
)

# Base de datos simulada en memoria
db_apuntes = [
    {"id": 1, "titulo": "Comandos Linux Básicos", "categoria": "sistemas", "xp_recompensa": 50, "completado": True},
    {"id": 2, "titulo": "Subnetting IPv4", "categoria": "redes", "xp_recompensa": 50, "completado": False},
]

# 1. Endpoint GET: Listar todos los apuntes con filtro opcional de categoría
@app.get("/api/apuntes", response_model=List[dict])
def listar_apuntes(categoria: Optional[str] = None):
    if categoria:
        return [a for a in db_apuntes if a["categoria"] == categoria]
    return db_apuntes

# 2. Endpoint GET con Parámetro de Ruta: Obtener apunte por su ID
@app.get("/api/apuntes/{apunte_id}", response_model=dict)
def obtener_apunte(apunte_id: int):
    for apunte in db_apuntes:
        if apunte["id"] == apunte_id:
            return apunte
    # Lanzar error 404 si no se encuentra
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Apunte con ID {apunte_id} no encontrado."
    )

# 3. Endpoint POST: Crear nuevo apunte validado por Pydantic
@app.post("/api/apuntes", status_code=status.HTTP_201_CREATED)
def crear_apunte(nuevo_apunte: ApunteCreacion):
    nuevo_id = len(db_apuntes) + 1
    registro = {
        "id": nuevo_id,
        "titulo": nuevo_apunte.titulo,
        "categoria": nuevo_apunte.categoria,
        "xp_recompensa": nuevo_apunte.xp_recompensa,
        "completado": False
    }
    db_apuntes.append(registro)
    return registro
```

---

## 4. Ejecución del Servidor y Documentación Interactiva

Para arrancar el servidor backend en local con recarga en caliente (*hot-reload*):

```bash
# Instalar FastAPI y el servidor ASGI Uvicorn
pip install fastapi uvicorn

# Iniciar servidor en el puerto 8000
uvicorn main:app --reload
```

Una de las características más aclamadas de FastAPI es que genera automáticamente dos interfaces web interactivas para probar todos tus endpoints en vivo:
- **Swagger UI:** Visita en tu navegador `http://127.0.0.1:8000/docs`
- **ReDoc:** Visita `http://127.0.0.1:8000/redoc`

Desde `/docs` puedes enviar peticiones GET y POST reales con payloads JSON directamente desde el navegador, verificar las respuestas y consultar los esquemas de datos sin necesidad de instalar herramientas externas como Postman.
