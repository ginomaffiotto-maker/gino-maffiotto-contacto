import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

/**
 * Crea el cliente Prisma apropiado según el entorno:
 * - Si DATABASE_URL empieza con "libsql:" → usa Turso (producción en Vercel).
 * - Si no → usa SQLite local (desarrollo).
 */
function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  // Turso / libSQL (producción en Vercel)
  if (url && url.startsWith("libsql:")) {
    const client = createClient({ url, authToken });
    const adapter = new PrismaLibSql(client);
    return new PrismaClient({ adapter });
  }

  // SQLite local (desarrollo)
  return new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
