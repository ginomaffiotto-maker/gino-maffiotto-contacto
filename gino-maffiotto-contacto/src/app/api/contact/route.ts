import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const dbUrl = process.env.DATABASE_URL;
  const dbToken = process.env.DATABASE_AUTH_TOKEN;

  const info = {
    DATABASE_URL_existe: !!dbUrl,
    DATABASE_URL_longitud: dbUrl ? dbUrl.length : 0,
    DATABASE_URL_prefijo: dbUrl ? dbUrl.substring(0, 15) : "vacio",
    DATABASE_AUTH_TOKEN_existe: !!dbToken,
    DATABASE_AUTH_TOKEN_longitud: dbToken ? dbToken.length : 0,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };

  if (!dbUrl || dbUrl === "undefined" || dbUrl.length < 10) {
    return NextResponse.json(
      { error: "DATABASE_URL no esta configurada", info: info },
      { status: 500 },
    );
  }

  try {
    const { db } = await import("@/lib/db");
    const form = await request.formData();
    const nombre = String(form.get("nombre") || "").trim();
    const email = String(form.get("email") || "").trim();
    const mensaje = String(form.get("mensaje") || "").trim();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos", info: info },
        { status: 400 },
      );
    }

    const registro = await db.contactMessage.create({
      data: {
        nombre: nombre.slice(0, 120),
        email: email.slice(0, 254),
        asunto: String(form.get("asunto") || "").slice(0, 200) || "Sin asunto",
        mensaje: mensaje.slice(0, 5000),
        enlaces: String(form.get("enlaces") || "").slice(0, 1000) || null,
        archivoPath: null,
        archivoNombre: null,
      },
    });

    return NextResponse.json(
      { ok: true, id: registro.id },
      { status: 201 },
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || String(e), info: info },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    DATABASE_URL_existe: !!process.env.DATABASE_URL,
  });
}
