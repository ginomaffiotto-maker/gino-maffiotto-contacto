import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const MAX_NOMBRE = 120;
const MAX_ASUNTO = 200;
const MAX_MENSAJE = 5000;
const MAX_ENLACES = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Cuerpo inválido (se esperaba multipart/form-data)." },
        { status: 400 },
      );
    }

    const nombre = String(form.get("nombre") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const asunto = String(form.get("asunto") ?? "").trim();
    const mensaje = String(form.get("mensaje") ?? "").trim();
    const enlaces = String(form.get("enlaces") ?? "").trim();
    const archivo = form.get("archivo");

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 },
      );
    }

    const nombreLimpio = sanitize(nombre, MAX_NOMBRE);
    const emailLimpio = sanitize(email, 254);
    const asuntoLimpio = sanitize(asunto, MAX_ASUNTO);
    const mensajeLimpio = sanitize(mensaje, MAX_MENSAJE);
    const enlacesLimpio = sanitize(enlaces, MAX_ENLACES);

    if (nombreLimpio.length < 2) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 2 caracteres." },
        { status: 422 },
      );
    }
    if (!EMAIL_RE.test(emailLimpio)) {
      return NextResponse.json(
        { error: "El email no es válido." },
        { status: 422 },
      );
    }
    if (mensajeLimpio.length < 5) {
      return NextResponse.json(
        { error: "El mensaje es demasiado corto." },
        { status: 422 },
      );
    }

    // En Vercel NO guardamos archivos en disco (read-only filesystem)
    // Solo guardamos el nombre del archivo como referencia
    let archivoNombre: string | null = null;
    if (archivo && archivo instanceof File && archivo.size > 0) {
      archivoNombre = archivo.name;
    }

    // INTENTAR GUARDAR EN LA BASE DE DATOS
    // Si falla, devolvemos el error EXACTO para poder diagnosticar
    try {
      const registro = await db.contactMessage.create({
        data: {
          nombre: nombreLimpio,
          email: emailLimpio,
          asunto: asuntoLimpio || "(Sin asunto)",
          mensaje: mensajeLimpio,
          enlaces: enlacesLimpio || null,
          archivoPath: null,
          archivoNombre: archivoNombre,
        },
      });

      return NextResponse.json(
        { ok: true, id: registro.id, message: "Mensaje recibido." },
        { status: 201 },
      );
    } catch (dbError: any) {
      // 🔴 DEVOLVEMOS EL ERROR REAL PARA PODER DIAGNOSTICAR
      console.error("[/api/contact] DB Error:", dbError);
      const errorMsg = dbError?.message || String(dbError);
      const errorCode = dbError?.code || "UNKNOWN";
      return NextResponse.json(
        {
          error: `DB Error [${errorCode}]: ${errorMsg}`,
          stack: dbError?.stack?.split("\n").slice(0, 5).join(" | "),
        },
        { status: 500 },
      );
    }
  } catch (outerError: any) {
    console.error("[/api/contact] Outer error:", outerError);
    return NextResponse.json(
      { error: `Error: ${outerError?.message || String(outerError)}` },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/contact",
    method: "POST (multipart/form-data)",
    description: "Recibe mensajes del formulario de contacto.",
  });
}
