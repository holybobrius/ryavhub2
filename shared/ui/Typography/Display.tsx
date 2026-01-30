import { FC, PropsWithChildren } from "react";

interface Props {
  className?: string;
  level?: 1 | 2 | 3 | 4;
}

export const Display: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  level = 1,
}) => {
  const displayStyles = {
    1: "text-8xl font-bold",
    2: "text-[4.875rem] font-bold",
    3: "text-7xl font-bold",
    4: "text-6xl font-bold",
  };

  const DisplayTag = `h${level}` as const;
  return (
    <DisplayTag
      className={`font-unbounded leading-[110%] ${displayStyles[level]} ${className}`}
    >
      {children}
    </DisplayTag>
  );
};
