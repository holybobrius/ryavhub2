import { FC, PropsWithChildren } from "react";

type LabelSize = 10 | 12 | 13 | 14;

interface Props {
  className?: string;
  size?: LabelSize;
}

export const Label: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  size = 12,
}) => {
  const labelStyles: Record<LabelSize, string> = {
    10: "text-[0.625rem]",
    12: "text-xs",
    13: "text-[0.8125rem]",
    14: "text-sm",
  };

  return (
    <span
      className={`font-geologica leading-[110%] ${labelStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
