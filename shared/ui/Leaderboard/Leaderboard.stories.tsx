import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeaderboardCard } from "./LeaderboardCard";
import { LeaderboardItem } from "./LeaderboardItem";

/**
 * Карточка рейтинга: заголовок секции + строки `LeaderboardItem`.
 * Позиции и «зебру» карточка расставляет сама — на вход идут только данные.
 *
 * Цвет позиции берётся из токенов `--color-lb-position-1..3` (призовые
 * места) и `--color-lb-position-default` (остальные).
 */
const meta: Meta<typeof LeaderboardCard> = {
  title: "UI/LeaderboardCard",
  component: LeaderboardCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    zebra: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof LeaderboardCard>;

const entries = [
  { name: "Сусанин", value: 128 },
  { name: "Картер", value: 96 },
  { name: "Зинк", value: 74 },
  { name: "Ксарген", value: 51 },
  { name: "Тинчик", value: 23 },
];

export const Default: Story = {
  args: { title: "Section Label", entries },
  render: (args) => (
    <div className="max-w-[520px]">
      <LeaderboardCard {...args} />
    </div>
  ),
};

/** Без чередования подложки — все строки на фоне карточки. */
export const ZebraOff: Story = {
  ...Default,
  args: { ...Default.args, zebra: false },
};

/** Длинные ники обрезаются многоточием, колонки не разъезжаются. */
export const LongNames: Story = {
  ...Default,
  args: {
    title: "Больше всего цитат",
    entries: [
      {
        name: "Пользователь с очень длинным ником, который не влезает",
        value: 1280,
      },
      { name: "Сусанин", value: 96 },
      {
        name: "Ещё один невероятно длинный ник для проверки обрезки",
        value: 7,
      },
    ],
  },
};

/** Значение можно окрасить: нейтральное / положительное / отрицательное. */
export const ValueTones: Story = {
  ...Default,
  args: {
    title: "Изменение за неделю",
    entries: [
      { name: "Сусанин", value: "+12", tone: "positive" as const },
      { name: "Картер", value: 0 },
      { name: "Зинк", value: "−4", tone: "negative" as const },
    ],
  },
};

/**
 * Отдельная строка вне карточки: видно градацию цвета позиции —
 * места 1–3 подсвечены, с четвёртого идёт тусклый `default`.
 */
export const Items: StoryObj<typeof LeaderboardItem> = {
  render: () => (
    <div className="flex max-w-[520px] flex-col">
      {[1, 2, 3, 4, 5].map((position) => (
        <LeaderboardItem
          key={position}
          position={position}
          name={`Место ${position}`}
          value={100 - position * 7}
          zebra={position % 2 === 1}
        />
      ))}
    </div>
  ),
};
