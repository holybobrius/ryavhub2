"use client";

import { Dayjs } from "dayjs";
import * as Ariakit from "@ariakit/react";
import { getDecade, getYearGrid, isPeriodInRange } from "../calendar";

interface YearGridProps {
  selected: Dayjs | null;
  viewDate: Dayjs;
  onSelect: (date: Dayjs) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export const YearGrid = ({
  selected,
  viewDate,
  onSelect,
  minDate,
  maxDate,
}: YearGridProps) => {
  const grid = getYearGrid(viewDate);
  const { firstYear, lastYear } = getDecade(viewDate);

  const isDisabled = (year: Dayjs) => {
    if (year.year() < firstYear || year.year() > lastYear) return true;

    return !isPeriodInRange(year, "year", minDate, maxDate);
  };

  return (
    <Ariakit.CompositeProvider
      key={firstYear}
      focusLoop={"horizontal"}
      defaultActiveId={`year-${viewDate.year()}`}
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
                className="date-picker-button date-picker-year"
                key={day.format("YYYY-MM-DD")}
                id={`year-${day.year()}`}
                role="gridcell"
                onClick={() => onSelect?.(day)}
                render={<button type="button" />}
                disabled={isDisabled(day)}
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
