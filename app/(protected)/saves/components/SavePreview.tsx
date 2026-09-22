"use client";

import { SaveListItem } from "@/features/saves/model/models";
import { FC } from "react";
import { SaveListStatisticItem } from "./SaveListStatisticItem";
import { Button } from "@/shared/ui/Button";
import { IconDownload } from "@/shared/ui/icons";
import { SaveListItemImage } from "./SaveListItemImage";

interface SavePreviewProps {
  selectedSave?: SaveListItem;
}

export const SavePreview: FC<SavePreviewProps> = ({ selectedSave }) => {
  return (
    <div className="w-full flex flex-col gap-space-md">
      <div className="flex items-center justify-center bg-surface-bg-layout rounded-xs aspect-242/165 relative overflow-hidden">
        <SaveListItemImage
          src={selectedSave?.imageUrl}
          alt={selectedSave?.name ?? "Save preview"}
          fill
          sizes="50vw"
          className="object-cover rounded-xs"
        />
      </div>
      <div className="flex items-center">
        <div className="flex flex-1 border-r-1 border-action-stat-divider-color">
          <SaveListStatisticItem
            title="Год"
            value={String(selectedSave?.year) ?? ""}
          />
          <SaveListStatisticItem
            title="Версия"
            value={String(selectedSave?.version) ?? "-"}
          />
          <SaveListStatisticItem
            title="Размер"
            value={String(selectedSave?.size) ?? "-"}
          />
          <div className="border-l-1 border-action-stat-divider-color px-space-md">
            <a
              href={selectedSave?.downloadUrl ?? ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                leftIcon={<IconDownload />}
                size="lg"
                tone="tertiary"
                variant="soft"
                disabled={!selectedSave?.downloadUrl}
              >
                Скачать
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
