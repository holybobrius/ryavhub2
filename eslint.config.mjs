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
  {
    rules: {
      // В пресете Next это warning, а eslint с warning'ами выходит с кодом 0 —
      // то есть CI на них не падает и они копятся. Поднимаем до ошибки.
      // Префикс _ оставляет лазейку для намеренно неиспользуемых аргументов.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // console.error нужен серверным catch-блокам, запрещаем только отладочный шум.
      "no-console": ["error", { allow: ["error", "warn"] }],
    },
  },
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
