import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

export type ButtonVariant = "filled" | "outlined" | "ghost" | "soft";
export type ButtonTone = "primary" | "secondary" | "tertiary" | "error";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  avatar?: ReactNode;
}

export const Button = ({
  variant = "filled",
  tone = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  avatar,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) => {
  // type="button" по умолчанию: иначе кнопка внутри <form> сабмитит форму.
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
};
