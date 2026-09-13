"use client";

import dayjs, { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getDayGrid, isInRange } from "./calendar";

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

  return (
    <Ariakit.CompositeProvider focusLoop={"horizontal"}>
      <Ariakit.Composite role="grid">
        <div
          role="row"
          aria-hidden
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 40px)" }}
        >
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        {grid.map((week) => (
          <Ariakit.CompositeRow
            key={`week-${week[0].format("YYYY-MM-DD")}`}
            role="row"
            style={{ display: "flex" }}
          >
            {week.map((day) => (
              <Ariakit.CompositeItem
                key={day.format("YYYY-MM-DD")}
                id={`day-${day.format("YYYY-MM-DD")}`}
                role="gridcell"
                style={{ width: 40, height: 40, border: "1px solid #555" }}
                data-outside={
                  day.month() !== viewDate.month() ? "true" : undefined
                }
                data-today={day.isSame(dayjs(), "day") ? "true" : undefined}
                aria-selected={day.isSame(selected, "day")}
                disabled={!isInRange(day, minDate, maxDate)}
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
