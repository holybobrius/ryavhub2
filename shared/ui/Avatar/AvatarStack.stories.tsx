import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AvatarStack } from "./AvatarStack";
import { Avatar } from "./Avatar";
import { Typography } from "../Typography";

/**
 * Стопка аватарок с перекрытием и чипом «+N» для скрытых. Наведи на
 * конкретный аватар — он выйдет вперёд стопки. Размер/форма/кольцо
 * навязываются стопкой всем детям. Overlap токена не имеет (~1/3 размера).
 */
const meta: Meta<typeof AvatarStack> = {
  title: "UI/AvatarStack",
  component: AvatarStack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    max: { control: { type: "number", min: 1, max: 8 } },
    size: { control: "inline-radio", options: [16, 20, 24, 28, 32, 40, 64] },
    shape: { control: "inline-radio", options: ["circle", "square"] },
  },
};
export default meta;

type Story = StoryObj<typeof AvatarStack>;

const gradient = (a: string, b: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='64' height='64' fill='url(%23g)'/></svg>`,
  );

const PHOTOS = [
  gradient("%237054E5", "%23E5547C"),
  gradient("%23E58A3C", "%23E5C93C"),
  gradient("%233CB371", "%233CC9C9"),
  gradient("%233C7CE5", "%237054E5"),
  gradient("%23E53C7C", "%23E5843C"),
  gradient("%233CC98A", "%233C9CE5"),
];

// Интерактивная стопка (наведи на аватар — выйдет вперёд).
export const Playground: Story = {
  args: { max: 5, size: 40, shape: "circle" },
  render: (args) => (
    <AvatarStack {...args}>
      {PHOTOS.map((src, i) => (
        <Avatar key={i} src={src} alt={`Пользователь ${i + 1}`} />
      ))}
    </AvatarStack>
  ),
};

// Квадратная форма — как на макете.
export const Square: Story = {
  render: () => (
    <AvatarStack max={5} size={40} shape="square">
      {PHOTOS.map((src, i) => (
        <Avatar key={i} src={src} alt={`Пользователь ${i + 1}`} />
      ))}
    </AvatarStack>
  ),
};

// Инициалы вместо фото.
export const Initials: Story = {
  render: () => (
    <AvatarStack max={4} size={40}>
      <Avatar color="primary" type="filled">
        ИП
      </Avatar>
      <Avatar color="orange" type="filled">
        АК
      </Avatar>
      <Avatar color="green" type="filled">
        МВ
      </Avatar>
      <Avatar color="blue" type="filled">
        ДС
      </Avatar>
      <Avatar color="pink" type="filled">
        ЕЛ
      </Avatar>
      <Avatar color="cyan" type="filled">
        ОР
      </Avatar>
    </AvatarStack>
  ),
};

// Разные размеры.
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {([24, 32, 40, 64] as const).map((s) => (
        <div key={s} className="flex items-center gap-16">
          <Typography.Label size="sm" color="secondary">
            {s}
          </Typography.Label>
          <AvatarStack max={4} size={s}>
            {PHOTOS.map((src, i) => (
              <Avatar key={i} src={src} alt={`Пользователь ${i + 1}`} />
            ))}
          </AvatarStack>
        </div>
      ))}
    </div>
  ),
};
