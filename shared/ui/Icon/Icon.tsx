import type { HTMLAttributes } from "react";
import "./icon.css";

export interface IconProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color" | "children"
> {
  data: string;
  size?: number;
  title?: string;
}

export const Icon = ({
  data,
  size = 24,
  title,
  className,
  style,
  ...rest
}: IconProps) => {
  const decorative = title == null;

  return (
    <span
      className={["icon", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: data }}
      {...rest}
    />
  );
};
