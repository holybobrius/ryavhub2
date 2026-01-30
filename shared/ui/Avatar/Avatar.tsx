"use client";

import Image from "next/image";
import { FC, useState } from "react";

type AvatarType = "primary" | "secondary" | "danger" | "success";

interface Props {
  type?: AvatarType;
  src: string;
  name: string;
  size?: number;
  bordered?: boolean;
  className?: string;
}

export const Avatar: FC<Props> = ({
  src,
  name,
  size = 40,
  type = "primary",
  bordered = false,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const avatarStyles: Record<AvatarType, string> = {
    primary:
      "bg-avatar-bg-primary text-avatar-content-primary border-avatar-border-primary",
    secondary:
      "bg-avatar-bg-secondary text-avatar-content-secondary border-avatar-border-secondary",
    danger:
      "bg-avatar-bg-danger text-avatar-content-danger border-avatar-border-danger",
    success:
      "bg-avatar-bg-success text-avatar-content-success border-avatar-border-success",
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitial = () => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  if (imageError || !src) {
    return (
      <div
        className={`rounded-full flex items-center justify-center ${bordered ? "border" : ""} ${avatarStyles[type]} ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          fontWeight: 500,
        }}
      >
        {getInitial()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={handleImageError}
    />
  );
};
