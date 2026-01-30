import { FC, PropsWithChildren } from "react";

type TextSize = 16 | 18 | 20 | 24 | 28 | 32 | 40 | 44;

interface Props {
  className?: string;
  size?: TextSize;
}

export const Text: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  size = 24,
}) => {
  const textStyles: Record<TextSize, string> = {
    16: "text-base",
    18: "text-lg",
    20: "text-xl",
    24: "text-2xl",
    28: "text-[1.75rem]",
    32: "text-[2rem]",
    40: "text-[2.5rem]",
    44: "text-[2.75rem]",
  };

  return (
    <p
      className={`font-geologica leading-[110%] font-light ${textStyles[size]} ${className}`}
    >
      {children}
    </p>
  );
};
