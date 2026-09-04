import type { InputHTMLAttributes, ReactNode } from "react";
import "./radio.css";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
}

export const Radio = ({ label, className, disabled, ...rest }: RadioProps) => {
  return (
    <label
      className={["radio", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "true" : undefined}
    >
      <input
        type="radio"
        className="radio__input"
        disabled={disabled}
        {...rest}
      />
      <span className="radio__box" aria-hidden="true">
        <span className="radio__dot" />
      </span>
      {label && <span className="radio__label">{label}</span>}
    </label>
  );
};
