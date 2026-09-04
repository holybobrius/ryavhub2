import type { ReactNode } from "react";
import { Typography } from "../Typography";
import { IconDiamond } from "../icons";
import { LeaderboardItem } from "./LeaderboardItem";
import type { LeaderboardItemProps } from "./LeaderboardItem";

export type LeaderboardEntry = Omit<LeaderboardItemProps, "position" | "zebra">;

export interface LeaderboardCardProps {
  title: string;
  icon?: ReactNode;
  entries: LeaderboardEntry[];
  zebra?: boolean;
}

export const LeaderboardCard = ({
  title,
  icon,
  entries,
  zebra = true,
}: LeaderboardCardProps) => {
  return (
    <section className="flex flex-col gap-leaderboard-card rounded-leaderboard-card border-leaderboard-card border-leaderboard-card-border-color bg-leaderboard-card-bg p-leaderboard-card">
      <div className="flex items-center gap-space-2xs">
        <span
          className="flex shrink-0"
          style={{ color: "var(--color-leaderboard-card-icon-color)" }}
        >
          {icon ?? <IconDiamond size={20} />}
        </span>

        <Typography.Label
          size="md"
          style={{ color: "var(--color-leaderboard-card-title-color)" }}
        >
          {title}
        </Typography.Label>
      </div>

      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <LeaderboardItem
            key={`${entry.name}-${index}`}
            {...entry}
            position={index + 1}
            zebra={zebra && index % 2 === 0}
          />
        ))}
      </div>
    </section>
  );
};
