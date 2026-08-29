import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";
import type { SelectOption } from "./Select";

/**
 * Выпадающий список на Ariakit (headless: a11y, клавиатура, позиционирование),
 * стилизованный нашими токенами. Режимы: обычный, с поиском (searchable),
 * мультивыбор чекбоксами (multiple) и мультивыбор тегами (multiple + tags).
 * Триггер — тот же визуал, что у Input.
 */
const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    tags: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

const Dot = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="6" />
  </svg>
);

const OPTIONS: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
  { value: "qwik", label: "Qwik", disabled: true },
];

const ICON_OPTIONS: SelectOption[] = OPTIONS.map((o) => ({
  ...o,
  icon: <Dot />,
}));

export const Playground: Story = {
  args: {
    options: OPTIONS,
    label: "Label",
    placeholder: "Select option",
    helperText: "Helper Text",
    size: "md",
  },
};

export const Single: Story = {
  name: "Обычный",
  args: {
    options: OPTIONS,
    label: "Фреймворк",
    helperText: "Helper Text",
  },
};

export const Searchable: Story = {
  name: "С поиском",
  args: {
    options: OPTIONS,
    label: "Фреймворк",
    helperText: "Helper Text",
    searchable: true,
  },
};

export const MultiCheckbox: Story = {
  name: "Мультивыбор (чекбоксы)",
  args: {
    options: OPTIONS,
    label: "Фреймворки",
    helperText: "Helper Text",
    multiple: true,
  },
};

export const MultiTags: Story = {
  name: "Мультивыбор (теги)",
  args: {
    options: OPTIONS,
    label: "Фреймворки",
    helperText: "Helper Text",
    multiple: true,
    tags: true,
    defaultValue: ["react", "svelte"],
  },
};

export const WithIcons: Story = {
  name: "С иконками",
  args: {
    options: ICON_OPTIONS,
    label: "Фреймворк",
    helperText: "Helper Text",
  },
};
