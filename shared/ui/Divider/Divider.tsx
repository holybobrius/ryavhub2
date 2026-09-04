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

// Цвет через --divider-color, а не жёстким классом: переопределяется снаружи
// (так делает YearDivider).
export const Divider = ({
  orientation = "horizontal",
  tone = "default",
  className,
  style,
  ...rest
}: DividerProps) => {
  const isVertical = orientation === "vertical";

  return (
    <hr
      aria-orientation={isVertical ? "vertical" : undefined}
      className={[
        "shrink-0 border-0 border-(color:--divider-color)",
        isVertical ? "self-stretch border-l-1" : "w-full border-t-1",
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
};
