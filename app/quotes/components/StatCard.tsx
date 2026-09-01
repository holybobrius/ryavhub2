import { Typography } from "@/shared/ui/Typography";

interface StatCardProps {
  label: string;
  value: string | number;
}

/**
 * Карточка со счётчиком в hero. Размер фиксирован по макету (283×146),
 * цвета/радиус/паддинги — из токенов `--*-stat-card-*`.
 *
 * Живёт в сегменте quotes: пока это единственное место использования.
 * Появится второе — переедет в shared/ui как компонент ДС (токены для
 * него у дизайнера уже есть, включая размер sm и secondary-значение).
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex h-[146px] w-[283px] flex-col justify-between rounded-[var(--ryav-stat-card-border-radius)] bg-[color:var(--color-stat-card-bg)] px-[var(--ryav-stat-card-lg-padding-x)] py-[var(--ryav-stat-card-lg-padding-y)]">
      <Typography.Body
        size="sm"
        className="text-[color:var(--color-stat-card-label-color)]"
      >
        {label}
      </Typography.Body>

      <Typography.Heading
        size="xl"
        className="text-[color:var(--color-stat-card-value-color)]"
      >
        {value}
      </Typography.Heading>
    </div>
  );
}
