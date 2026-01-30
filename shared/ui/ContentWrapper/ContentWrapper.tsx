"use client";

import { FC, PropsWithChildren } from "react";

interface Props {
  className?: string;
}

export const ContentWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  return <div className={`px-15 ${className}`}>{children}</div>;
};
