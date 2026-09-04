import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

const SAMPLE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12h16"/></svg>`;

describe("Icon", () => {
  it("renders the provided SVG markup", () => {
    const { container } = render(<Icon data={SAMPLE} />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("path")).not.toBeNull();
  });

  it("applies the size to width and height", () => {
    const { container } = render(<Icon data={SAMPLE} size={20} />);
    const span = container.firstElementChild as HTMLElement;
    expect(span.style.width).toBe("20px");
    expect(span.style.height).toBe("20px");
  });

  it("is decorative (aria-hidden, no role) by default", () => {
    const { container } = render(<Icon data={SAMPLE} />);
    const span = container.firstElementChild as HTMLElement;
    expect(span.getAttribute("aria-hidden")).toBe("true");
    expect(span.getAttribute("role")).toBeNull();
  });

  it("becomes semantic (role=img, aria-label) when a title is given", () => {
    const { container } = render(<Icon data={SAMPLE} title="Меню" />);
    const span = container.firstElementChild as HTMLElement;
    expect(span.getAttribute("role")).toBe("img");
    expect(span.getAttribute("aria-label")).toBe("Меню");
    expect(span.getAttribute("aria-hidden")).toBeNull();
  });

  it("merges a custom className with the base class", () => {
    const { container } = render(<Icon data={SAMPLE} className="text-red" />);
    const span = container.firstElementChild as HTMLElement;
    expect(span.classList.contains("icon")).toBe(true);
    expect(span.classList.contains("text-red")).toBe(true);
  });
});
