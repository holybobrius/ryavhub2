import type { CSSProperties } from "react";
import { Divider } from "@/shared/ui/Divider";
import { Typography } from "@/shared/ui/Typography";

interface YearDividerProps {
  year: number | string;
}

/**
 * Заголовок года в списке цитат: крупная цифра и линия на всю оставшуюся
 * ширину. Год и линия одного цвета — `--color-year-divider-color` темнее
 * обычного разделителя, поэтому блок читается как фон, а не как заголовок
 * поверх контента.
 *
 * Локальный компонент фичи: пока нужен только в списке цитат.
 */
export function YearDivider({ year }: YearDividerProps) {
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
}
