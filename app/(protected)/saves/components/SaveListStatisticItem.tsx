import { Typography } from "@/shared/ui/Typography";
import { FC } from "react";

interface SaveListStatisticItemProps {
  title: string;
  value: string;
}

export const SaveListStatisticItem: FC<SaveListStatisticItemProps> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full border-l-1 border-action-stat-divider-color">
      <Typography.Body size="sm" className="text-stat-item-label-color">
        {title}
      </Typography.Body>
      <Typography.Heading size="sm">{value}</Typography.Heading>
    </div>
  );
};
