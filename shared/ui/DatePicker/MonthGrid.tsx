"use client";

import { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getMonthGrid } from "./calendar";

interface MonthGridProps {
  viewDate: Dayjs;
  selected: Dayjs | null;
  onSelect: (date: Dayjs) => void;
}

export const MonthGrid = ({ viewDate, selected, onSelect }: MonthGridProps) => {
  const grid = getMonthGrid(viewDate);

  return (
    <Ariakit.CompositeProvider
      focusLoop={"horizontal"}
      defaultActiveId={`month-${viewDate.month()}`}
    >
      <Ariakit.Composite role="grid">
        {grid.map((row) => (
          <Ariakit.CompositeRow
            key={`row-${row[0].format("YYYY-MM-DD")}`}
            role="row"
            style={{ display: "flex" }}
          >
            {row.map((day) => (
              <Ariakit.CompositeItem
                className="date-picker-day"
                key={day.format("YYYY-MM-DD")}
                id={`month-${day.month()}`}
                role="gridcell"
                style={{ width: 40, height: 40, border: "1px solid #555" }}
                onClick={() => onSelect?.(day)}
                render={<button type="button" />}
                aria-selected={day.isSame(selected, "month")}
              >
                {day.format("MMM")}
              </Ariakit.CompositeItem>
            ))}
          </Ariakit.CompositeRow>
        ))}
      </Ariakit.Composite>
    </Ariakit.CompositeProvider>
  );
};
