import type { InputHTMLAttributes, ReactNode } from "react";
import "./switch.css";

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
}

export function Switch({ label, className, disabled, ...rest }: SwitchProps) {
  return (
    <label
      className={["switch", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "true" : undefined}
    >
      <input
        type="checkbox"
        role="switch"
        className="switch__input"
        disabled={disabled}
        {...rest}
      />
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
}
