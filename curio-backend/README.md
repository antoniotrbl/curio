# Curio — Login/Registro de prueba con backend real

Backend en Node (Express) + base de datos SQLite (`better-sqlite3`).
Frontend estático servido por el mismo servidor.

## Requisitos
- Node.js 18 o superior instalado en tu computadora.

## Cómo correrlo

1. Abre una terminal en esta carpeta.
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor:
   ```
   node server.js
   ```
4. Abre en el navegador:
   ```
   http://localhost:3000
   ```

## Dónde quedan guardados los usuarios y contraseñas

Se guardan en un archivo de base de datos SQLite llamado **`curio.db`**, que
se crea automáticamente en esta misma carpeta la primera vez que registras
un usuario.

- Las contraseñas **nunca se guardan en texto plano**: se guardan como un
  *hash* (con `bcrypt`), que es la práctica correcta incluso en un proyecto
  de prueba.
La lista de usuarios ya **no se muestra en la interfaz** (por seguridad,
igual que en una app real). Para inspeccionar la tabla `users`:

  - Desde la terminal, con el cliente de SQLite:
    ```
    sqlite3 curio.db "SELECT * FROM users;"
    ```
  - Con una app gráfica como **DB Browser for SQLite** (gratuita),
    abriendo el archivo `curio.db`.
  - El endpoint `GET /api/users` sigue existiendo en el servidor (útil
    para probarlo con `curl` o Postman), pero nada en el frontend lo
    llama ni lo enlaza.

## Endpoints disponibles

- `POST /api/register` — body: `{ "username": "...", "password": "..." }`
- `POST /api/login` — body: `{ "username": "...", "password": "..." }`
- `GET /api/users` — lista de usuarios (sin contraseñas en texto plano)

## Cómo publicarlo gratis en internet (Render)

1. Sube esta carpeta a un repositorio de GitHub (si no tienes uno):
   ```
   git init
   git add .
   git commit -m "Curio login demo"
   ```
   Luego crea un repo vacío en https://github.com/new, y sigue las
   instrucciones que te da GitHub para "push an existing repository".

2. Entra a https://render.com y crea una cuenta gratuita (puedes registrarte
   con tu cuenta de GitHub).

3. Click en **New +** → **Web Service**, y conecta el repositorio que
   acabas de subir.

4. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Click en **Create Web Service**. En 1-2 minutos te da una URL pública
   tipo `https://curio-xxxx.onrender.com`.

### Importante sobre los datos en el plan gratuito

En el plan gratuito de Render, el disco **no es permanente**: cada vez que
el servicio se reinicia o vuelve a desplegar, el archivo `curio.db` se
borra y empiezas de cero. Para pruebas está perfecto. Si más adelante
quieres que los usuarios registrados persistan de verdad, hay dos caminos:
- Agregar un **Persistent Disk** de Render (tiene costo, aunque bajo).
- Migrar de SQLite a una base de datos gestionada (Render también ofrece
  PostgreSQL gratuito por 90 días, y luego con costo).

## Nota de seguridad

Este proyecto es para practicar/probar flujos de login localmente. Para un
proyecto real en producción faltaría, como mínimo: HTTPS, gestión de
sesiones/tokens (JWT o cookies firmadas), límites de intentos de login,
validación más estricta y protección CSRF.
