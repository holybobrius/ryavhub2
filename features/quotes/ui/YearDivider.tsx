import type { CSSProperties } from "react";
import { Divider } from "@/shared/ui/Divider";
import { Typography } from "@/shared/ui/Typography";

interface YearDividerProps {
  year: number | string;
}

export const YearDivider = ({ year }: YearDividerProps) => {
  const color = "var(--color-year-divider-color)";

  return (
    <div className="flex items-center gap-space-lg">
      <Typography.Display size="sm" as="h2" style={{ color }}>
        {year}
      </Typography.Display>

      <Divider
        className="flex-1"
        style={{ "--divider-color": color } as CSSProperties}
      />
    </div>
  );
};
