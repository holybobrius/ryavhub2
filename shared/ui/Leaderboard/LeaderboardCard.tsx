import type { ReactNode } from "react";
import { Typography } from "../Typography";
import { IconDiamond } from "../icons";
import { LeaderboardItem } from "./LeaderboardItem";
import type { LeaderboardItemProps } from "./LeaderboardItem";

/** Строка лидерборда без служебных полей — их проставляет карточка. */
export type LeaderboardEntry = Omit<LeaderboardItemProps, "position" | "zebra">;

export interface LeaderboardCardProps {
  title: string;
  /** Иконка слева от заголовка. По умолчанию — ромб. */
  icon?: ReactNode;
  entries: LeaderboardEntry[];
  /** Чередование подложки строк. */
  zebra?: boolean;
}

/**
 * Карточка рейтинга: заголовок секции + строки лидерборда.
 *
 * Принимает данные (`entries`), а не готовые строки: позиции и зебру
 * карточка расставляет сама, иначе каждый вызов повторял бы эту логику.
 */
export function LeaderboardCard({
  title,
  icon,
  entries,
  zebra = true,
}: LeaderboardCardProps) {
  return (
    <section className="flex flex-col gap-[var(--ryav-leaderboard-card-gap)] rounded-[var(--ryav-leaderboard-card-border-radius)] border-[length:var(--ryav-leaderboard-card-border-width)] border-[color:var(--color-leaderboard-card-border-color)] bg-[color:var(--color-leaderboard-card-bg)] p-[var(--ryav-leaderboard-card-padding)]">
      <div className="flex items-center gap-8">
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
}
