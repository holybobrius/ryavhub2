import { JSDOM } from "jsdom";

// bun test не даёт DOM из коробки. Регистрируем jsdom глобально,
// чтобы работали @testing-library/react и рендер компонентов.
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const { window } = dom;

// window/document в bun не определены — их присваиваем напрямую.
(globalThis as unknown as { window: unknown }).window = window;
(globalThis as unknown as { document: unknown }).document = window.document;

// Прочие DOM-глобалы (HTMLElement, Node, getComputedStyle, …) копируем
// в globalThis, не перетирая уже существующие (например, navigator).
for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue;
  const descriptor = Object.getOwnPropertyDescriptor(window, key);
  if (descriptor) Object.defineProperty(globalThis, key, descriptor);
}

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeEach } from "bun:test";

// Clean up after each test
beforeEach(() => {
  cleanup();
});
