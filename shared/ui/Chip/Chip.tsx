"use client";

import Image from "next/image";
import { FC } from "react";
import { Typography } from "../Typography";
import { Avatar } from "../Avatar/Avatar";

type ChipType = "primary" | "secondary" | "danger" | "success";
type ChipVariant = "filled" | "soft" | "ghost";

interface Props {
  text: string;
  avatar?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type: ChipType;
  variant: ChipVariant;
  bordered?: boolean;
  disabled?: boolean;
  className?: string;
}

const chipStyles: Record<`${ChipType}-${ChipVariant}`, string> = {
  "primary-filled":
    "bg-chip-bg-primary-filled text-chip-text-primary-filled border-chip-border-primary",
  "primary-soft":
    "bg-chip-bg-primary-soft text-chip-text-primary-soft border-chip-border-primary",
  "primary-ghost":
    "bg-chip-bg-primary-ghost text-chip-text-primary-ghost border-chip-border-primary",
  "secondary-filled":
    "bg-chip-bg-secondary-filled text-chip-text-secondary-filled border-chip-border-secondary",
  "secondary-soft":
    "bg-chip-bg-secondary-soft text-chip-text-secondary-soft border-chip-border-secondary",
  "secondary-ghost":
    "bg-chip-bg-secondary-ghost text-chip-text-secondary-ghost border-chip-border-secondary",
  "danger-filled":
    "bg-chip-bg-danger-filled text-chip-text-danger-filled border-chip-border-danger",
  "danger-soft":
    "bg-chip-bg-danger-soft text-chip-text-danger-soft border-chip-border-danger",
  "danger-ghost":
    "bg-chip-bg-danger-ghost text-chip-text-danger-ghost border-chip-border-danger",
  "success-filled":
    "bg-chip-bg-success-filled text-chip-text-success-filled border-chip-border-success",
  "success-soft":
    "bg-chip-bg-success-soft text-chip-text-success-soft border-chip-border-success",
  "success-ghost":
    "bg-chip-bg-success-ghost text-chip-text-success-ghost border-chip-border-success",
};

export const Chip: FC<Props> = ({
  text,
  avatar,
  prefix,
  suffix,
  type,
  variant,
  bordered = false,
  disabled = false,
  className = "",
}) => {
  const styles = disabled
    ? "bg-chip-bg-disabled text-chip-text-disabled border-chip-border-disabled"
    : chipStyles[`${type}-${variant}`] || "";

  return (
    <div
      className={`flex items-center rounded-sm gap-2 px-2 py-1 text-md ${styles} ${bordered ? "border" : ""} ${className}`}
    >
      {prefix}
      {avatar && (
        <Avatar src={avatar} name={text} className="w-5 h-5 rounded-full" />
      )}
      <Typography.Text size={16}>{text}</Typography.Text>
      {suffix}
    </div>
  );
};
