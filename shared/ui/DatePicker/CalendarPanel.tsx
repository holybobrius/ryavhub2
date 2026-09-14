"use client";

import dayjs, { Dayjs } from "dayjs";
import { DayGrid } from "./DayGrid";
import { useState } from "react";
import { Button } from "../Button";
import { IconChevronDown, IconChevronUp } from "../icons";
import "./date-picker.css";
import { MonthGrid } from "./MonthGrid";
import { YearGrid } from "./YearGrid";
import { getDecade } from "./calendar";

interface CalendarPanelProps {
  value: Dayjs | null;
  onCommit: (value: Dayjs | null) => void;
  onCancel: () => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

const CalendarPanel = ({
  value,
  onCommit,
  onCancel,
  minDate,
  maxDate,
}: CalendarPanelProps) => {
  const [selected, setSelected] = useState<Dayjs | null>(value);
  const [viewDate, setViewDate] = useState(() => value || dayjs());
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");

  const getTopLabel = () => {
    if (viewMode === "year") {
      const { firstYear, lastYear } = getDecade(viewDate);

      return `${firstYear}-${lastYear} г.`;
    }

    if (viewMode === "month") {
      return `${viewDate.format("YYYY")} г.`;
    }

    return viewDate.format("MMMM YYYY");
  };

  const handleViewDatePeriodUp = () => {
    if (viewMode === "day") {
      setViewDate(viewDate.add(1, "month"));
    } else if (viewMode === "month") {
      setViewDate(viewDate.add(1, "year"));
    } else if (viewMode === "year") {
      setViewDate(viewDate.add(10, "year"));
    }
  };

  const handleViewDatePeriodDown = () => {
    if (viewMode === "day") {
      setViewDate(viewDate.subtract(1, "month"));
    } else if (viewMode === "month") {
      setViewDate(viewDate.subtract(1, "year"));
    } else if (viewMode === "year") {
      setViewDate(viewDate.subtract(10, "year"));
    }
  };

  const handleViewModeChange = () => {
    if (viewMode === "day") {
      setViewMode("month");
    } else if (viewMode === "month") {
      setViewMode("year");
    }
  };

  const handleMonthSelect = (date: Dayjs) => {
    setViewDate(date);
    setViewMode("day");
  };

  const handleYearSelect = (date: Dayjs) => {
    setViewDate(date);
    setViewMode("month");
  };

  return (
    <div className="flex flex-col gap-space-md bg-surface-bg-surface-elevated p-inset-md rounded-xs">
      <div className="flex flex-col gap-space-2xs">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            tone="tertiary"
            size="sm"
            disabled={viewMode === "year"}
            onClick={handleViewModeChange}
          >
            {getTopLabel()}
          </Button>
          <div className="flex gap-space-3xs">
            <Button
              variant="ghost"
              tone="tertiary"
              size="sm"
              leftIcon={<IconChevronUp />}
              onClick={handleViewDatePeriodUp}
            />
            <Button
              variant="ghost"
              tone="tertiary"
              size="sm"
              leftIcon={<IconChevronDown />}
              onClick={handleViewDatePeriodDown}
            />
          </div>
        </div>
        {viewMode === "day" && (
          <DayGrid
            viewDate={viewDate}
            selected={selected}
            onSelect={setSelected}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
        {viewMode === "month" && (
          <MonthGrid
            viewDate={viewDate}
            selected={selected}
            onSelect={handleMonthSelect}
          />
        )}
        {viewMode === "year" && (
          <YearGrid
            viewDate={viewDate}
            selected={selected}
            onSelect={handleYearSelect}
          />
        )}
      </div>
      <div className="flex justify-end gap-x-space-xs">
        <Button variant="outlined" tone="tertiary" onClick={onCancel}>
          Отменить
        </Button>
        <Button
          variant="filled"
          tone="secondary"
          onClick={() => onCommit(selected)}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default CalendarPanel;
