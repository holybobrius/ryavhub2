import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";
import { makeIcon } from "./makeIcon";

const DATA = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>`;

describe("makeIcon", () => {
  it("builds a component that renders the bound SVG data", () => {
    const Demo = makeIcon(DATA);
    const { container } = render(<Demo />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("circle")).not.toBeNull();
  });

  it("forwards size and title to the underlying Icon", () => {
    const Demo = makeIcon(DATA);
    const { container } = render(<Demo size={16} title="Демо" />);
    const span = container.firstElementChild as HTMLElement;
    expect(span.style.width).toBe("16px");
    expect(span.getAttribute("role")).toBe("img");
    expect(span.getAttribute("aria-label")).toBe("Демо");
  });
});
