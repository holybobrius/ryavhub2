import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as Icons from "./index";
import { Icon } from "./index";
import { Typography } from "../Typography";

const meta: Meta = {
  title: "UI/Icons",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

type IconCmp = (props: { size?: number; title?: string }) => React.ReactElement;

const CURATED = Object.entries(Icons)
  .filter(
    ([name, value]) =>
      name.startsWith("Icon") && name !== "Icon" && typeof value === "function",
  )
  .sort(([a], [b]) => a.localeCompare(b)) as [string, IconCmp][];

export const Gallery: Story = {
  render: () => (
    <div
      className="grid gap-8"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
    >
      {CURATED.map(([name, IconCmp]) => (
        <div
          key={name}
          title={name}
          className="flex flex-col items-center gap-8 p-12 text-surface-text-base"
          style={{
            border: "1px solid var(--color-surface-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <IconCmp size={24} />
          <span className="text-label-sm text-surface-text-secondary">
            {name.replace(/^Icon/, "")}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const SizesAndColor: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      <div className="flex items-center gap-24">
        <Icons.IconChevronDown size={16} />
        <Icons.IconChevronDown size={24} />
        <Icons.IconChevronDown size={32} />
        <Icons.IconChevronDown size={40} />
      </div>
      <div className="flex items-center gap-24">
        <Typography.Body size="md" color="base">
          <Icons.IconCheck size={24} /> base
        </Typography.Body>
        <span className="text-action-primary-bg-default">
          <Icons.IconCheck size={24} /> primary
        </span>
        <span className="text-surface-text-secondary">
          <Icons.IconCheck size={24} /> secondary
        </span>
      </div>
    </div>
  ),
};

export const CustomSvg: Story = {
  render: () => {
    const sample = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    return <Icon data={sample} size={32} title="chevron" />;
  },
};
