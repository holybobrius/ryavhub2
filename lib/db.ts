import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const createClient = () =>
  new PrismaClient({
    adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ""),
  });

// В dev-режиме Next.js пересобирает модули при HMR, и без кэша в globalThis
// на каждый ребилд создавался бы новый PrismaClient со своим пулом соединений.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
