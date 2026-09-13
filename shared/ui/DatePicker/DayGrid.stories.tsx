import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { DayGrid } from "./DayGrid";
import { formatDate } from "./calendar";

const Stateful = ({
  selected: initial = null,
  ...props
}: ComponentProps<typeof DayGrid>) => {
  const [selected, setSelected] = useState<Dayjs | null>(initial);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 12 }}>
      <DayGrid {...props} selected={selected} onSelect={setSelected} />
      <output style={{ fontVariantNumeric: "tabular-nums" }}>
        Выбрано: {formatDate(selected) || "—"}
      </output>
    </div>
  );
};

const meta: Meta<typeof DayGrid> = {
  title: "DatePicker/DayGrid",
  component: DayGrid,
  render: (args) => <Stateful {...args} />,
  args: { selected: null },
  argTypes: {
    viewDate: { control: false },
    selected: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    onSelect: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof DayGrid>;

export const January2027: Story = {
  args: { viewDate: dayjs("2027-01-01") },
};

export const February2021: Story = {
  args: { viewDate: dayjs("2021-02-01") },
};

export const Today: Story = {
  args: { viewDate: dayjs() },
};

export const WithRange: Story = {
  args: {
    viewDate: dayjs("2027-01-01"),
    minDate: dayjs("2027-01-08"),
    maxDate: dayjs("2027-01-22"),
  },
};
