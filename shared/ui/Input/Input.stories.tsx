import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

/**
 * Текстовое поле ввода. Поддержка лейбла, иконок слева и справа,
 * плейсхолдера, хелпера и обязательной метки. Оси: size (sm/md/lg).
 * Состояния hover/focused — нативные (наведи/поставь курсор); error и
 * disabled — пропы. Всё на токенах инпута.
 */
const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  // Инпут по ширине тянется на 100% — ограничиваем контейнером.
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
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20l-3.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Интерактивная стори — первой, чтобы autodocs показал её сверху с контролами.
export const Playground: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper Text",
    size: "md",
    leftIcon: <SearchIcon />,
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-24">
      <Input
        size="sm"
        label="Small"
        placeholder="Placeholder"
        helperText="Helper Text"
        leftIcon={<SearchIcon />}
      />
      <Input
        size="md"
        label="Default"
        placeholder="Placeholder"
        helperText="Helper Text"
        leftIcon={<SearchIcon />}
      />
      <Input
        size="lg"
        label="Large"
        placeholder="Placeholder"
        helperText="Helper Text"
        leftIcon={<SearchIcon />}
      />
    </div>
  ),
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex flex-col gap-24">
      <Input
        label="Default"
        placeholder="Placeholder"
        helperText="Helper Text"
        leftIcon={<SearchIcon />}
      />
      <Input
        label="Filled"
        defaultValue="Значение"
        helperText="Helper Text"
        leftIcon={<SearchIcon />}
      />
      <Input
        label="Error"
        placeholder="Placeholder"
        helperText="Helper Text"
        error
        leftIcon={<SearchIcon />}
      />
      <Input
        label="Disabled"
        placeholder="Placeholder"
        helperText="Helper Text"
        disabled
        leftIcon={<SearchIcon />}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Иконки и метки",
  render: () => (
    <div className="flex flex-col gap-24">
      <Input
        label="Иконка слева"
        placeholder="Поиск"
        leftIcon={<SearchIcon />}
      />
      <Input
        label="Иконка справа"
        placeholder="Поиск"
        rightIcon={<SearchIcon />}
      />
      <Input
        label="Обязательное поле"
        placeholder="Placeholder"
        helperText="Helper Text"
        required
      />
    </div>
  ),
};
