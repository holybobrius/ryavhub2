import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";

import { IconChevronDown } from "./index";

describe("generated icons barrel", () => {
  it("exports a working component wired to real stratis data", () => {
    const { container } = render(<IconChevronDown size={20} />);
    const span = container.firstElementChild as HTMLElement;
    expect(container.querySelector("svg")).not.toBeNull();
    expect(span.style.width).toBe("20px");
  });
});
