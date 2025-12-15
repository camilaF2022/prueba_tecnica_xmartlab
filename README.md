# Task Manager – Django + React (Vite)

Aplicación para la gestión de tareas, que permite crear, listar, editar y eliminar tareas.  
El proyecto está compuesto por un backend en Django y un frontend en React con Vite.

## Funcionalidades

- Crear tareas
- Listar tareas
- Editar tareas
- Eliminar tareas
- Autenticación básica

## Tecnologías

Backend:
- Python
- Django
- Django REST Framework

Frontend:
- React
- Vite
- TypeScript

## Requisitos

- Python 3.10 o superior
- Node.js 18 o superior
- Git

## Estructura del proyecto

── backend/

── frontend/

## Backend (Django)

### Crear y activar entorno virtual

#### Windows (PowerShell):

```
cd backend
python -m venv venv
.\venv\Scripts\activate
```

#### macOS / Linux:
```
cd backend
python3 -m venv venv
source venv/bin/activate
```
### Instalar dependencias
```
pip install -r requirements.txt
```
### Ejecutar migraciones
```
python manage.py migrate
```
### Ejecutar servidor
```
python manage.py runserver
```
El backend quedará disponible en:
http://127.0.0.1:8000


## Frontend (React + Vite)

### Instalar dependencias

```
cd frontend
npm install
```

### Variables de entorno

Crear el archivo frontend/.env con el siguiente contenido:
```
VITE_API_URL=http://127.0.0.1:8000/task_manager
```

### Ejecutar aplicación

```
npm run dev
```
El frontend quedará disponible en:
http://localhost:5173

### Producción

El backend está desplegado en Render, en la siguiente URL:
https://prueba-tecnica-xmartlab.onrender.com/

El frontend está desplegado en Vercel, en la siguiente URL:
https://prueba-tecnica-xmartlab.vercel.app/

Al ingresar al sitio en Vercel, es posible que la aplicación no responda inmediatamente, ya que Render suspende el proceso después de un tiempo de inactividad. En ese caso, será necesario esperar aproximadamente un minuto para que el backend esté operativo nuevamente.