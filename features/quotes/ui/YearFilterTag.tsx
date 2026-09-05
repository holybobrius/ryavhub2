import { Typography } from "@/shared/ui/Typography";

interface YearFilterTagProps {
  year: number;
  count: number;
  active: boolean;
  onClick: () => void;
}

export const YearFilterTag = ({
  year,
  count,
  active,
  onClick,
}: YearFilterTagProps) => {
  return (
    <button
      key={year}
      type="button"
      className="quotes-filters__year"
      data-active={active}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Typography.Body size="sm" as="span">
          {year}
        </Typography.Body>
        <Typography.Label
          size="md"
          as="span"
          className="quotes-filters__year-count"
        >
          {count}
        </Typography.Label>
      </div>
    </button>
  );
};
