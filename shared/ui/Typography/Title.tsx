"use client";

import { FC, PropsWithChildren } from "react";

type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  level?: TitleLevel;
  className?: string;
}

const titleStyles = {
  1: "text-5xl font-regular",
  2: "text-[2.5rem] font-regular",
  3: "text-[1.75rem] font-regular",
  4: "text-[1.5rem] font-regular",
  5: "text-[1.25rem] font-regular",
  6: "text-[1rem] font-regular",
};

export const Title: FC<PropsWithChildren<Props>> = ({
  children,
  level = 1,
  className,
}) => {
  const TitleTag = `h${level}` as const;
  return (
    <TitleTag
      className={`font-unbounded leading-[120%] ${titleStyles[level]} ${className}`}
    >
      {children}
    </TitleTag>
  );
};
