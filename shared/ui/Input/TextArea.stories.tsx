import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

/**
 * Многострочное поле ввода — Input.TextArea. Тот же визуал, что у Input
 * (лейбл, состояния, хелпер, обязательная метка), плюс многострочность
 * с вертикальным ресайзом.
 */
const meta: Meta<typeof Input.TextArea> = {
  title: "UI/Input.TextArea",
  component: Input.TextArea,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    rows: { control: { type: "number", min: 2, max: 12 } },
    showCount: { control: "boolean" },
    maxLength: { control: "number" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Input.TextArea>;

export const Playground: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper Text",
    size: "md",
    rows: 3,
  },
};

export const Counter: Story = {
  name: "Счётчик символов",
  args: {
    label: "Отзыв",
    placeholder: "Placeholder",
    helperText: "Helper Text",
    showCount: true,
    maxLength: 280,
    defaultValue: "Съешь ещё этих мягких булок",
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-24">
      <Input.TextArea size="sm" label="Small" placeholder="Placeholder" />
      <Input.TextArea size="md" label="Default" placeholder="Placeholder" />
      <Input.TextArea size="lg" label="Large" placeholder="Placeholder" />
    </div>
  ),
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex flex-col gap-24">
      <Input.TextArea
        label="Default"
        placeholder="Placeholder"
        helperText="Helper Text"
      />
      <Input.TextArea
        label="Filled"
        defaultValue={"Многострочный\nтекст"}
        helperText="Helper Text"
      />
      <Input.TextArea
        label="Error"
        placeholder="Placeholder"
        helperText="Helper Text"
        error
      />
      <Input.TextArea
        label="Disabled"
        placeholder="Placeholder"
        helperText="Helper Text"
        disabled
      />
    </div>
  ),
};
