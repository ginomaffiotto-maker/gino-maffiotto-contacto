"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Linkedin,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  MessageSquareHeart,
  HardHat,
  Package,
  Wrench,
  Instagram,
  MessageCircle,
  Paperclip,
  Link2,
  X,
  Download,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Datos de contacto
// ---------------------------------------------------------------------------
const CONTACT = {
  nombre: "Gino Maffiotto",
  rol: "Ejecutivo Comercial & Presupuestista · Soluciones Metálicas",
  empresa: "Montajes2002 · MN",
  ubicacion: "Estados Unidos 2426, Montevideo",
  ubicacionCompleta:
    "Estados Unidos 2426, 12800 Montevideo, Departamento de Montevideo, Uruguay",
  zonaHoraria: "GMT-3 (Uruguay)",
  email: "gino@mn.com.uy",
  telefono: "+598 93 472 630",
  telefonoHref: "+59893472630",
  sitioWeb: "https://montajes2002.com/mnweb/",
  sitioWebCorto: "montajes2002.com/mnweb",
  resumen:
    "Ejecutivo comercial y presupuestista especializado en soluciones metálicas para la industria y la construcción. Desarrollo y gestión de proyectos de fabricación y montaje de estructuras metálicas, con acompañamiento integral desde el diseño hasta la entrega llave en mano. Desarrollo de productos para la industria y el hogar.",
  resumen2:
    "Acompaño a constructoras, industrias y empresas de servicios y mantenimiento a cumplir sus objetivos con soluciones metálicas personalizadas — ajustadas a presupuesto, plazos exigentes y altos estándares de calidad.",
  disponibilidad: "Disponible para nuevos proyectos y presupuestos",
  whatsapp: "+598 93 472 630",
  whatsappUrl:
    "https://wa.me/59893472630?text=" +
    encodeURIComponent(
      "¡Hola Gino! Vi tu página de contacto y quisiera consultar sobre un proyecto de soluciones metálicas.",
    ),
  social: [
    {
      nombre: "LinkedIn",
      url: "https://www.linkedin.com/in/gino-maffiotto",
      icon: Linkedin,
      handle: "/in/gino-maffiotto",
    },
    {
      nombre: "Instagram",
      url: "https://www.instagram.com/montajesnunez/",
      icon: Instagram,
      handle: "@montajesnunez",
    },
    {
      nombre: "Sitio web",
      url: "https://montajes2002.com/mnweb/",
      icon: Globe,
      handle: "montajes2002.com",
    },
  ],
  catalogo: [
    {
      nombre: "Catálogo de productos",
      url: "https://www.montajes2002.com/tienda",
      icon: Package,
      descripcion: "Tienda online de productos y soluciones metálicas",
    },
    {
      nombre: "Servicios",
      url: "https://montajes2002.com/mnweb/nuestros-servicios/",
      icon: Wrench,
      descripcion: "Fabricación, montaje y soluciones a medida",
    },
  ],
};

// Métodos de contacto directo
const METODOS = [
  {
    etiqueta: "Correo electrónico",
    valor: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
    descripcion: "Respuesta en ~24 h hábiles",
  },
  {
    etiqueta: "Teléfono",
    valor: CONTACT.telefono,
    href: `tel:${CONTACT.telefonoHref}`,
    icon: Phone,
    descripcion: "Lun a Vie, 8:00–12:00 y 13:00–17:00",
  },
  {
    etiqueta: "Ubicación",
    valor: CONTACT.ubicacion,
    href: `https://maps.google.com/?q=${encodeURIComponent(
      CONTACT.ubicacionCompleta,
    )}`,
    icon: MapPin,
    descripcion: "Uruguay · " + CONTACT.zonaHoraria,
  },
];

// Pequeño helper para animaciones de entrada
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [archivoNombre, setArchivoNombre] = React.useState<string | null>(null);

  async function handleShare() {
    const shareData = {
      title: "Gino Maffiotto · Soluciones Metálicas",
      text: "Ejecutivo comercial y presupuestista especializado en soluciones metálicas para la industria y la construcción. ¡Consultá tu presupuesto sin compromiso!",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Enlace copiado al portapapeles. ¡Pégalo donde quieras!");
      } else {
        toast.info("Copia el enlace de la barra del navegador.");
      }
    } catch {
      // El usuario canceló el share — no mostramos error
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const mensaje = String(data.get("mensaje") ?? "").trim();
    const archivo = data.get("archivo");

    if (!nombre || !email || !mensaje) {
      toast.error("Por favor completa nombre, email y mensaje.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      toast.error("El email no parece válido. Revísalo por favor.");
      return;
    }
    if (archivo && archivo instanceof File && archivo.size > 8 * 1024 * 1024) {
      toast.error("El archivo supera el máximo de 8 MB.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo enviar el mensaje.");
      }
      setEnviado(true);
      form.reset();
      setArchivoNombre(null);
      toast.success("¡Mensaje enviado! Te responderé pronto. 🎉");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Hubo un problema al enviar.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Fondo: imagen industrial + overlays decorativos */}
      <BackgroundDecor />

      {/* Botón flotante de WhatsApp */}
      <a
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-110 hover:bg-[#1ebe5d]"
      >
        <MessageCircle className="size-7" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-40" />
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105">
              GM
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              {CONTACT.nombre}
            </span>
          </a>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              <a href="#contacto">Solicitar presupuesto</a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main id="top" className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          {/* HERO */}
          <motion.section
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-orange-400/40 via-amber-400/30 to-orange-300/30 blur-2xl" />
              <div className="relative size-36 overflow-hidden rounded-full shadow-lg ring-4 ring-background sm:size-44">
                <Image
                  src="/perfil-gino.png"
                  alt="Foto de perfil de Gino Maffiotto"
                  fill
                  className="object-cover"
                  priority
                  sizes="11rem"
                />
              </div>
              <span className="absolute bottom-2 right-2 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                <span className="size-2 rounded-full bg-white" />
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl"
            >
              {CONTACT.nombre}
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-3 text-base text-muted-foreground sm:text-lg"
            >
              {CONTACT.rol}
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {CONTACT.disponibilidad}
            </motion.div>

            <motion.p
              custom={4}
              variants={fadeUp}
              className="mt-6 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {CONTACT.resumen}
            </motion.p>
            <motion.p
              custom={5}
              variants={fadeUp}
              className="mt-3 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {CONTACT.resumen2}
            </motion.p>

            <motion.div
              custom={6}
              variants={fadeUp}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-6">
                <a href="#contacto">
                  <MessageSquareHeart className="size-4" />
                  Solicitar presupuesto
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#25D366] px-6 text-white hover:bg-[#1ebe5d]"
              >
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Escríbeme por WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6"
              >
                <a
                  href={CONTACT.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="size-4" />
                  Ver sitio de la empresa
                </a>
              </Button>
            </motion.div>
          </motion.section>

          {/* MÉTODOS DE CONTACTO */}
          <section className="mt-14 sm:mt-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-end justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Formas de contacto
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige la que te resulte más cómoda. ¡Responderé lo antes
                  posible!
                </p>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {METODOS.map((m, i) => (
                <motion.a
                  key={m.etiqueta}
                  href={m.href}
                  target={m.etiqueta === "Ubicación" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group"
                >
                  <Card className="h-full bg-background/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg">
                    <CardContent className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/20">
                        <m.icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {m.etiqueta}
                        </p>
                        <p className="mt-0.5 truncate font-semibold">
                          {m.valor}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {m.descripcion}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-500" />
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>

            {/* Enlaces online */}
            <div className="mt-4">
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Encuéntrame en línea
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {CONTACT.social.map((s) => (
                      <Button
                        key={s.nombre}
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <s.icon className="size-4" />
                          <span className="hidden sm:inline">{s.nombre}</span>
                          <span className="text-muted-foreground">
                            {s.handle}
                          </span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CATÁLOGOS Y SERVICIOS */}
          <section className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {CONTACT.catalogo.map((c, i) => (
                <motion.a
                  key={c.nombre}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group"
                >
                  <Card className="h-full bg-background/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg">
                    <CardContent className="flex items-center gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm">
                        <c.icon className="size-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{c.nombre}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {c.descripcion}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-500" />
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>
          </section>

          {/* FORMULARIO DE CONTACTO */}
          <section id="contacto" className="mt-14 scroll-mt-20 sm:mt-20">
            <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.1fr]">
              {/* Columna informativa */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <h2 className="text-xl font-semibold sm:text-2xl">
                  Cuéntame tu proyecto
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  ¿Tienes una necesidad metálica en mente o quieres solicitar un
                  presupuesto? Rellena el formulario y te responderé por correo
                  con una propuesta a medida.
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong className="font-medium">
                        Presupuestos a medida.
                      </strong>{" "}
                      Análisis detallado de tu necesidad y presupuesto sin
                      compromiso.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong className="font-medium">Plazos exigentes.</strong>{" "}
                      Coordinación de fabricación y montaje para cumplir tus
                      tiempos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong className="font-medium">Alta calidad.</strong>{" "}
                      Soluciones metálicas personalizadas con estándares
                      rigurosos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong className="font-medium">
                        Acompañamiento integral.
                      </strong>{" "}
                      Desde el diseño y la ingeniería hasta la entrega llave en
                      mano.
                    </span>
                  </li>
                </ul>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-4 backdrop-blur">
                  <Clock className="size-5 shrink-0 text-orange-600 dark:text-orange-400" />
                  <div className="text-sm">
                    <p className="font-medium">Horario de atención</p>
                    <p className="text-muted-foreground">
                      Lunes a Viernes · 8:00 – 12:00 y 13:00 – 17:00 ({" "}
                      {CONTACT.zonaHoraria})
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-4 backdrop-blur">
                  <HardHat className="size-5 shrink-0 text-orange-600 dark:text-orange-400" />
                  <div className="text-sm">
                    <p className="font-medium">Sector</p>
                    <p className="text-muted-foreground">
                      Industria & Construcción · Estructuras metálicas
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Formulario */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Card className="h-full bg-background/85 backdrop-blur">
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Solicitud de presupuesto / contacto
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Todos los campos marcados son obligatorios.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            placeholder="Tu nombre o empresa"
                            autoComplete="name"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="asunto">Asunto</Label>
                        <Input
                          id="asunto"
                          name="asunto"
                          placeholder="Ej: Presupuesto estructura metálica, consulta de montaje…"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="mensaje">Mensaje</Label>
                        <Textarea
                          id="mensaje"
                          name="mensaje"
                          placeholder="Describe tu necesidad: tipo de solución, dimensiones, plazos, ubicación de la obra…"
                          rows={5}
                          required
                          className="resize-y"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
                        <div className="space-y-1.5">
                          <Label htmlFor="enlaces">Enlaces (opcional)</Label>
                          <div className="relative">
                            <Link2 className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Textarea
                              id="enlaces"
                              name="enlaces"
                              placeholder="Planos, referencias, Drive/Dropbox… (uno por línea)"
                              rows={2}
                              className="h-[60px] resize-none pl-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="archivo">Archivo (opcional)</Label>
                          <label
                            htmlFor="archivo"
                            className="flex h-[60px] cursor-pointer items-center gap-2.5 rounded-md border border-dashed border-border bg-muted/40 px-3 text-sm transition-colors hover:border-orange-500/50 hover:bg-muted/60"
                          >
                            <Paperclip className="size-4 shrink-0 text-orange-600 dark:text-orange-400" />
                            <span className="min-w-0 flex-1 truncate text-muted-foreground">
                              {archivoNombre
                                ? archivoNombre
                                : "Adjuntar (PDF, img, DWG, ZIP · 8 MB)"}
                            </span>
                            {archivoNombre && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setArchivoNombre(null);
                                  const input = document.getElementById(
                                    "archivo",
                                  ) as HTMLInputElement | null;
                                  if (input) input.value = "";
                                }}
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                aria-label="Quitar archivo"
                              >
                                <X className="size-3.5" />
                              </button>
                            )}
                          </label>
                          <input
                            id="archivo"
                            name="archivo"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              setArchivoNombre(f ? f.name : null);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                          Al enviar aceptas ser contactado por email.
                        </p>
                        <Button
                          type="submit"
                          disabled={enviando || enviado}
                          className="w-full sm:w-auto"
                        >
                          {enviando ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Enviando…
                            </>
                          ) : enviado ? (
                            <>
                              <CheckCircle2 className="size-4" />
                              ¡Enviado!
                            </>
                          ) : (
                            <>
                              <Send className="size-4" />
                              Enviar mensaje
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Botones finales: descargar tarjeta + compartir página */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2 rounded-full">
              <a href="/download/tarjeta-gino-maffiotto.jpg" download>
                <Download className="size-4" />
                Descargar tarjeta
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 rounded-full"
            >
              <Share2 className="size-4" />
              Compartir página
            </Button>
          </div>
        </div>
      </main>

      {/* Footer (sticky al fondo) */}
      <footer className="relative z-10 mt-auto border-t border-border/40 bg-background/70 backdrop-blur">
        {/* Botón tortuga: descarga del código fuente (fijo en la parte inferior izquierda del footer) */}
        <a
          href="/download/gino-maffiotto-contacto.zip"
          download
          aria-label="Descargar código fuente del proyecto"
          title="Descargar código fuente"
          className="absolute bottom-3 left-3 z-20 flex size-9 items-center justify-center rounded-full border border-border/50 bg-background/70 text-base backdrop-blur transition-all hover:scale-110 hover:border-orange-500/50 hover:bg-background/95"
        >
          🐢
        </a>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>
            © {new Date().getFullYear()} {CONTACT.nombre} · {CONTACT.empresa}.
            Montevideo, Uruguay.
          </p>
          <div className="flex items-center gap-3">
            {CONTACT.social.map((s) => (
              <a
                key={s.nombre}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.nombre}
                className="text-muted-foreground transition-colors hover:text-orange-500"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fondo: imagen industrial oscurecida + overlays de color + grid sutil
// ---------------------------------------------------------------------------
function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      {/* Imagen de fondo industrial */}
      <Image
        src="/fondo-industrial-v2.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay para garantizar legibilidad del texto (suave en claro, más fuerte en oscuro) */}
      <div className="absolute inset-0 bg-background/55 dark:bg-background/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/85 dark:from-background/55 dark:via-background/80 dark:to-background/95" />
      {/* Blobs de color de acento */}
      <div className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/10" />
      <div className="absolute top-1/3 -right-24 size-[26rem] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" />
      <div className="absolute bottom-0 left-1/4 size-[24rem] rounded-full bg-orange-300/15 blur-3xl dark:bg-orange-500/10" />
      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
