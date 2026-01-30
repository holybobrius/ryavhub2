import Image from "next/image";
import { FC } from "react";

interface Props {
  iconPath: string;
  size?: number;
  color: string;
}

export const IconView: FC<Props> = ({ iconPath, size = 24, color }) => {
  return (
    <span className={`w-${size} h-${size} stroke-${color}`}>
      <Image src={iconPath} alt="icon" width={size} height={size} />
    </span>
  );
};
