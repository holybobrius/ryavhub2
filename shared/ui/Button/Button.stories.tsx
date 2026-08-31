import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { Typography } from "../Typography";
import { IconPencil } from "../icons";
import type { ButtonTone, ButtonVariant } from "./Button";

/**
 * Основной интерактивный элемент. Поддержка текста, иконок слева и справа,
 * аватара. Оси: variant (filled/outlined/ghost/soft), tone (primary/
 * secondary/tertiary/error), size (sm/md/lg). Состояния hover/pressed/
 * focused/disabled — нативные (наведи/нажми/таб). Всё на токенах кнопки.
 */
const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["filled", "outlined", "ghost", "soft"],
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary", "error"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const DemoAvatar = () => (
  <span
    aria-hidden="true"
    className="block h-full w-full bg-action-primary-bg-default"
  />
);

const VARIANTS: ButtonVariant[] = ["filled", "outlined", "ghost", "soft"];
const TONES: ButtonTone[] = ["primary", "secondary", "tertiary", "error"];

// Интерактивная стори с контролами (наведи/нажми/таб для состояний).
export const Playground: Story = {
  args: {
    children: "button",
    variant: "filled",
    tone: "primary",
    size: "md",
    leftIcon: <IconPencil />,
    rightIcon: <IconPencil />,
  },
};

// Матрица tone × variant — как во фрейме Figma.
export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-8">
          <Typography.Label size="xs" color="tertiary" className="uppercase">
            {variant}
          </Typography.Label>
          <div className="flex flex-wrap gap-12">
            {TONES.map((tone) => (
              <Button key={tone} variant={variant} tone={tone}>
                button
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-12">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  name: "Типы (tone)",
  render: () => (
    <div className="flex flex-wrap gap-12">
      {TONES.map((tone) => (
        <Button key={tone} tone={tone}>
          {tone}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex items-center gap-12">
      <Button size="sm">Small</Button>
      <Button size="md">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Иконки и аватар",
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Button leftIcon={<IconPencil />}>Иконка слева</Button>
      <Button rightIcon={<IconPencil />}>Иконка справа</Button>
      <Button leftIcon={<IconPencil />} rightIcon={<IconPencil />}>
        Обе
      </Button>
      <Button avatar={<DemoAvatar />}>С аватаром</Button>
      <Button leftIcon={<IconPencil />} aria-label="Только иконка" />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Заблокировано",
  render: () => (
    <div className="flex flex-wrap gap-12">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
