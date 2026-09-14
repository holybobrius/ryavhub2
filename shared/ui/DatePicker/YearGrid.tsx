"use client";

import { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getDecade, getYearGrid } from "./calendar";

interface YearGridProps {
  selected: Dayjs | null;
  viewDate: Dayjs;
  onSelect: (date: Dayjs) => void;
}

export const YearGrid = ({ selected, viewDate, onSelect }: YearGridProps) => {
  const grid = getYearGrid(viewDate);
  const { firstYear, lastYear } = getDecade(viewDate);

  return (
    <Ariakit.CompositeProvider
      focusLoop={"horizontal"}
      defaultActiveId={`year-${viewDate.year()}`}
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
                id={`year-${day.year()}`}
                role="gridcell"
                style={{ width: 40, height: 40, border: "1px solid #555" }}
                onClick={() => onSelect?.(day)}
                render={<button type="button" />}
                data-outside={
                  day.year() < firstYear || day.year() > lastYear
                    ? "true"
                    : undefined
                }
                aria-selected={day.isSame(selected, "year")}
              >
                {day.format("YYYY")}
              </Ariakit.CompositeItem>
            ))}
          </Ariakit.CompositeRow>
        ))}
      </Ariakit.Composite>
    </Ariakit.CompositeProvider>
  );
};
