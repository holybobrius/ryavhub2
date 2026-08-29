import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

// Общие для Input и Input.TextArea пропы оформления.
interface FieldCommon {
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  /** Состояние ошибки (проп, не выводится из DOM). */
  error?: boolean;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Внутренняя оболочка: label + рамка поля + helper. Контрол передаётся детьми.
// Обёртка — <label>, поэтому клик фокусирует контрол без id/useId (компонент
// остаётся серверным).
interface ShellProps extends FieldCommon {
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  children: ReactNode;
}

function InputShell({
  size = "md",
  label,
  helperText,
  error,
  required,
  leftIcon,
  rightIcon,
  disabled,
  className,
  multiline,
  children,
}: ShellProps) {
  return (
    <label
      className={["input", className].filter(Boolean).join(" ")}
      data-size={size}
      data-error={error ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-multiline={multiline ? "true" : undefined}
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
        {children}
        {rightIcon && <span className="input__icon">{rightIcon}</span>}
      </span>
      {helperText && <span className="input__helper">{helperText}</span>}
    </label>
  );
}

// Omit "size": у нативного <input> size — ширина в символах (number),
// а нам нужна дизайн-ось размера.
export interface InputProps
  extends FieldCommon, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {}

function InputBase({
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
  return (
    <InputShell
      size={size}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      disabled={disabled}
      className={className}
    >
      <input
        className="input__control"
        disabled={disabled}
        aria-invalid={error || undefined}
        required={required}
        {...rest}
      />
    </InputShell>
  );
}

export interface TextAreaProps
  extends
    FieldCommon,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {}

function TextArea({
  size = "md",
  label,
  helperText,
  error,
  required,
  leftIcon,
  rightIcon,
  disabled,
  className,
  rows = 3,
  ...rest
}: TextAreaProps) {
  return (
    <InputShell
      size={size}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      disabled={disabled}
      className={className}
      multiline
    >
      <textarea
        className="input__control input__control--textarea"
        rows={rows}
        disabled={disabled}
        aria-invalid={error || undefined}
        required={required}
        {...rest}
      />
    </InputShell>
  );
}

InputBase.displayName = "Input";
TextArea.displayName = "Input.TextArea";

// Compound: <Input /> и <Input.TextArea />.
export const Input = Object.assign(InputBase, { TextArea });
