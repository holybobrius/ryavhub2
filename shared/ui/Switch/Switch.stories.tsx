import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./Switch";

/**
 * Переключатель on/off — для мгновенных действий без подтверждения.
 * Состояния hover/pressed/focused — нативные.
 */
const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Playground: Story = {
  args: { label: "Уведомления" },
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex flex-col gap-16">
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
