import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";
import type { AvatarColor, AvatarSize, AvatarType } from "./Avatar";
import { Typography } from "../Typography";

/**
 * Аватар пользователя. Контент: текст (инициалы), фото (`src`), иконка
 * (`icon`) или дефолтный силуэт. Оси: size (16–64), color (12 цветов),
 * type (soft/filled/tinted), shape (circle/square). Всё на токенах аватара.
 */
const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: [16, 20, 24, 28, 32, 40, 64],
    },
    type: {
      control: "inline-radio",
      options: ["soft", "filled", "tinted"],
    },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    color: {
      control: "select",
      options: [
        "neutral",
        "primary",
        "red",
        "orange",
        "yellow",
        "lime",
        "green",
        "cyan",
        "blue",
        "pink",
        "magenta",
        "purple",
      ],
    },
    children: { control: "text" },
    src: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

const SIZES: AvatarSize[] = [16, 20, 24, 28, 32, 40, 64];
const COLORS: AvatarColor[] = [
  "neutral",
  "primary",
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "blue",
  "pink",
  "magenta",
  "purple",
];
const TYPES: AvatarType[] = ["soft", "filled", "tinted"];

// Пример фото (inline SVG data-URI, чтобы стори была самодостаточной).
const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%237054E5'/><stop offset='1' stop-color='%23E5547C'/></linearGradient></defs><rect width='64' height='64' fill='url(%23g)'/></svg>`,
  );

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" />
  </svg>
);

// Интерактивная стори с контролами.
export const Playground: Story = {
  args: {
    children: "A",
    size: 64,
    color: "primary",
    type: "filled",
    shape: "circle",
  },
};

// Контент: текст / фото / иконка / дефолтный силуэт.
export const Content: Story = {
  render: () => (
    <div className="flex items-center gap-24">
      <div className="flex flex-col items-center gap-8">
        <Avatar size={64} color="primary" type="filled">
          A
        </Avatar>
        <Typography.Label size="sm" color="secondary">
          Текст
        </Typography.Label>
      </div>
      <div className="flex flex-col items-center gap-8">
        <Avatar size={64} src={PHOTO} alt="Фото" />
        <Typography.Label size="sm" color="secondary">
          Фото
        </Typography.Label>
      </div>
      <div className="flex flex-col items-center gap-8">
        <Avatar size={64} color="orange" type="soft" icon={<StarIcon />} />
        <Typography.Label size="sm" color="secondary">
          Иконка
        </Typography.Label>
      </div>
      <div className="flex flex-col items-center gap-8">
        <Avatar size={64} color="neutral" type="soft" />
        <Typography.Label size="sm" color="secondary">
          Дефолт
        </Typography.Label>
      </div>
    </div>
  ),
};

// Все размеры в ряд.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      {SIZES.map((s) => (
        <Avatar key={s} size={s} color="primary" type="filled">
          A
        </Avatar>
      ))}
    </div>
  ),
};

// Матрица: тип × цвет.
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {TYPES.map((t) => (
        <div key={t} className="flex flex-col gap-8">
          <Typography.Label size="sm" color="secondary">
            {t}
          </Typography.Label>
          <div className="flex flex-wrap items-center gap-12">
            {COLORS.map((c) => (
              <Avatar key={c} size={40} color={c} type={t}>
                A
              </Avatar>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// Квадратная форма.
export const Square: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      <Avatar size={64} shape="square" color="primary" type="filled">
        A
      </Avatar>
      <Avatar size={64} shape="square" src={PHOTO} alt="Фото" />
      <Avatar size={64} shape="square" color="green" type="soft" />
    </div>
  ),
};

// Стопка аватарок с кольцом-обводкой.
export const Stack: Story = {
  render: () => (
    <div className="flex">
      {(["primary", "orange", "green", "blue"] as AvatarColor[]).map((c, i) => (
        <div key={c} style={{ marginLeft: i === 0 ? 0 : -12 }}>
          <Avatar size={40} color={c} type="filled" ring>
            {String.fromCharCode(65 + i)}
          </Avatar>
        </div>
      ))}
    </div>
  ),
};
