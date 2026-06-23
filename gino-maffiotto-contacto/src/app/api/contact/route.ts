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
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo invalido" },
      { status: 400 },
    );
  }

  const nombre = String(form.get("nombre") || "").trim();
  const email = String(form.get("email") || "").trim();
  const asunto = String(form.get("asunto") || "").trim();
  const mensaje = String(form.get("mensaje") || "").trim();
  const enlaces = String(form.get("enlaces") || "").trim();
  const archivo = form.get("archivo");

  if (!nombre || !email || !mensaje) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
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
      { error: "Nombre muy corto" },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(emailLimpio)) {
    return NextResponse.json(
      { error: "Email invalido" },
      { status: 422 },
    );
  }
  if (mensajeLimpio.length < 5) {
    return NextResponse.json(
      { error: "Mensaje muy corto" },
      { status: 422 },
    );
  }

  let archivoNombre: string | null = null;
  if (archivo && archivo instanceof File && archivo.size > 0) {
    archivoNombre = archivo.name;
  }

  try {
    const registro = await db.contactMessage.create({
      data: {
        nombre: nombreLimpio,
        email: emailLimpio,
        asunto: asuntoLimpio || "Sin asunto",
        mensaje: mensajeLimpio,
        enlaces: enlacesLimpio || null,
        archivoPath: null,
        archivoNombre: archivoNombre,
      },
    });

    return NextResponse.json(
      { ok: true, id: registro.id, message: "Mensaje recibido correctamente" },
      { status: 201 },
    );
  } catch (dbError: any) {
    console.error("Error al guardar:", dbError);
    const codigo = dbError?.code || "UNKNOWN";
    const mensajeError = dbError?.message || String(dbError);
    return NextResponse.json(
      {
        error: "Error DB " + codigo + ": " + mensajeError,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/contact" });
}
