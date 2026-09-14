"use client";

import { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getMonthGrid } from "../calendar";

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
      <Ariakit.Composite
        role="grid"
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {grid.map((row) => (
          <Ariakit.CompositeRow
            key={`row-${row[0].format("YYYY-MM-DD")}`}
            role="row"
            style={{ display: "flex", gap: "8px" }}
          >
            {row.map((day) => (
              <Ariakit.CompositeItem
                className="date-picker-button date-picker-month"
                key={day.format("YYYY-MM-DD")}
                id={`month-${day.month()}`}
                role="gridcell"
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
