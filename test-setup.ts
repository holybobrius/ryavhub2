import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeEach } from "bun:test";

// Clean up after each test
beforeEach(() => {
  cleanup();
});
