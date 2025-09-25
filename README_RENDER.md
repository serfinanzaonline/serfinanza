# Despliegue en Render

## Pasos rápidos
1. Sube este proyecto a GitHub o súbelo como ZIP a Render.
2. En Render, crea un servicio **Web Service** con:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Variables de entorno requeridas (Settings → Environment):
   - `AES_KEY_BASE64`
   - `AES_IV_BASE64`
   - `SESSION_SECRET`
   - `ADMIN_USER`
   - `ADMIN_PASS`
4. Tu app quedará disponible en **una sola URL**, sirviendo:
   - El frontend desde `Personal/` (ej. `/` → Login).
   - El backend desde `serfina-backend/` (ej. `/api`, `/admin`).

