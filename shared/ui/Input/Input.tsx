import type { InputHTMLAttributes, ReactNode } from "react";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

// Omit "size": у нативного <input> size — это ширина в символах (number),
// а нам нужна дизайн-ось размера. Разводим, как с button type -> tone.
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  /** Состояние ошибки (не выводится из DOM — это проп). */
  error?: boolean;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  size = "md",
  label,
  helperText,
  error,
  required,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...rest
}: InputProps) {
  // Обёртка — <label>, поэтому клик по любой части фокусирует input,
  // а связь label↔control не требует id/useId (компонент остаётся
  // серверным — без хуков и "use client").
  return (
    <label
      className={["input", className].filter(Boolean).join(" ")}
      data-size={size}
      data-error={error ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      {label && (
        <span className="input__label">
          {label}
          {required && (
            <span className="input__required" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      <span className="input__field">
        {leftIcon && <span className="input__icon">{leftIcon}</span>}
        <input
          className="input__control"
          disabled={disabled}
          aria-invalid={error || undefined}
          required={required}
          {...rest}
        />
        {rightIcon && <span className="input__icon">{rightIcon}</span>}
      </span>
      {helperText && <span className="input__helper">{helperText}</span>}
    </label>
  );
}
