"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { FileItem } from "./FileItem";
import { PictureCard } from "./PictureCard";
import "./upload.css";

export type UploadFileType = "files" | "images";

export interface UploadProps {
  fileType?: UploadFileType;
  heading?: ReactNode;
  description?: ReactNode;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  maxSize?: number;
  error?: string;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

interface UploadItem {
  file: File;
  url?: string;
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

export const Upload = ({
  fileType = "files",
  heading = "Загрузите файлы",
  description = "Перетащите их в эту область или нажмите для выбора. Можно загружать несколько файлов сразу.",
  multiple,
  accept,
  disabled,
  maxSize,
  error,
  onFilesChange,
  className,
}: UploadProps) => {
  const isImages = fileType === "images";
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string>();
  const [items, setItems] = useState<UploadItem[]>([]);

  const displayError = error ?? internalError;

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    // Ревокаем object URL при размонтировании; ref обновляем в эффекте —
    // писать в ref во время рендера нельзя.
    return () => {
      itemsRef.current.forEach((it) => it.url && URL.revokeObjectURL(it.url));
    };
  }, []);

  const commit = (next: UploadItem[]) => {
    setItems(next);
    onFilesChange?.(next.map((it) => it.file));
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || disabled) return;
    const incoming = Array.from(fileList);
    if (maxSize != null && incoming.some((f) => f.size > maxSize)) {
      setInternalError(
        `Файл превышает максимальный размер ${formatMb(maxSize)}`,
      );
    } else {
      setInternalError(undefined);
    }
    const accepted =
      maxSize != null ? incoming.filter((f) => f.size <= maxSize) : incoming;
    if (accepted.length === 0) return;

    const isDup = (f: File, list: UploadItem[]) =>
      list.some((it) => it.file.name === f.name && it.file.size === f.size);

    const base = multiple ? items : [];
    if (!multiple) base.forEach((it) => it.url && URL.revokeObjectURL(it.url));

    const fresh: UploadItem[] = accepted
      .filter((f) => !isDup(f, base))
      .map((file) => ({
        file,
        url: isImages ? URL.createObjectURL(file) : undefined,
      }));

    commit(multiple ? [...base, ...fresh] : fresh.slice(0, 1));
  };

  const removeFile = (index: number) => {
    const target = items[index];
    if (target?.url) URL.revokeObjectURL(target.url);
    commit(items.filter((_, i) => i !== index));
  };

  const resolvedAccept = accept ?? (isImages ? "image/*" : undefined);

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
        accept={resolvedAccept}
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

      {items.length > 0 &&
        (isImages ? (
          <ul className="upload__grid">
            {items.map((it, i) => (
              <li key={`${it.file.name}-${it.file.size}-${i}`}>
                <PictureCard
                  src={it.url ?? ""}
                  alt={it.file.name}
                  onRemove={disabled ? undefined : () => removeFile(i)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="upload__list">
            {items.map((it, i) => (
              <li key={`${it.file.name}-${it.file.size}-${i}`}>
                <FileItem
                  name={it.file.name}
                  size={it.file.size}
                  onRemove={disabled ? undefined : () => removeFile(i)}
                />
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
};
