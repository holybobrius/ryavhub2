import type { ReactNode } from "react";
import "./avatar.css";

export type AvatarSize = 16 | 20 | 24 | 28 | 32 | 40 | 64;
export type AvatarType = "soft" | "filled" | "tinted";
export type AvatarShape = "circle" | "square";
export type AvatarColor =
  | "neutral"
  | "primary"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "cyan"
  | "blue"
  | "pink"
  | "magenta"
  | "purple";

export interface AvatarProps {
  size?: AvatarSize;
  color?: AvatarColor;
  type?: AvatarType;
  shape?: AvatarShape;
  /** Фото пользователя. Приоритетнее icon и текста. */
  src?: string;
  alt?: string;
  /** Кастомная иконка. Показывается, если нет src. */
  icon?: ReactNode;
  /** Текст (обычно инициалы). Показывается, если нет src и icon. */
  children?: ReactNode;
  /** Обводка-кольцо под цвет фона страницы (для стопок аватарок). */
  ring?: boolean;
  className?: string;
}

// Дефолтный контент, когда ничего не передано — силуэт пользователя.
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 0114 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Avatar({
  size = 32,
  color = "neutral",
  type = "soft",
  shape = "circle",
  src,
  alt = "",
  icon,
  children,
  ring,
  className,
}: AvatarProps) {
  let content: ReactNode;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    content = <img className="avatar__img" src={src} alt={alt} />;
  } else if (icon) {
    content = <span className="avatar__icon">{icon}</span>;
  } else if (children != null && children !== "") {
    content = children;
  } else {
    content = (
      <span className="avatar__icon">
        <PersonIcon />
      </span>
    );
  }

  return (
    <span
      className={["avatar", className].filter(Boolean).join(" ")}
      data-size={size}
      data-color={color}
      data-type={type}
      data-shape={shape}
      data-ring={ring ? "true" : undefined}
      role="img"
      aria-label={alt || undefined}
    >
      {content}
    </span>
  );
}
