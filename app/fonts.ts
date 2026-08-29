import { Geologica } from "next/font/google";
import localFont from "next/font/local";

// Единый источник шрифтов для приложения и Storybook.
// next/font кладёт CSS-переменные на элемент, которому мы дадим className,
// а styles/theme.css ссылается на них из --font-heading / --font-body.

// Geologica (заголовки) — из Google Fonts, скачивается на этапе build.
export const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

// PT Root UI (текст) — локальные woff2 из app/fonts/.
// Шрифт содержит 300/400/500/700; токен --font-weight-semibold (600) точного
// начертания не имеет — браузер подставит ближайшее (700). См. заметку в CLAUDE.md.
export const ptRootUI = localFont({
  variable: "--font-pt-root-ui",
  display: "swap",
  src: [
    { path: "./fonts/pt-root-ui-light.woff2", weight: "300", style: "normal" },
    {
      path: "./fonts/pt-root-ui-regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "./fonts/pt-root-ui-medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/pt-root-ui-bold.woff2", weight: "700", style: "normal" },
  ],
});
