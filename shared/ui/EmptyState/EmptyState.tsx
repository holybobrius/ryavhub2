import { IconTile } from "../IconTile";
import { Typography } from "../Typography";
import "./empty-state.css";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-space-lg">
      <IconTile size="large" icon={icon} secondary />
      <div className="flex flex-col items-center justify-center gap-space-xs">
        <Typography.Body size="lg">{title}</Typography.Body>
        <Typography.Body className="empty-state-description" size="sm">
          {description}
        </Typography.Body>
      </div>
      {action}
    </div>
  );
};
