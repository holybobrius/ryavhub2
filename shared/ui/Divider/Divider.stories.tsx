import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Divider } from "./Divider";
import { Typography } from "../Typography";

const meta: Meta<typeof Divider> = {
  title: "UI/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    tone: { control: "inline-radio", options: ["default", "secondary"] },
  },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: { orientation: "horizontal", tone: "default" },
  render: (args) => (
    <div className="flex flex-col gap-24">
      <Typography.Body size="md">Текст над линией</Typography.Body>
      <Divider {...args} />
      <Typography.Body size="md">Текст под линией</Typography.Body>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      <Typography.Label size="sm" color="tertiary">
        default
      </Typography.Label>
      <Divider tone="default" />
      <Typography.Label size="sm" color="tertiary">
        secondary
      </Typography.Label>
      <Divider tone="secondary" />
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-40 items-center gap-16">
      <Typography.Body size="md">Слева</Typography.Body>
      <Divider {...args} />
      <Typography.Body size="md">Справа</Typography.Body>
    </div>
  ),
};
