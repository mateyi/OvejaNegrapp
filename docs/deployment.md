# Guía de Despliegue en la Nube - OvejaNegra

Este documento detalla los pasos para poner en producción la plataforma **OvejaNegra** utilizando servicios gratuitos y recomendados en la industria para arquitecturas Node.js + React + PostgreSQL.

---

## 1. Backend + Base de Datos en Railway

### Paso 1: Crear Proyecto en Railway
1. Ingresá a [Railway.app](https://railway.app/) e iniciá sesión con tu cuenta de GitHub.
2. Hacé clic en **"New Project"** -> **"Deploy from GitHub repo"**.
3. Seleccioná el repositorio `mateyi/OvejaNegrapp`.

### Paso 2: Provisionar Base de Datos PostgreSQL
1. En el dashboard de Railway, hacé clic en **"+ New"** -> **"Database"** -> **"Add PostgreSQL"**.
2. Railway creará la base de datos y proveerá automáticamente la variable `DATABASE_URL`.

### Paso 3: Configurar el Servicio del Backend
1. En los ajustes (*Settings*) del servicio `OvejaNegrapp`:
   - **Root Directory:** Poné `/backend`.
   - **Build Command:** `npm run build && npx prisma db push && npx tsx prisma/seed.ts`
   - **Start Command:** `npm start`
2. En la pestaña **Variables**, agregá:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (referencia interna de Railway)
   - `JWT_SECRET` = una clave aleatoria y segura de al menos 32 caracteres.
   - `JWT_EXPIRES_IN` = `7d`
3. En **Networking**, hacé clic en **"Generate Domain"** (obtendrás una URL como `https://ovejanegra-backend.up.railway.app`).

---

## 2. Frontend en Vercel

### Paso 1: Importar Repositorio en Vercel
1. Ingresá a [Vercel.com](https://vercel.com/) con tu cuenta de GitHub.
2. Hacé clic en **"Add New..."** -> **"Project"**.
3. Seleccioná `mateyi/OvejaNegrapp`.

### Paso 2: Configuración del Proyecto
1. **Framework Preset:** Vite.
2. **Root Directory:** Hacé clic en *Edit* y seleccioná `frontend`.
3. **Build Command:** `npm run build`.
4. **Output Directory:** `dist`.

### Paso 3: Variables de Entorno en Vercel
Agregá la siguiente variable:
- `VITE_API_URL` = La URL pública de tu backend en Railway (ejemplo: `https://ovejanegra-backend.up.railway.app`).

Hacé clic en **Deploy**. Vercel compilará la aplicación y te otorgará un dominio gratuito SSL (ejemplo: `https://ovejanegra.vercel.app`).

---

## 3. Verificación Post-Despliegue
1. Ingresá a la URL generada en Vercel.
2. Comprobá que los complejos de Mendoza carguen en la página principal.
3. Iniciá sesión con la cuenta de demo:
   - **Usuario:** `jugador@ovejanegra.com`
   - **Contraseña:** `OvejaNegra2026!`
4. Realizá una reserva de prueba en cualquiera de las canchas disponibles y sumate a un partido abierto.
