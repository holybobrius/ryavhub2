"use client";

import { useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import "./upload.css";

export interface UploadProps {
  heading?: ReactNode;
  description?: ReactNode;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  /** Максимальный размер одного файла в байтах. При превышении — ошибка. */
  maxSize?: number;
  /** Внешняя ошибка (переопределяет встроенную валидацию размера). */
  error?: string;
  /** Принятые (прошедшие валидацию) файлы. */
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 15V4m0 0L8 8m4-4l4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function formatMb(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)} МБ`;
}

export function Upload({
  heading = "Загрузите файлы",
  description = "Перетащите их в эту область или нажмите для выбора. Можно загружать несколько файлов сразу.",
  multiple,
  accept,
  disabled,
  maxSize,
  error,
  onFilesChange,
  className,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string>();

  const displayError = error ?? internalError;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || disabled) return;
    const files = Array.from(fileList);
    if (maxSize != null && files.some((f) => f.size > maxSize)) {
      setInternalError(
        `Файл превышает максимальный размер ${formatMb(maxSize)}`,
      );
    } else {
      setInternalError(undefined);
    }
    const accepted =
      maxSize != null ? files.filter((f) => f.size <= maxSize) : files;
    onFilesChange?.(accepted);
  };

  const onDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={["upload", className].filter(Boolean).join(" ")}
      data-dragging={dragging ? "true" : undefined}
      data-error={displayError ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        className="upload__zone"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="upload__icon">
          <UploadIcon />
        </span>
        <span className="upload__heading">{heading}</span>
        <span className="upload__desc">{description}</span>
        {displayError && <span className="upload__error">{displayError}</span>}
      </button>
    </div>
  );
}
