import type { ReactNode } from "react";
import "./icon-tile.css";

export type IconTileSize = "small" | "default" | "large";

export interface IconTileProps {
  /** Основная иконка (SVG). Размер (icon-size-xl) и цвет задаёт плитка. */
  icon?: ReactNode;
  /** Иконка картинкой (растр). Приоритетнее `icon`; при inactive — чб-фильтр. */
  src?: string;
  /** alt для картинки-иконки. */
  alt?: string;
  /** Размер плитки: small 48 / default 60 / large 80 px. */
  size?: IconTileSize;
  /** Неактивное состояние — приглушённые фон/рамка/иконка. */
  inactive?: boolean;
  /** Доступное имя. Если задано — плитка смысловая (role=img),
   *  иначе декоративная (aria-hidden). */
  title?: string;
  className?: string;
}

export function IconTile({
  icon,
  src,
  alt = "",
  size = "default",
  inactive,
  title,
  className,
}: IconTileProps) {
  const decorative = title == null;

  return (
    <span
      className={["icon-tile", className].filter(Boolean).join(" ")}
      data-size={size}
      data-inactive={inactive ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={title}
    >
      {src ? (
        // Картинка приоритетнее SVG-иконки. Нативный img (без next/image),
        // размер = глиф; при inactive красится в чб (см. icon-tile.css).
        // eslint-disable-next-line @next/next/no-img-element
        <img className="icon-tile__glyph icon-tile__img" src={src} alt={alt} />
      ) : (
        <span className="icon-tile__glyph">{icon}</span>
      )}
    </span>
  );
}
