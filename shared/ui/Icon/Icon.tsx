import type { HTMLAttributes } from "react";
import "./icon.css";

export interface IconProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color" | "children"
> {
  /** SVG-разметка иконки — строка `.data` из stratis-ui-icons. */
  data: string;
  /** Размер в пикселях (ширина = высота). По умолчанию 24. */
  size?: number;
  /** Доступное имя. Если задано — иконка смысловая (role=img),
   *  иначе декоративная (aria-hidden). */
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
