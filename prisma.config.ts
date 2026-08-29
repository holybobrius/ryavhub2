import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `prisma generate` не подключается к БД, но конфиг требует url всегда —
    // плейсхолдер нужен для CI, где DATABASE_URL не задан.
    url: process.env.DATABASE_URL ?? "mysql://placeholder:3306/placeholder",
  },
});
