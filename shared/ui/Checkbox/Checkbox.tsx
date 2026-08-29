"use client";

import { useEffect, useRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import "./checkbox.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
  /** Промежуточное состояние (DOM-свойство :indeterminate). */
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  indeterminate = false,
  className,
  disabled,
  ...rest
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  // indeterminate — только DOM-свойство, атрибута нет: ставим через ref.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={["checkbox", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "true" : undefined}
    >
      <input
        ref={ref}
        type="checkbox"
        className="checkbox__input"
        disabled={disabled}
        {...rest}
      />
      <span className="checkbox__box" aria-hidden="true">
        <svg className="checkbox__check" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg className="checkbox__dash" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 12h12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
}
