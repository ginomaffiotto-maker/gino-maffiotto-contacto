import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Límites de longitud para campos de texto
const MAX_NOMBRE = 120;
const MAX_ASUNTO = 200;
const MAX_MENSAJE = 5000;
const MAX_ENLACES = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Límites para archivos adjuntos
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "contact");
const ALLOWED_EXT = [
  ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".doc", ".docx", ".xls", ".xlsx", ".dwg", ".dxf", ".zip", ".rar",
];

function sanitize(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function getExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido (se esperaba multipart/form-data)." },
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
      { error: "Faltan campos obligatorios (nombre, email y mensaje)." },
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
    return NextResponse.json({ error: "El email no es válido." }, { status: 422 });
  }
  if (mensajeLimpio.length < 5) {
    return NextResponse.json(
      { error: "El mensaje es demasiado corto." },
      { status: 422 },
    );
  }

  // Procesar archivo adjunto (opcional)
  // ⚠️ En Vercel (producción) el filesystem es READ-ONLY, así que no podemos
  // guardar archivos en disco. Los guardamos solo en desarrollo local.
  let archivoPath: string | null = null;
  let archivoNombre: string | null = null;
  const isProduction =
    process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  if (archivo && archivo instanceof File && archivo.size > 0) {
    if (archivo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo de 8 MB." },
        { status: 422 },
      );
    }
    const ext = getExt(archivo.name);
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        {
          error:
            "Tipo de archivo no permitido. Formatos aceptados: PDF, imágenes, Office, DWG/DXF, ZIP.",
        },
        { status: 422 },
      );
    }

    // Guardar el archivo SOLO en desarrollo local (Vercel es read-only)
    if (!isProduction) {
      try {
        await mkdir(UPLOAD_DIR, { recursive: true });
        const safeName = `${randomUUID()}${ext}`;
        const fullPath = path.join(UPLOAD_DIR, safeName);
        const buffer = Buffer.from(await archivo.arrayBuffer());
        await writeFile(fullPath, buffer);
        archivoPath = `/uploads/contact/${safeName}`;
        archivoNombre = archivo.name;
      } catch (err) {
        console.error("[/api/contact] Error al guardar archivo:", err);
        archivoNombre = archivo.name;
      }
    } else {
      // En producción (Vercel): no podemos escribir en disco.
      archivoNombre = archivo.name;
    }
  }

  try {
    const registro = await db.contactMessage.create({
      data: {
        nombre: nombreLimpio,
        email: emailLimpio,
        asunto: asuntoLimpio || "(Sin asunto)",
        mensaje: mensajeLimpio,
        enlaces: enlacesLimpio || null,
        archivoPath,
        archivoNombre,
      },
    });

    return NextResponse.json(
      { ok: true, id: registro.id, message: "Mensaje recibido correctamente." },
      { status: 201 },
    );
  } catch (error) {
    console.error("[/api/contact] Error al guardar el mensaje:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje. Inténtalo más tarde." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/contact",
    method: "POST (multipart/form-data)",
    description: "Recibe mensajes del formulario de contacto con archivo opcional.",
    fields: ["nombre", "email", "asunto?", "mensaje", "enlaces?", "archivo?"],
    maxFileSize: "8 MB",
    allowedExtensions: ALLOWED_EXT,
  });
}
