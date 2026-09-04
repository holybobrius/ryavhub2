import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Foundations/Обзор",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const SEMANTIC_COLORS = [
  "bg-surface-bg-page",
  "bg-surface-bg-surface",
  "bg-surface-bg-surface-elevated",
  "bg-action-primary-bg-default",
  "bg-action-primary-bg-hover",
  "bg-accent-blue-fill-default",
  "bg-accent-cyan-fill-default",
  "bg-accent-green-fill-default",
];

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-16 bg-surface-bg-page p-40">
      {SEMANTIC_COLORS.map((c) => (
        <div key={c} className="flex flex-col gap-8">
          <div
            className={`${c} h-96 rounded-md border border-surface-border-default`}
          />
          <span className="font-body text-label-sm text-surface-text-secondary">
            {c}
          </span>
        </div>
      ))}
    </div>
  ),
};
