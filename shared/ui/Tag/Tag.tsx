import type { ReactNode } from "react";
import "./tag.css";

export type TagType = "soft" | "filled" | "tinted";
export type TagColor =
  | "secondary"
  | "primary"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "blue"
  | "cyan"
  | "green"
  | "magenta"
  | "pink"
  | "purple";

export interface TagProps {
  children: ReactNode;
  color?: TagColor;
  type?: TagType;
  /** Левая иконка (наследует цвет текста). Игнорируется, если задан avatar. */
  icon?: ReactNode;
  /** Аватар в лид-слоте (передавай <Avatar size={16} />). */
  avatar?: ReactNode;
  /** Счётчик справа от текста. */
  count?: ReactNode;
  /** Показывает крестик; вызывается по клику. */
  onClose?: () => void;
  /** Подпись для крестика (a11y). */
  closeLabel?: string;
  disabled?: boolean;
  className?: string;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function Tag({
  children,
  color = "secondary",
  type = "soft",
  icon,
  avatar,
  count,
  onClose,
  closeLabel = "Удалить",
  disabled,
  className,
}: TagProps) {
  return (
    <span
      className={["tag", className].filter(Boolean).join(" ")}
      data-type={type}
      data-color={color}
      data-disabled={disabled ? "true" : undefined}
    >
      {avatar ? (
        <span className="tag__avatar">{avatar}</span>
      ) : icon ? (
        <span className="tag__icon">{icon}</span>
      ) : null}
      <span className="tag__label">{children}</span>
      {count != null && <span className="tag__count">{count}</span>}
      {onClose && (
        <button
          type="button"
          className="tag__close"
          aria-label={closeLabel}
          disabled={disabled}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
