import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    const dbToken = process.env.DATABASE_AUTH_TOKEN;
    const vercelEnv = process.env.VERCEL_ENV;
    const nodeEnv = process.env.NODE_ENV;

    const diagnostico = {
      timestamp: new Date().toISOString(),
      entorno: {
        VERCEL_ENV: vercelEnv || "no definido",
        NODE_ENV: nodeEnv || "no definido",
      },
      DATABASE_URL: {
        definida: !!(dbUrl && dbUrl !== "" && dbUrl !== "undefined"),
        longitud: dbUrl ? dbUrl.length : 0,
        prefijo: dbUrl ? dbUrl.substring(0, Math.min(20, dbUrl.length)) : "vacio",
        empiezaConLibsql: dbUrl ? dbUrl.startsWith("libsql://") : false,
      },
      DATABASE_AUTH_TOKEN: {
        definida: !!(dbToken && dbToken !== "" && dbToken !== "undefined"),
        longitud: dbToken ? dbToken.length : 0,
      },
    };

    if (!dbUrl || dbUrl === "" || dbUrl === "undefined") {
      return NextResponse.json(
        { error: "DATABASE_URL no configurada", diagnostico: diagnostico },
        { status: 500 },
      );
    }

    const { db } = await import("@/lib/db");

    const form = await request.formData();
    const nombre = String(form.get("nombre") || "").trim();
    const email = String(form.get("email") || "").trim();
    const mensaje = String(form.get("mensaje") || "").trim();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
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
      { ok: true, id: registro.id, message: "Mensaje recibido correctamente" },
      { status: 201 },
    );
  } catch (outerError: any) {
    console.error("Error:", outerError);
    return NextResponse.json(
      { error: outerError?.message || String(outerError) },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/contact" });
}
