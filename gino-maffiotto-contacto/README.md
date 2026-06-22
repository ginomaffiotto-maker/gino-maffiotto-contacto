# Página de contacto — Gino Maffiotto

Página web personal de contacto para **Gino Maffiotto**, Ejecutivo Comercial y Presupuestista de soluciones metálicas para la industria y la construcción.

## 🚀 Publicar en Vercel (paso a paso)

Esta guía te lleva desde cero hasta tener tu página online en ~15 minutos.

### Requisitos
- Cuenta de GitHub (gratis) — `ginomaffiotto@gmail.com`
- Cuenta de Vercel (gratis) — te puedes registrar con GitHub
- Cuenta de Turso (gratis) — para la base de datos del formulario

---

### Paso 1 — Subir el código a GitHub

1. Entra a **[github.com](https://github.com)** e inicia sesión con tu cuenta.
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**.
3. Completa:
   - **Repository name**: `gino-maffiotto-contacto` (o el nombre que prefieras)
   - **Description**: `Página de contacto personal`
   - **Private** o **Public** (recomendado Public para que Vercel funcione sin issues)
   - **NO** marques "Add a README", ".gitignore" ni "license" (ya están incluidos)
4. Haz clic en **"Create repository"**.
5. En la página del repo recién creado, verás una sección **"...or push an existing folder"** o **"uploading an existing file"**. Haz clic en **"uploading an existing file"**.
6. **Descomprime el ZIP del código fuente** que descargaste desde la página (botón "Descargar código fuente") en tu computadora.
7. **Arrastra todos los archivos** descomprimidos a la página de GitHub (o haz clic en "choose your files").
8. Al final, escribe un mensaje de commit (ej: `Primer commit - página de contacto`) y haz clic en **"Commit changes"**.

✅ Ahora tu código está en GitHub.

---

### Paso 2 — Crear la base de datos en Turso (gratis)

El formulario de contacto necesita una base de datos. En Vercel no se puede usar SQLite local, así que usamos **Turso** (SQLite en la nube, gratis).

1. Entra a **[turso.tech](https://turso.tech)** → **"Sign Up"** → regístrate con GitHub.
2. Una vez dentro, haz clic en **"New database"**.
3. **Name**: `gino-contacto` (o el que quieras).
4. **Location**: `nue1` (Nueva York) o la más cercana a Uruguay.
5. Haz clic en **"Create"**.
6. En la página de tu base de datos, busca la sección **"LibSQL URL"** y cópiala (empieza con `libsql://`).
7. Busca también **"Auth Token"** → haz clic en **"Create auth token"** y cópialo.
8. **Anota estos 2 valores** porque los necesitarás en el Paso 4:
   - `DATABASE_URL` = la URL libsql (ej: `libsql://gino-contacto-xxxx.turso.io`)
   - `DATABASE_AUTH_TOKEN` = el token largo

---

### Paso 3 — Crear las tablas en Turso

Necesitas crear la tabla donde se guardarán los mensajes. Tienes dos opciones:

**Opción A (recomendada) — Con la consola web de Turso:**
1. En tu base de datos de Turso, ve a la pestaña **"Data"** o **"SQL Console"**.
2. Pega este SQL y ejecútalo:

```sql
CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "asunto" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "enlaces" TEXT,
    "archivoPath" TEXT,
    "archivoNombre" TEXT,
    "leido" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Opción B — Con la CLI de Turso** (si te sientes cómodo con la terminal):
```bash
# Instala Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Inicia sesión
turso auth login

# Ejecuta el SQL
turso db shell gino-contacto "CREATE TABLE IF NOT EXISTS \"ContactMessage\" (\"id\" TEXT NOT NULL PRIMARY KEY, \"nombre\" TEXT NOT NULL, \"email\" TEXT NOT NULL, \"asunto\" TEXT NOT NULL, \"mensaje\" TEXT NOT NULL, \"enlaces\" TEXT, \"archivoPath\" TEXT, \"archivoNombre\" TEXT, \"leido\" BOOLEAN NOT NULL DEFAULT 0, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);"
```

---

### Paso 4 — Conectar Vercel con GitHub y desplegar

1. Entra a **[vercel.com](https://vercel.com)** → **"Sign Up"** → **"Continue with GitHub"**.
2. Autoriza a Vercel a acceder a tu GitHub.
3. En el dashboard de Vercel, haz clic en **"Add New…" → "Project"**.
4. Verás tu repositorio `gino-maffiotto-contacto` → haz clic en **"Import"**.
5. En la página de configuración del deploy:
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Root Directory**: `./` (por defecto)
   - **Build Command**: `next build` (por defecto)
   - **Install Command**: `bun install` (debería detectarse automáticamente)
6. **IMPORTANTE — Variables de entorno:** Antes de hacer Deploy, ve a la sección **"Environment Variables"** y agrega:
   - **`DATABASE_URL`** = tu URL de Turso (ej: `libsql://gino-contacto-xxxx.turso.io`)
   - **`DATABASE_AUTH_TOKEN`** = tu token de Turso
7. Haz clic en **"Deploy"** 🎉
8. Espera ~1-2 minutos. Vercel te mostrará un mensaje de "Congratulations!" con tu URL pública:
   - Algo como `https://gino-maffiotto-contacto.vercel.app` o similar.

✅ ¡Tu página está online! Cópiala y compártela donde quieras.

---

### Paso 5 (opcional) — Configurar un dominio propio

Si quieres usar un dominio tipo `gino.com.uy`:
1. En el dashboard de Vercel → tu proyecto → pestaña **"Settings" → "Domains"**.
2. Agrega tu dominio y sigue las instrucciones (necesitarás cambiar los DNS en tu proveedor de dominio).
3. Vercel configura el HTTPS automáticamente.

---

## 🛠️ Desarrollo local

Si quieres modificar la página en tu computadora:

```bash
# Instalar dependencias
bun install

# Crear la base de datos SQLite local
bun run db:push

# Iniciar el servidor de desarrollo
bun run dev
```

La página estará en `http://localhost:3000`.

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/contact/route.ts   # API del formulario de contacto
│   ├── layout.tsx              # Layout raíz con tema claro/oscuro
│   └── page.tsx                # Página principal
├── components/
│   ├── theme-provider.tsx      # Proveedor de tema (next-themes)
│   ├── theme-toggle.tsx        # Botón claro/oscuro
│   └── ui/                     # Componentes shadcn/ui
└── lib/
    └── db.ts                   # Cliente Prisma (SQLite local / Turso prod)

prisma/
└── schema.prisma               # Esquema de la base de datos

public/
├── perfil-gino.png             # Foto de perfil
├── fondo-industrial-v2.jpg     # Imagen de fondo
├── tarjeta-gino-maffiotto.jpg  # Tarjeta para compartir
└── download/                   # Archivos descargables
```

## 📝 Datos de contacto configurados

Todos los datos están en `src/app/page.tsx`, en la constante `CONTACT` al inicio del archivo. Edita esa constante para cambiar email, teléfono, ubicación, etc.

## 🔧 Tecnologías

- **Next.js 16** + TypeScript
- **Tailwind CSS 4** + shadcn/ui
- **Prisma ORM** (SQLite local / Turso producción)
- **Framer Motion** (animaciones)
- **next-themes** (modo claro/oscuro)
- **Sonner** (notificaciones toast)

## 📜 Licencia

Código privado de Gino Maffiotto © 2025.
