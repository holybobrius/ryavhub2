import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { within, userEvent } from "storybook/test";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import CalendarPanel from "./CalendarPanel";
import { formatDate } from "./calendar";

/**
 * Панель коммитит наружу и сама не сбрасывается при смене value —
 * сброс draft/viewDate/mode произойдёт на шаге 4, когда её начнёт
 * размонтировать закрывающийся Popover.
 *
 * Кнопка «Открыть заново» имитирует это: меняет key, панель монтируется
 * заново и подхватывает последнее закоммиченное значение. Так видно,
 * что никакой useEffect для синхронизации не нужен.
 */
const Harness = ({
  value: initial,
  ...props
}: ComponentProps<typeof CalendarPanel>) => {
  const [committed, setCommitted] = useState<Dayjs | null>(initial);
  const [instance, setInstance] = useState(0);
  const [lastAction, setLastAction] = useState("—");

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 12 }}>
      <CalendarPanel
        {...props}
        key={instance}
        value={committed}
        onCommit={(next) => {
          setCommitted(next);
          setLastAction(`onCommit(${formatDate(next) || "null"})`);
        }}
        onCancel={() => setLastAction("onCancel()")}
      />
      <div style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.6 }}>
        <div>Закоммичено: {formatDate(committed) || "—"}</div>
        <div>Последнее событие: {lastAction}</div>
      </div>
      <button type="button" onClick={() => setInstance((n) => n + 1)}>
        Открыть заново (размонтировать и смонтировать)
      </button>
    </div>
  );
};

const meta: Meta<typeof CalendarPanel> = {
  title: "DatePicker/CalendarPanel",
  component: CalendarPanel,
  render: (args) => <Harness {...args} />,
  args: { value: null },
  argTypes: {
    value: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    onCommit: { control: false },
    onCancel: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof CalendarPanel>;

/** Пустое значение: viewDate падает на текущий месяц, ничего не подсвечено. */
export const Empty: Story = {};

/** Дата с макета. Январь 2027, подсвечено 12-е. */
export const WithValue: Story = {
  args: { value: dayjs("2027-01-12") },
};

/**
 * Границы диапазона. Дни вне [min, max] заблокированы, но достижимы
 * стрелками. Месяцы и годы целиком вне диапазона пока не блокируются —
 * решить, надо ли, на шаге 5.
 */
export const WithRange: Story = {
  args: {
    value: dayjs("2027-01-12"),
    minDate: dayjs("2027-01-08"),
    maxDate: dayjs("2027-01-22"),
  },
};

/**
 * Режим месяцев. Попасть в него можно только кликом по заголовку,
 * снаружи он не управляется — поэтому клик делает play-функция.
 * Заголовок — первая кнопка панели, так что селектор не зависит
 * от текущей даты.
 */
export const MonthMode: Story = {
  args: { value: dayjs("2027-01-12") },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole("button")[0]);
  },
};

/** Режим лет: тот же заголовок, нажатый дважды. */
export const YearMode: Story = {
  args: { value: dayjs("2027-01-12") },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole("button")[0]);
    await userEvent.click(canvas.getAllByRole("button")[0]);
  },
};
