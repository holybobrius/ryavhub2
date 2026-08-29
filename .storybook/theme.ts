import { create } from "storybook/theming/create";

// Тёмная тема обвязки Storybook (сайдбар, тулбар, Docs-страница).
// Хекс-значения захардкожены из токенов: UI менеджера живёт ВНЕ preview-iframe,
// где наши CSS-переменные @theme недоступны, поэтому var(--color-*) тут нельзя.
export const ryavTheme = create({
  base: "dark",
  brandTitle: "RYAV.HUB",

  colorPrimary: "rgb(112, 84, 229)", // purple-400
  colorSecondary: "rgb(112, 84, 229)", // purple-400 — акцент/выделение

  appBg: "rgb(11, 11, 11)", // neutral-1000
  appContentBg: "rgb(15, 15, 15)", // neutral-900 (surface)
  appPreviewBg: "rgb(15, 15, 15)",
  appBorderColor: "rgb(27, 27, 27)", // neutral-800
  appBorderRadius: 8,

  textColor: "rgb(255, 255, 255)", // neutral-100
  textMutedColor: "rgb(196, 196, 196)", // neutral-300

  barBg: "rgb(11, 11, 11)", // neutral-1000
  barTextColor: "rgb(196, 196, 196)",
  barSelectedColor: "rgb(112, 84, 229)",

  inputBg: "rgb(15, 15, 15)",
  inputBorder: "rgb(46, 46, 46)", // neutral-700
  inputTextColor: "rgb(255, 255, 255)",

  fontBase: '"Geologica", system-ui, sans-serif',
});
