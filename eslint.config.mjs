import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Prettier plugin for formatting (must come before eslint-config-prettier)
  prettierPlugin,
  // Prettier config must be last to disable other configs that conflict
  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Сгенерированный Prisma-клиент — не наш код
    "lib/generated/**",
    // Сборка Storybook: минифицированные бандлы, линтить нечего
    // (в .gitignore он есть, но flat config его не читает)
    "storybook-static/**",
  ]),
]);

export default eslintConfig;
