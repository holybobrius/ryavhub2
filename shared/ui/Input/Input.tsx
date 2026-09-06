"use client";

import { useState } from "react";
import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from "react";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

interface FieldCommon {
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

interface ShellProps extends FieldCommon {
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  counter?: ReactNode;
  children: ReactNode;
}

const InputShell = ({
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
  counter,
  children,
}: ShellProps) => {
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
      {(helperText || counter != null) && (
        <span className="input__footer">
          {helperText && <span className="input__helper">{helperText}</span>}
          {counter != null && <span className="input__counter">{counter}</span>}
        </span>
      )}
    </label>
  );
};

export interface InputProps
  // Omit "size": у нативного <input> size — это ширина в символах (number).
  extends FieldCommon, Omit<ComponentPropsWithRef<"input">, "size"> {}

const InputBase = ({
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
}: InputProps) => {
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
};

export interface TextAreaProps
  extends FieldCommon, Omit<ComponentPropsWithRef<"textarea">, "size"> {
  showCount?: boolean;
}

const TextArea = ({
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
  showCount,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextAreaProps) => {
  const isControlled = value !== undefined;
  const [uncontrolledCount, setUncontrolledCount] = useState(
    () => String(defaultValue ?? "").length,
  );
  const count = isControlled ? String(value ?? "").length : uncontrolledCount;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledCount(event.target.value.length);
    onChange?.(event);
  };

  const counter = showCount
    ? maxLength != null
      ? `${count}/${maxLength}`
      : String(count)
    : undefined;

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
      counter={counter}
    >
      <textarea
        className="input__control input__control--textarea"
        rows={rows}
        disabled={disabled}
        aria-invalid={error || undefined}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...rest}
      />
    </InputShell>
  );
};

export interface InputDateProps
  extends FieldCommon, Omit<ComponentPropsWithRef<"input">, "size" | "type"> {}

const InputDate = ({
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
}: InputDateProps) => {
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
        type="date"
        className="input__control"
        disabled={disabled}
        aria-invalid={error || undefined}
        required={required}
        {...rest}
      />
    </InputShell>
  );
};

InputBase.displayName = "Input";
TextArea.displayName = "Input.TextArea";
InputDate.displayName = "Input.Date";

export const Input = Object.assign(InputBase, {
  TextArea,
  Date: InputDate,
});
