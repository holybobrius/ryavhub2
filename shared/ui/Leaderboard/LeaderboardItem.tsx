import { Avatar } from "../Avatar";
import { Typography } from "../Typography";

export type LeaderboardValueTone = "neutral" | "positive" | "negative";

export interface LeaderboardItemProps {
  /** Место в рейтинге, начиная с 1. Первые три цвета — свои токены. */
  position: number;
  name: string;
  avatarSrc?: string;
  value: number | string;
  /** Окраска значения: нейтральное / зелёное / красное. */
  tone?: LeaderboardValueTone;
  /** Подложка «зебры». В карточке расставляется автоматически. */
  zebra?: boolean;
}

/**
 * Строка лидерборда: позиция + пользователь + значение.
 *
 * Позиция и значение — колонки фиксированной ширины
 * (`--ryav-lb-position-width`, `--ryav-rating-value-min-width`), поэтому
 * имена начинаются на одной вертикали независимо от числа знаков.
 */
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

      {/* user badge: аватар + ник. Токены --ryav-user-badge-* */}
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
          size="sm"
          as="span"
          className="truncate"
          style={{ color: "var(--color-user-badge-name-color)" }}
        >
          {name}
        </Typography.Body>
      </div>

      <Typography.Body
        size="sm"
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

/**
 * Призовые места подсвечены по убыванию яркости, остальные — тусклым
 * `default`. Значения приходят из токенов `--color-lb-position-*`.
 */
function positionColor(position: number): string {
  if (position >= 1 && position <= 3) {
    return `var(--color-lb-position-${position})`;
  }

  return "var(--color-lb-position-default)";
}
