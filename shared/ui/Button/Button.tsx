import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

export type ButtonVariant = "filled" | "outlined" | "ghost" | "soft";
export type ButtonTone = "primary" | "secondary" | "tertiary" | "error";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Смысловой тип из дизайна («Type»). Назван tone, чтобы не занимать
   *  нативный HTML-атрибут type (button/submit/reset). */
  tone?: ButtonTone;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  avatar?: ReactNode;
}

export function Button({
  variant = "filled",
  tone = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  avatar,
  children,
  className,
  // По умолчанию type="button": иначе кнопка внутри <form> сабмитит форму.
  type = "button",
  ...rest
}: ButtonProps) {
  // Без текстовой метки трактуем как icon-only (квадратная кнопка).
  const iconOnly = children == null || children === false;

  return (
    <button
      type={type}
      className={["btn", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-icon-only={iconOnly ? "true" : undefined}
      {...rest}
    >
      {avatar && <span className="btn__avatar">{avatar}</span>}
      {leftIcon && <span className="btn__icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </button>
  );
}
