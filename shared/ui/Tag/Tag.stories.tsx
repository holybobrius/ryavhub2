import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "./Tag";
import type { TagColor, TagType } from "./Tag";
import { Avatar } from "../Avatar";
import { Typography } from "../Typography";

/**
 * Тег-метка. Оси: color (12 цветов), type (soft/filled/tinted). Слоты:
 * левая иконка (`icon`), аватар (`avatar`), счётчик (`count`), крестик
 * (`onClose`). Крестик — нативная кнопка с состояниями hover/pressed.
 */
const meta: Meta<typeof Tag> = {
  title: "UI/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    type: { control: "inline-radio", options: ["soft", "filled", "tinted"] },
    color: {
      control: "select",
      options: [
        "secondary",
        "primary",
        "red",
        "orange",
        "yellow",
        "lime",
        "blue",
        "cyan",
        "green",
        "magenta",
        "pink",
        "purple",
      ],
    },
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

const COLORS: TagColor[] = [
  "secondary",
  "primary",
  "red",
  "orange",
  "yellow",
  "lime",
  "blue",
  "cyan",
  "green",
  "magenta",
  "pink",
  "purple",
];
const TYPES: TagType[] = ["soft", "filled", "tinted"];

// Демо-иконка (ромб, как в макете).
const Diamond = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l4 4-4 4-4-4 4-4zm6 6l4 4-4 4-4-4 4-4zm-12 0l4 4-4 4-4-4 4-4zm6 6l4 4-4 4-4-4 4-4z" />
  </svg>
);

// Интерактивный тег со всеми слотами.
export const Playground: Story = {
  args: {
    children: "tag",
    color: "primary",
    type: "filled",
    icon: <Diamond />,
    onClose: () => {},
  },
};

// Слоты: иконка / аватар / счётчик / крестик.
export const Slots: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Tag color="primary">только текст</Tag>
      <Tag color="primary" icon={<Diamond />}>
        иконка
      </Tag>
      <Tag color="primary" avatar={<Avatar size={16} color="primary" />}>
        аватар
      </Tag>
      <Tag color="primary" count={12}>
        счётчик
      </Tag>
      <Tag color="primary" onClose={() => {}}>
        крестик
      </Tag>
      <Tag color="primary" icon={<Diamond />} count={3} onClose={() => {}}>
        всё вместе
      </Tag>
    </div>
  ),
};

// Матрица: тип × цвет (с крестиком, как в макете).
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {TYPES.map((t) => (
        <div key={t} className="flex flex-col gap-8">
          <Typography.Label size="sm" color="secondary">
            {t}
          </Typography.Label>
          <div className="flex flex-wrap items-center gap-8">
            {COLORS.map((c) => (
              <Tag
                key={c}
                color={c}
                type={t}
                icon={<Diamond />}
                onClose={() => {}}
              >
                tag
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// Отключённое состояние.
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Tag
        color="primary"
        type="filled"
        icon={<Diamond />}
        onClose={() => {}}
        disabled
      >
        disabled
      </Tag>
      <Tag color="red" type="soft" onClose={() => {}} disabled>
        disabled
      </Tag>
    </div>
  ),
};
