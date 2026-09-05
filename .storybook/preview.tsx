import React from "react";
import type { Preview } from "@storybook/nextjs-vite";

import { geologica, ptRootUI } from "../app/fonts";
import { ryavTheme } from "./theme";

import "../app/globals.css";

// Переменные шрифтов вешаем на <html>, как в app/layout.tsx, а не на обёртку
// стори. --font-heading объявлена в @theme, то есть на :root, а var() в
// кастомном свойстве подставляется на элементе объявления: будь --font-geologica
// ниже по дереву, значение схлопнулось бы в пустоту и заголовки рендерились бы
// телесным шрифтом. Бонусом шрифты достаются и портальному контенту (модалки,
// меню, тултипы) — он живёт в body, вне декоратора.
if (typeof document !== "undefined") {
  document.documentElement.classList.add(geologica.variable, ptRootUI.variable);
}

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    docs: { theme: ryavTheme },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-bg-page text-surface-text-base rounded-md p-24">
        <Story />
      </div>
    ),
  ],
};

export default preview;
