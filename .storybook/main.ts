import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  // Стори лежат рядом с компонентами (features/*, shared/*), а не в отдельной папке —
  // так их проще держать в синхроне с кодом.
  stories: [
    "../shared/**/*.stories.@(ts|tsx)",
    "../features/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    // Vite-билдер: сам подхватывает postcss.config.mjs → Tailwind v4 и токены
    // работают без доп. настройки. Плюс моки next/image и поддержка next/font.
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default config;
