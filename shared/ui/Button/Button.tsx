import React, { FC, PropsWithChildren } from "react";

type ButtonType = "primary" | "secondary" | "danger" | "success";
type ButtonVariant = "filled" | "soft" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface Props {
  htmlType?: "button" | "submit" | "reset";
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  bordered?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const buttonStyles: Record<`${ButtonType}-${ButtonVariant}`, string> = {
  "primary-filled":
    "bg-button-bg-primary-filled hover:bg-button-bg-primary-filled-hover active:bg-button-bg-primary-filled-active text-button-text-primary-filled border-button-border-primary hover:border-button-border-primary-hover active:border-button-border-primary-active",
  "primary-soft":
    "bg-button-bg-primary-soft hover:bg-button-bg-primary-soft-hover active:bg-button-bg-primary-soft-active text-button-text-primary-soft border-button-border-primary hover:border-button-border-primary-hover active:border-button-border-primary-active",
  "primary-ghost":
    "bg-button-bg-primary-ghost hover:bg-button-bg-primary-ghost-hover active:bg-button-bg-primary-ghost-active hover:text-button-text-primary-ghost-hover active:text-button-text-primary-ghost-active text-button-text-primary-ghost border-button-border-primary hover:border-button-border-primary-hover active:border-button-border-primary-active",
  "secondary-filled":
    "bg-button-bg-secondary-filled hover:bg-button-bg-secondary-filled-hover active:bg-button-bg-secondary-filled-active text-button-text-secondary-filled border-button-border-secondary hover:border-button-border-secondary-hover active:border-button-border-secondary-active",
  "secondary-soft":
    "bg-button-bg-secondary-soft hover:bg-button-bg-secondary-soft-hover active:bg-button-bg-secondary-soft-active text-button-text-secondary-soft border-button-border-secondary hover:border-button-border-secondary-hover active:border-button-border-secondary-active",
  "secondary-ghost":
    "bg-button-bg-secondary-ghost hover:bg-button-bg-secondary-ghost-hover active:bg-button-bg-secondary-ghost-active text-button-text-secondary-ghost border-button-border-secondary hover:border-button-border-secondary-hover active:border-button-border-secondary-active",
  "danger-filled":
    "bg-button-bg-danger-filled hover:bg-button-bg-danger-filled-hover active:bg-button-bg-danger-filled-active text-button-text-danger-filled border-button-border-danger hover:border-button-border-danger-hover active:border-button-border-danger-active",
  "danger-soft":
    "bg-button-bg-danger-soft hover:bg-button-bg-danger-soft-hover active:bg-button-bg-danger-soft-active text-button-text-danger-soft border-button-border-danger hover:border-button-border-danger-hover active:border-button-border-danger-active",
  "danger-ghost":
    "bg-button-bg-danger-ghost hover:bg-button-bg-danger-ghost-hover active:bg-button-bg-danger-ghost-active text-button-text-danger-ghost border-button-border-danger hover:border-button-border-danger-hover active:border-button-border-danger-active",
  "success-filled":
    "bg-button-bg-success-filled hover:bg-button-bg-success-filled-hover active:bg-button-bg-success-filled-active text-button-text-success-filled border-button-border-success hover:border-button-border-success-hover active:border-button-border-success-active",
  "success-soft":
    "bg-button-bg-success-soft hover:bg-button-bg-success-soft-hover active:bg-button-bg-success-soft-active text-button-text-success-soft border-button-border-success hover:border-button-border-success-hover active:border-button-border-success-active",
  "success-ghost":
    "bg-button-bg-success-ghost hover:bg-button-bg-success-ghost-hover active:bg-button-bg-success-ghost-active text-button-text-success-ghost border-button-border-success hover:border-button-border-success-hover active:border-button-border-success-active",
};

const getButtonStyles = (
  type: ButtonType,
  variant: ButtonVariant,
  bordered: boolean
): string => {
  const styles = buttonStyles[`${type}-${variant}`] || "";
  if (variant === "ghost" && bordered) {
    return styles
      .split(" ")
      .filter(
        (cls) => !cls.startsWith("hover:bg-") && !cls.startsWith("active:bg-")
      )
      .join(" ");
  }

  return styles;
};

const sizeStyles: Record<ButtonSize, string> = {
  small: "px-5 h-10 text-base",
  medium: "px-7 h-12 text-xl",
  large: "px-9 h-15.5 text-2xl",
};

export const Button: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  htmlType = "button",
  type = "primary",
  variant = "filled",
  size = "medium",
  bordered = false,
  onClick,
  disabled = false,
  prefix,
  suffix,
}) => {
  const baseStyles = `flex gap-4 items-center justify-center font-unbounded rounded-sm font-regular transition-colors leading-[120%] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${getButtonStyles(type, variant, bordered)} ${bordered ? "border" : ""}`;
  const sizeStyle = sizeStyles[size as ButtonSize];

  return (
    <button
      type={htmlType}
      className={`${baseStyles} ${sizeStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
};
