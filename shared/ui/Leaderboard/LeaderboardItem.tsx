import { Avatar } from "../Avatar";
import { Typography } from "../Typography";

export type LeaderboardValueTone = "neutral" | "positive" | "negative";

export interface LeaderboardItemProps {
  position: number;
  name: string;
  avatarSrc?: string;
  value: number | string;
  tone?: LeaderboardValueTone;
  zebra?: boolean;
}

export const LeaderboardItem = ({
  position,
  name,
  avatarSrc,
  value,
  tone = "neutral",
  zebra = false,
}: LeaderboardItemProps) => {
  return (
    <div
      className="flex items-center gap-leaderboard-item rounded-leaderboard-item p-leaderboard-item"
      style={{
        backgroundColor: zebra
          ? "var(--color-leaderboard-item-zebra-bg)"
          : undefined,
      }}
    >
      <Typography.Body
        size="sm"
        as="span"
        className="shrink-0 text-right"
        style={{
          width: "var(--ryav-lb-position-width)",
          color: positionColor(position),
        }}
      >
        {position}
      </Typography.Body>

      <div className="flex min-w-0 items-center gap-user-badge">
        <Avatar
          size={24}
          shape="square"
          src={avatarSrc}
          className="shrink-0"
          aria-hidden
        >
          {name.slice(0, 1)}
        </Avatar>

        <Typography.Body
          size="lg"
          as="span"
          className="truncate"
          style={{ color: "var(--color-user-badge-name-color)" }}
        >
          {name}
        </Typography.Body>
      </div>

      <Typography.Body
        size="md"
        as="span"
        className="ml-auto shrink-0 text-right"
        style={{
          minWidth: "var(--ryav-rating-value-min-width)",
          color: `var(--color-rating-value-${tone})`,
        }}
      >
        {value}
      </Typography.Body>
    </div>
  );
};

function positionColor(position: number): string {
  if (position >= 1 && position <= 3) {
    return `var(--color-lb-position-${position})`;
  }

  return "var(--color-lb-position-default)";
}
