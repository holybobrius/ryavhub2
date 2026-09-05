import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuoteMarquee } from "./QuoteMarquee";

const meta: Meta<typeof QuoteMarquee> = {
  title: "Quotes/QuoteMarquee",
  component: QuoteMarquee,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    durationSec: { control: { type: "range", min: 10, max: 120, step: 5 } },
  },
};
export default meta;

type Story = StoryObj<typeof QuoteMarquee>;

export const Default: Story = {};

export const Fast: Story = {
  args: { durationSec: 12 },
};

export const CustomPhrases: Story = {
  args: {
    phrases: ["раз", "два слова", "три коротких слова", "ещё", "и ещё", "всё"],
  },
};
