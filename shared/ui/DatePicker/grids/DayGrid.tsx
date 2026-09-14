"use client";

import dayjs, { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getDayGrid, isInRange } from "../calendar";

interface DayGridProps {
  viewDate: Dayjs;
  selected: Dayjs | null;
  onSelect?: (day: Dayjs) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const DayGrid = ({
  viewDate,
  selected,
  onSelect,
  minDate,
  maxDate,
}: DayGridProps) => {
  const grid = getDayGrid(viewDate);

  const isDisabled = (day: Dayjs) => {
    return (
      day.month() !== viewDate.month() || !isInRange(day, minDate, maxDate)
    );
  };

  return (
    <Ariakit.CompositeProvider
      focusLoop={"horizontal"}
      defaultActiveId={`day-${viewDate.format("YYYY-MM-DD")}`}
    >
      <Ariakit.Composite
        role="grid"
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <div
          role="row"
          aria-hidden
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
          }}
        >
          {WEEKDAYS.map((w) => (
            <div className="date-picker-weekday" key={w}>
              <span key={w}>{w}</span>
            </div>
          ))}
        </div>
        {grid.map((week) => (
          <Ariakit.CompositeRow
            key={`week-${week[0].format("YYYY-MM-DD")}`}
            role="row"
            style={{ display: "flex", gap: "8px" }}
          >
            {week.map((day) => (
              <Ariakit.CompositeItem
                className="date-picker-button date-picker-day"
                key={day.format("YYYY-MM-DD")}
                id={`day-${day.format("YYYY-MM-DD")}`}
                role="gridcell"
                data-today={day.isSame(dayjs(), "day") ? "true" : undefined}
                aria-selected={day.isSame(selected, "day")}
                disabled={isDisabled(day)}
                accessibleWhenDisabled
                onClick={() => onSelect?.(day)}
                render={<button type="button" />}
              >
                {day.date()}
              </Ariakit.CompositeItem>
            ))}
          </Ariakit.CompositeRow>
        ))}
      </Ariakit.Composite>
    </Ariakit.CompositeProvider>
  );
};
