# OvejaNegra - Plataforma de Reservas de Canchas y Organización de Partidos

Plataforma web moderna, intuitiva y funcional desarrollada como proyecto escolar para la materia **Laboratorio de Software** (2026). Permite conectar jugadores deportivos con complejos de Mendoza, posibilitando la búsqueda de canchas, consulta de disponibilidad en tiempo real, reservas de horarios y unión a partidos comunitarios abiertos.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** (bundler de alta velocidad)
- **Tailwind CSS v3** con paleta personalizada (Negro, blanco, gris oscuro y acento verde lima `#a3e635`)
- **Lucide React** (iconografía minimalista moderna)
- **React Router DOM v6** (enrutamiento y navegación SPA)
- **Vitest** (testing unitario)

### Backend
- **Node.js 24** + **Express**
- **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Docker containerizado / Railway compatible)
- **Autenticación JWT** + **Bcrypt.js** para hashing seguro de credenciales
- **Arquitectura REST** por capas (Routes, Controllers, Middleware, Services, Prisma)

---

## 🎨 Identidad Visual y Experiencia de Usuario
- **Inspiración:** Referencia funcional de experiencia de reserva como ATC Sports (Godoy Cruz, Mendoza).
- **Estética:** Dark Mode SaaS deportivo minimalista (negro profundo, bordes zinc, tarjetas limpias, acentos en verde lima).
- **Localización:** Idioma español de Argentina, moneda en pesos argentinos (ARS `$`), horarios en formato 24hs (`America/Argentina/Buenos_Aires`).

---

## 📋 Funcionalidades Principales

1. **Landing Page:**
   - Buscador rápido con selector de Zona de Mendoza, Deporte y Fecha.
   - Vitrina de complejos deportivos destacados.
   - Vista previa de partidos abiertos con cupos disponibles.
   - Explicación de cómo funciona el sistema.

2. **Explorar Complejos:**
   - Filtros dinámicos por ciudad/zona (Godoy Cruz, Capital, Chacras de Coria, Guaymallén, Maipú).
   - Filtro por deportes (Fútbol, Pádel, Tenis, Básquet).
   - Tarjetas con fotografías, precios mínimos por hora y detalles de instalaciones.

3. **Página de Complejo & Sistema de Reservas (Estilo ATC Sports):**
   - Galería de fotografías en grilla.
   - Información de contacto, ubicación y servicios (vestuarios, iluminación, estacionamiento, cantina).
   - Selector interactivo de cancha (Fútbol 5, Fútbol 7, Pádel Panorámico, etc.).
   - Selector de fecha con disponibilidad consultada en tiempo real al backend.
   - Grilla visual de horarios (Libre vs Ocupado).
   - Prevención de turnos duplicados con transacciones atómicas.
   - Pago presencial en recepción del complejo al momento del juego.

4. **Buscar Partido (Partidos Abiertos Comunitarios):**
   - Ver convocatorias abiertas con indicador de cupos restantes y barra de progreso.
   - Cálculo automático de precio estimado por participante.
   - Botón directo para "Unirme al partido".
   - Al completarse el cupo cambia automáticamente a estado "Completo".
   - Formulario para crear un partido propio: reserva la cancha automáticamente para garantizar disponibilidad y anota al creador como primer jugador.
   - Opción para que un jugador abandone el partido o que el organizador lo cancele.

5. **Mis Turnos:**
   - Panel del jugador para revisar reservas activas, historial y partidos en los que participa, con opción de cancelación.

6. **Panel Administrativo (Dashboard):**
   - **Administrador de Complejo:** Supervisión de canchas, tarifas, calendario de reservas registradas y alta de nuevas canchas.
   - **Administrador General:** Métricas globales de la plataforma (total de usuarios, complejos, canchas, reservas y partidos).

---

## 👤 Credenciales de Demostración

| Rol | Email | Contraseña | Descripción |
|---|---|---|---|
| **Jugador Demo** | `jugador@ovejanegra.com` | `OvejaNegra2026!` | Reservas personales, partidos abiertos |
| **Admin Complejo** | `admin.godoycruz@ovejanegra.com` | `OvejaNegra2026!` | Dueño de Mendoza Fútbol (Godoy Cruz) |
| **Admin Complejo** | `admin.chacras@ovejanegra.com` | `OvejaNegra2026!` | Dueño de Chacras Park (Luján de Cuyo) |
| **Admin General** | `admin@ovejanegra.com` | `OvejaNegra2026!` | Estadísticas completas de la plataforma |

> *Nota: Todas las cuentas de prueba vienen precargadas con la contraseña `OvejaNegra2026!`.*

---

## 🛠️ Instalación y Ejecución Local

### 1. Prerrequisitos
- Node.js 18+ (recomendado Node 20 o 24)
- PostgreSQL (local o contenedor Docker)

### 2. Base de datos con Docker (opcional)
```bash
docker run --name ovejanegra-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ovejanegra -p 5432:5432 -d postgres:16-alpine
```

### 3. Configuración del Backend
```bash
cd backend
npm install
# Crear archivo .env (o copiar de .env.example)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ovejanegra?schema=public"
# JWT_SECRET="ovejanegra-secret"

# Sincronizar schema y sembrar datos de Mendoza
npx prisma db push
npx tsx prisma/seed.ts

# Iniciar servidor backend (puerto 3001)
npm run dev
```

### 4. Configuración del Frontend
```bash
cd ../frontend
npm install
npm run dev
# Abrir en navegador: http://localhost:5173
```

### 5. Ejecutar Pruebas
```bash
cd frontend
npx vitest run
```

---

## 🌐 Configuración de Despliegue en la Nube

- **Frontend (Vercel):** Se puede conectar el repositorio de GitHub apuntando el root directory a `/frontend`. Configurar variable de entorno `VITE_API_URL` apuntando a la URL del backend en producción.
- **Backend (Railway):** Desplegar el directorio `/backend`. Agregar PostgreSQL desde el marketplace de Railway y vincular la variable `DATABASE_URL`.
- **Base de Datos:** PostgreSQL administrado por Railway o Supabase.

