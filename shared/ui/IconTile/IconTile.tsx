import type { ReactNode } from "react";
import "./icon-tile.css";

export type IconTileSize = "small" | "default" | "large";

export interface IconTileProps {
  icon?: ReactNode;
  src?: string;
  alt?: string;
  size?: IconTileSize;
  inactive?: boolean;
  title?: string;
  secondary?: boolean;
  className?: string;
}

export const IconTile = ({
  icon,
  src,
  alt = "",
  size = "default",
  inactive,
  title,
  secondary,
  className,
}: IconTileProps) => {
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
        // eslint-disable-next-line @next/next/no-img-element
        <img className="icon-tile__glyph icon-tile__img" src={src} alt={alt} />
      ) : (
        <span
          className="icon-tile__glyph"
          data-secondary={secondary ? "true" : undefined}
        >
          {icon}
        </span>
      )}
    </span>
  );
};
