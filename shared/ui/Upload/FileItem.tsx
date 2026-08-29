import type { ReactNode } from "react";
import "./upload.css";

export interface FileItemProps {
  name: string;
  /** Размер в байтах (показывается в мете, если нет ошибки). */
  size?: number;
  /** Прогресс загрузки 0–100 (показывает полосу). */
  progress?: number;
  /** Текст ошибки — красная рамка/мета вместо размера. */
  error?: string;
  icon?: ReactNode;
  onRemove?: () => void;
  className?: string;
}

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

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

export function FileItem({
  name,
  size,
  progress,
  error,
  icon,
  onRemove,
  className,
}: FileItemProps) {
  const meta = error ?? (size != null ? formatSize(size) : undefined);

  return (
    <div
      className={["file-item", className].filter(Boolean).join(" ")}
      data-error={error ? "true" : undefined}
    >
      <span className="file-item__icon">{icon ?? <FileIcon />}</span>
      <div className="file-item__content">
        <span className="file-item__name">{name}</span>
        {meta && <span className="file-item__meta">{meta}</span>}
        {progress != null && (
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
}
