import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { YearDivider } from "./YearDivider";

/**
 * Заголовок года для списка цитат: крупная цифра + линия на всю оставшуюся
 * ширину, обе в цвете `--color-year-divider-color`.
 */
const meta: Meta<typeof YearDivider> = {
  title: "Quotes/YearDivider",
  component: YearDivider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: { year: { control: "text" } },
};
export default meta;

type Story = StoryObj<typeof YearDivider>;

export const Default: Story = {
  args: { year: 2026 },
};

/** Несколько лет подряд — как это будет выглядеть в списке. */
export const InAList: Story = {
  render: () => (
    <div className="flex flex-col gap-40">
      {[2026, 2025, 2024].map((year) => (
        <YearDivider key={year} year={year} />
      ))}
    </div>
  ),
};
