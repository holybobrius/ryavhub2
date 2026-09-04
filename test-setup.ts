import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const { window } = dom;

(globalThis as unknown as { window: unknown }).window = window;
(globalThis as unknown as { document: unknown }).document = window.document;

for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue;
  const descriptor = Object.getOwnPropertyDescriptor(window, key);
  if (descriptor) Object.defineProperty(globalThis, key, descriptor);
}

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeEach } from "bun:test";

beforeEach(() => {
  cleanup();
});
