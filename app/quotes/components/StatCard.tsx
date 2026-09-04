import { Typography } from "@/shared/ui/Typography";

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="flex h-[146px] w-[283px] flex-col justify-between rounded-stat-card bg-stat-card-bg p-stat-card">
      <Typography.Body size="sm" className="text-stat-card-label-color">
        {label}
      </Typography.Body>

      <Typography.Heading size="xl" className="text-stat-card-value-color">
        {value}
      </Typography.Heading>
    </div>
  );
};
