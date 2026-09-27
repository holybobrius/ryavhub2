"use client";

import { SaveListItem as SaveListItemType } from "@/features/saves/model/models";
import { FC, useState } from "react";
import { SavePreview } from "./SavePreview";
import { SavesList } from "./SaveList/SavesList";

interface SaveBrowserProps {
  saves: SaveListItemType[];
}

export const SaveBrowser: FC<SaveBrowserProps> = ({ saves }) => {
  const [selectedSave, setSelectedSave] = useState<SaveListItemType | null>(
    saves[0] ?? null,
  );

  const handleSelectSave = (save: SaveListItemType) => {
    setSelectedSave(save);
  };

  return (
    <div className="flex gap-space-md w-full">
      <SavesList
        saves={saves}
        onSelectSave={handleSelectSave}
        selectedSaveId={selectedSave?.id?.toString() ?? null}
      />
      <SavePreview selectedSave={selectedSave ?? undefined} />
    </div>
  );
};
