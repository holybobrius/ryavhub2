import "./upload.css";

export interface PictureCardProps {
  src: string;
  alt?: string;
  /** Прогресс загрузки 0–100 — показывает оверлей с процентом и полосой. */
  progress?: number;
  /** Ошибка — красная рамка + оверлей с иконкой. */
  error?: boolean;
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

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 8v5m0 3h.01M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PictureCard = ({
  src,
  alt,
  progress,
  error,
  onRemove,
  className,
}: PictureCardProps) => {
  return (
    <div
      className={["picture-card", className].filter(Boolean).join(" ")}
      data-error={error ? "true" : undefined}
    >
      {/* object URL — next/image не подходит, используем нативный img */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="picture-card__img" src={src} alt={alt ?? ""} />

      {progress != null && !error && (
        <div className="picture-card__overlay">
          <span className="picture-card__progress-text">
            {Math.round(progress)}%
          </span>
          <div className="picture-card__progress">
            <div
              className="picture-card__progress-fill"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="picture-card__error">
          <ErrorIcon />
        </div>
      )}

      {onRemove && (
        <button
          type="button"
          className="picture-card__remove"
          onClick={onRemove}
          aria-label="Удалить"
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
};
