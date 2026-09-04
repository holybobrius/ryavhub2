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
    <div className="flex h-[146px] w-[283px] flex-col justify-between rounded-stat-card bg-stat-card-bg p-stat-card">
      <Typography.Body size="sm" className="text-stat-card-label-color">
        {label}
      </Typography.Body>

      <Typography.Heading size="xl" className="text-stat-card-value-color">
        {value}
      </Typography.Heading>
    </div>
  );
}
