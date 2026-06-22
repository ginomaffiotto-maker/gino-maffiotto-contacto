import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 🔍 DIAGNÓSTICO: ver qué variables están llegando
    const dbUrl = process.env.DATABASE_URL;
    const dbToken = process.env.DATABASE_AUTH_TOKEN;
    const vercelEnv = process.env.VERCEL_ENV;
    const nodeEnv = process.env.NODE_ENV;

    // Verificar si las variables existen y sus prefijos (sin revelar el valor completo)
    const diagnostico = {
      timestamp: new Date().toISOString(),
      entorno: {
        VERCEL_ENV: vercelEnv || "(no definido)",
        NODE_ENV: nodeEnv || "(no definido)",
      },
      DATABASE_URL: {
        definida: typeof dbUrl !== "undefined" && dbUrl !== null && dbUrl !== "",
        longitud: dbUrl ? dbUrl.length : 0,
        prefijo: dbUrl ? dbUrl.substring(0, Math.min(20, dbUrl.length)) : "(vacío)",
        empiezaConLibsql: dbUrl ? dbUrl.startsWith("libsql://") : false,
      },
      DATABASE_AUTH_TOKEN: {
        definida: typeof dbToken !== "undefined" && dbToken !== null && dbToken !== "",
        longitud: dbToken ? dbToken.length : 0,
        prefijo: dbToken ? dbToken.substring(0, 10) : "(vacío)",
      },
    };

    // Si DATABASE_URL no está definida, devolvemos el diagnóstico
    if (!dbUrl || dbUrl === "" || dbUrl === "undefined") {
      return NextResponse.json(
        {
          error: "DATABASE_URL no está configurada",
          diagnostico: diagnostico,
          solucion:
            "Andá a Vercel → Settings → Environment Variables → agregá DATABASE_URL con tu URL de Turso (empieza con libsql://)",
        },
        { status: 500 },
      );
    }

    // Si está definida, intentamos conectar con Prisma
    const { db } = await import("@/lib/db");

    const form = await request.formData();
    const nombre = String(form.get("nombre") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const mensaje = String(form.get("mensaje") ?? "").trim();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 },
      );
    }

    try {
      const registro = await db.contactMessage.create({
        data: {
          nombre: nombre.slice(0, 120),
          email: email.slice(0, 254),
          asunto: String(form.get("asunto") ?? "").slice(0, 200) || "(Sin asunto)",
          mensaje: mensaje.slice(0, 5000),
          enlaces: String(form.get("enlaces") ?? "").slice(0, 1000) || null,
          archivoPath: null,
          archivoNombre: null,
        },
      });

      return NextResponse.json(
        { ok: true, id: registro.id, message: "Mensaje
