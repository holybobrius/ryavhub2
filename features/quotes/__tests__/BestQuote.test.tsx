import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BestQuote } from "../ui/BestQuote";
import type { Quote } from "../models";

const quote = (id: number, text: string): Quote => ({
  id,
  quote: text,
  quoteAuthor: { id: 1, name: "Автор" },
  date: new Date("2024-01-01"),
  upvotes: [],
  downvotes: [],
});

describe("BestQuote", () => {
  it("renders nothing without quotes", () => {
    const { container } = render(<BestQuote quotes={[]} />);

    expect(container.innerHTML).toBe("");
  });

  it("hides the arrows for a single winner", () => {
    const { getByText, queryByLabelText } = render(
      <BestQuote quotes={[quote(1, "Одна")]} />,
    );

    expect(getByText("Одна")).not.toBeNull();
    expect(queryByLabelText(/Следующая/)).toBeNull();
  });

  it("switches between winners", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(
      <BestQuote quotes={[quote(1, "Первая"), quote(2, "Вторая")]} />,
    );

    expect(getByText("Первая")).not.toBeNull();

    await user.click(getByLabelText(/Следующая/));
    expect(getByText("Вторая")).not.toBeNull();

    await user.click(getByLabelText(/Предыдущая/));
    expect(getByText("Первая")).not.toBeNull();
  });

  it("wraps around at both ends", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(
      <BestQuote
        quotes={[quote(1, "Первая"), quote(2, "Вторая"), quote(3, "Третья")]}
      />,
    );

    // назад с первой — попадаем на последнюю
    await user.click(getByLabelText(/Предыдущая/));
    expect(getByText("Третья")).not.toBeNull();

    // вперёд с последней — снова первая
    await user.click(getByLabelText(/Следующая/));
    expect(getByText("Первая")).not.toBeNull();
  });
});
