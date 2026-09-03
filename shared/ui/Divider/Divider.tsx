import type { CSSProperties, HTMLAttributes } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerTone = "default" | "secondary";

export interface DividerProps extends Omit<
  HTMLAttributes<HTMLHRElement>,
  "color"
> {
  orientation?: DividerOrientation;
  tone?: DividerTone;
}

/**
 * Разделительная линия. Server-компонент.
 *
 * Отступов не задаёт: где стоять и сколько занимать — дело раскладки
 * вокруг, поэтому размеры приходят через `className`.
 *
 * Цвет идёт через переменную `--divider-color`, а не жёстким классом:
 * так его можно переопределить снаружи (как делает YearDivider), не
 * заводя в дизайн-системе тон под каждый частный случай.
 */
export function Divider({
  orientation = "horizontal",
  tone = "default",
  className,
  style,
  ...rest
}: DividerProps) {
  const isVertical = orientation === "vertical";

  return (
    <hr
      aria-orientation={isVertical ? "vertical" : undefined}
      className={[
        "shrink-0 border-0 border-[color:var(--divider-color)]",
        isVertical
          ? "self-stretch border-l-[length:var(--border-width-1)]"
          : "w-full border-t-[length:var(--border-width-1)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--divider-color": `var(--color-divider-color-${tone})`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  );
}
