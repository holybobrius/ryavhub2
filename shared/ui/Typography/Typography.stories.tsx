import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { Typography } from "./Typography";

/**
 * Compound-компонент типографики поверх дизайн-токенов.
 * `Typography.Display | Heading | Body | Label`, размер — проп `size`.
 * `as` отвязан от `size`: визуальный размер не диктует семантику (для
 * настоящих заголовков передавайте `as="h1"…"h6"`).
 */
const meta: Meta<typeof Typography.Body> = {
  title: "UI/Typography",
  component: Typography.Body,
  // tags: autodocs — включает вкладку Docs, где собираются все стори ниже.
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Типографика на токенах Figma. Категории display/heading (Geologica) " +
          "и body/label (PT Root UI). Ниже — размеры каждой категории, " +
          "семантические цвета и начертания.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
    weight: {
      control: "inline-radio",
      options: ["regular", "medium", "semibold"],
    },
    color: {
      control: "select",
      options: [
        "base",
        "secondary",
        "tertiary",
        "quaternary",
        "heading",
        "disabled",
        "inverse",
        "link",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Typography.Body>;

// Строка-образец: слева подпись-метка, справа сам текст.
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-baseline gap-24 border-b border-surface-border-default py-16 last:border-b-0">
    <Typography.Label
      size="xs"
      color="tertiary"
      className="w-160 shrink-0 uppercase"
    >
      {label}
    </Typography.Label>
    <div className="min-w-0">{children}</div>
  </div>
);

const PANGRAM = "Съешь ещё этих мягких французских булок да выпей чаю";

// ── Размеры по категориям ─────────────────────────────────────────────

export const Display: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="lg · 128">
        <Typography.Display size="lg">Рявхаб</Typography.Display>
      </Row>
      <Row label="md · 80">
        <Typography.Display size="md">Рявхаб</Typography.Display>
      </Row>
      <Row label="sm · 64">
        <Typography.Display size="sm">Рявхаб</Typography.Display>
      </Row>
    </div>
  ),
};

export const Heading: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="xl · 44">
        <Typography.Heading size="xl">Заголовок раздела</Typography.Heading>
      </Row>
      <Row label="lg · 36">
        <Typography.Heading size="lg">Заголовок раздела</Typography.Heading>
      </Row>
      <Row label="md · 30">
        <Typography.Heading size="md">Заголовок раздела</Typography.Heading>
      </Row>
      <Row label="sm · 26">
        <Typography.Heading size="sm">Заголовок раздела</Typography.Heading>
      </Row>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="lg · 20">
        <Typography.Body size="lg">{PANGRAM}</Typography.Body>
      </Row>
      <Row label="md · 18">
        <Typography.Body size="md">{PANGRAM}</Typography.Body>
      </Row>
      <Row label="sm · 16">
        <Typography.Body size="sm">{PANGRAM}</Typography.Body>
      </Row>
    </div>
  ),
};

export const Label: Story = {
  render: () => (
    <div className="flex flex-col">
      <Row label="md · 14">
        <Typography.Label size="md">Подпись / метка</Typography.Label>
      </Row>
      <Row label="sm · 13">
        <Typography.Label size="sm">Подпись / метка</Typography.Label>
      </Row>
      <Row label="xs · 12">
        <Typography.Label size="xs">Подпись / метка</Typography.Label>
      </Row>
    </div>
  ),
};

// ── Сквозные аспекты ──────────────────────────────────────────────────

export const Colors: Story = {
  name: "Цвета",
  render: () => (
    <div className="flex flex-col">
      {(
        [
          ["base", "по умолчанию"],
          ["secondary", "вторичный"],
          ["tertiary", "третичный"],
          ["quaternary", "четвертичный"],
          ["heading", "заголовок"],
          ["link", "ссылка"],
          ["disabled", "заблокирован"],
        ] as const
      ).map(([color, label]) => (
        <Row key={color} label={color}>
          <Typography.Body color={color}>
            Дизайн-система ({label})
          </Typography.Body>
        </Row>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  name: "Начертания",
  render: () => (
    <div className="flex flex-col">
      {(
        [
          ["regular", "400"],
          ["medium", "500"],
          ["semibold", "600 → 700*"],
        ] as const
      ).map(([weight, note]) => (
        <Row key={weight} label={`${weight} · ${note}`}>
          <Typography.Body weight={weight}>{PANGRAM}</Typography.Body>
        </Row>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "* semibold (600) отсутствует в PT Root UI (300/400/500/700) — " +
          "браузер подставляет 700. См. заметку в CLAUDE.md.",
      },
    },
  },
};

// Интерактивная стори с панелью контролов (args).
export const Playground: Story = {
  args: { size: "md", children: PANGRAM },
};
