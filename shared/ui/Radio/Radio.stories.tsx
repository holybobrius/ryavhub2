import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "UI/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Playground: Story = {
  args: { label: "Option label", name: "demo" },
};

export const Group: Story = {
  name: "Группа",
  render: () => (
    <div className="flex flex-col gap-16">
      <Radio name="fw" value="react" label="React" defaultChecked />
      <Radio name="fw" value="vue" label="Vue" />
      <Radio name="fw" value="svelte" label="Svelte" />
      <Radio name="fw" value="solid" label="Solid" disabled />
    </div>
  ),
};
