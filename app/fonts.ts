import { Geologica } from "next/font/google";
import localFont from "next/font/local";

export const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

// PT Root UI содержит 300/400/500/700: у токена --font-weight-semibold (600)
// точного начертания нет, браузер подставит 700.
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
