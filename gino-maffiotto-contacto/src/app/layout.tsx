import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contacto | Gino Maffiotto",
  description:
    "Gino Maffiotto — Ejecutivo comercial y presupuestista de soluciones metálicas para la industria y la construcción. Contacto, email, teléfono y ubicación en Montevideo, Uruguay.",
  keywords: [
    "Gino Maffiotto",
    "soluciones metálicas",
    "estructuras metálicas",
    "presupuestista",
    "ejecutivo comercial",
    "Montevideo",
    "Uruguay",
    "fabricación y montaje",
  ],
  authors: [{ name: "Gino Maffiotto" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Contacto | Gino Maffiotto",
    description:
      "Ejecutivo comercial y presupuestista de soluciones metálicas para la industria y la construcción.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Sonner position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
