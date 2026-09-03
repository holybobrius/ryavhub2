import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuoteChip } from "./QuoteChip";

/**
 * Акцентная плашка с фразой из цитаты. Два тона: `default` (серая,
 * `--color-quote-chip-*`) и `primary` (фиолетовая, `*-primary`).
 */
const meta: Meta<typeof QuoteChip> = {
  title: "Quotes/QuoteChip",
  component: QuoteChip,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "primary"] },
    children: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof QuoteChip>;

export const Default: Story = {
  args: { tone: "default", children: "ты в муте" },
};

export const Primary: Story = {
  args: { tone: "primary", children: "ты в муте" },
};

/** Оба тона рядом — так видно разницу фона и рамки. */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-20">
      <QuoteChip>ты в муте</QuoteChip>
      <QuoteChip tone="primary">ты в муте</QuoteChip>
    </div>
  ),
};
