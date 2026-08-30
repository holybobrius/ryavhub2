import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "./Tooltip";
import type { TooltipDirection } from "./Tooltip";
import { Button } from "../Button";

/**
 * Всплывающая подсказка на Ariakit (позиционирование/hover/focus/a11y).
 * Инвертированный фон. 12 направлений стрелки маплю на placement Ariakit.
 * Наведи или сфокусируй триггер (таб) — покажется подсказка.
 */
const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    content: { control: "text" },
    direction: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "right-top",
        "right-center",
        "right-bottom",
        "bottom-right",
        "bottom-center",
        "bottom-left",
        "left-bottom",
        "left-center",
        "left-top",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

// Интерактивная подсказка (наведи/сфокусируй кнопку).
export const Playground: Story = {
  args: {
    content: "Tooltip",
    direction: "top-center",
    children: <Button>наведи на меня</Button>,
  },
};

// Длинный текст — переносится по max-width (280px).
export const LongText: Story = {
  args: {
    content:
      "Длинная подсказка, которая переносится на несколько строк по достижении максимальной ширины в 280 пикселей.",
    direction: "bottom-center",
    children: <Button tone="secondary">длинный текст</Button>,
  },
};

const ALL: TooltipDirection[] = [
  "top-left",
  "top-center",
  "top-right",
  "right-top",
  "right-center",
  "right-bottom",
  "bottom-right",
  "bottom-center",
  "bottom-left",
  "left-bottom",
  "left-center",
  "left-top",
];

// Витрина всех 12 направлений. Здесь это СТАТИЧНЫЕ пузыри (класс
// .tooltip .tooltip-demo, стрелка через data-direction), а не живые
// Ariakit-тултипы: показать все 12 разом живыми нельзя — Ariakit держит
// один активный тултип на страницу (глобальный active-store), и десяток
// принудительно открытых дёргают друг друга и соседние живые тултипы.
export const Directions: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div
      className="grid gap-64 p-64"
      style={{ gridTemplateColumns: "repeat(3, max-content)" }}
    >
      {ALL.map((d) => (
        <span key={d} className="tooltip tooltip-demo" data-direction={d}>
          {d}
        </span>
      ))}
    </div>
  ),
};
