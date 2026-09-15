import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { within, userEvent } from "storybook/test";
import { DatePicker } from "./DatePicker";
import { formatDate } from "./calendar";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  // Панель не портализуется и раскрывается вниз, поэтому истории нужен
  // запас по высоте — иначе в доках она наезжает на соседнюю.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, minHeight: 480 }}>
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
    // Dayjs в контролах не редактируется — задаётся в args истории.
    value: { control: false },
    defaultValue: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    onChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {
  args: {
    label: "Label",
    helperText: "Helper Text",
    size: "md",
  },
};

export const Default: Story = {
  name: "Обычный",
  args: {
    label: "Дата события",
    helperText: "Helper Text",
  },
};

export const WithValue: Story = {
  name: "С начальным значением",
  args: {
    label: "Дата события",
    helperText: "Helper Text",
    defaultValue: dayjs("2027-01-12"),
  },
};

/**
 * Панель раскрыта play-функцией: снаружи открытость не управляется,
 * пропа `open` у компонента нет.
 */
export const Opened: Story = {
  name: "Открытая панель",
  args: {
    label: "Дата события",
    defaultValue: dayjs("2027-01-12"),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("Выбрать дату"));
  },
};

/**
 * Дни вне диапазона заблокированы, но остаются достижимы стрелками.
 * Ручной ввод даты вне диапазона тоже отвергается — поле встаёт в ошибку.
 */
export const WithRange: Story = {
  name: "Ограниченный диапазон",
  args: {
    label: "Дата события",
    helperText: "С 8 по 22 января 2027",
    defaultValue: dayjs("2027-01-12"),
    minDate: dayjs("2027-01-08"),
    maxDate: dayjs("2027-01-22"),
  },
};

export const States: Story = {
  name: "Состояния",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-space-lg">
      <DatePicker label="Обычное" helperText="Helper Text" />
      <DatePicker
        label="Заполненное"
        helperText="Helper Text"
        defaultValue={dayjs("2027-01-12")}
      />
      <DatePicker label="Обязательное" helperText="Helper Text" required />
      <DatePicker label="Ошибка" helperText="Проверьте дату" error />
      <DatePicker label="Выключенное" helperText="Helper Text" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-space-lg">
      <DatePicker size="sm" label="sm" defaultValue={dayjs("2027-01-12")} />
      <DatePicker size="md" label="md" defaultValue={dayjs("2027-01-12")} />
      <DatePicker size="lg" label="lg" defaultValue={dayjs("2027-01-12")} />
    </div>
  ),
};

/**
 * Управляемый режим: значение живёт снаружи, `onChange` стреляет на
 * «Сохранить» и на blur поля с валидным текстом — но не на клик по дню.
 */
const ControlledDemo = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2027-01-12"));
  const [events, setEvents] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-space-sm">
      <DatePicker
        label="Дата события"
        helperText="Helper Text"
        value={value}
        onChange={(next) => {
          setValue(next);
          setEvents((prev) => [
            `onChange(${formatDate(next) || "null"})`,
            ...prev,
          ]);
        }}
      />
      <div className="flex flex-col gap-space-3xs text-body-sm text-surface-text-tertiary">
        <span>Значение: {formatDate(value) || "—"}</span>
        <span>События: {events.slice(0, 3).join(" · ") || "—"}</span>
      </div>
      <button
        type="button"
        className="self-start text-body-sm text-surface-text-link"
        onClick={() => setValue(null)}
      >
        Сбросить снаружи
      </button>
    </div>
  );
};

export const Controlled: Story = {
  name: "Управляемый",
  parameters: { controls: { disable: true } },
  render: () => <ControlledDemo />,
};
