import type { ReactNode } from "react";
import { IconFileAttach } from "../icons";
import "./upload.css";

export interface FileItemProps {
  name: string;
  /** Размер в байтах (показывается в мете, если нет ошибки). */
  size?: number;
  /** Прогресс загрузки 0–100 (показывает полосу). */
  progress?: number;
  /** Текст ошибки — красная рамка/мета вместо размера. */
  error?: string;
  /** Успешная загрузка — зелёная мета, прогресс скрыт. `error` важнее. */
  success?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  className?: string;
}

const RemoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export const FileItem = ({
  name,
  size,
  progress,
  error,
  success,
  icon,
  onRemove,
  className,
}: FileItemProps) => {
  // error важнее success; успех подсвечивает мету зелёным.
  const isSuccess = success && !error;
  const sizeText = size != null ? formatSize(size) : undefined;
  let meta: string | undefined;
  if (error) {
    meta = error;
  } else if (isSuccess) {
    meta = sizeText ? `${sizeText} — Загружено` : "Загружено";
  } else {
    meta = sizeText;
  }

  return (
    <div
      className={["file-item", className].filter(Boolean).join(" ")}
      data-error={error ? "true" : undefined}
      data-success={isSuccess ? "true" : undefined}
    >
      <span className="file-item__icon">{icon ?? <IconFileAttach />}</span>
      <div className="file-item__content">
        <span className="file-item__name">{name}</span>
        {meta && <span className="file-item__meta">{meta}</span>}
        {progress != null && !isSuccess && (
          <div className="file-item__progress">
            <div
              className="file-item__progress-fill"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          className="file-item__action"
          onClick={onRemove}
          aria-label={`Удалить ${name}`}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
};
