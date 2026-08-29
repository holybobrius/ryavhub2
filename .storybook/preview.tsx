import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
// Тот же модуль шрифтов, что и в приложении (app/fonts.ts) — единый источник.
import { geologica, ptRootUI } from "../app/fonts";
// Импорт глобальных стилей поднимает всю цепочку @theme: сброс дефолтов Tailwind,
// токены дизайнера и наши переопределения. Без этой строки классов бы не было.
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    // Фон задаём декоратором ниже (тёмная тема), дефолтный отключаем.
    backgrounds: { disable: true },
  },
  decorators: [
    // Дизайн-система тёмная. На вкладке Docs каждая стори рендерится в
    // отдельном блоке, куда фон из globals.css (он на body) не доходит —
    // поэтому фон, цвет текста и переменные шрифтов вешаем обёрткой на стори.
    (Story) => (
      <div
        className={`${geologica.variable} ${ptRootUI.variable} bg-surface-bg-page text-surface-text-base rounded-md p-24`}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
