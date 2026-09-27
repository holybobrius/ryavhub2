"use client";

import { SaveListItem as SaveListItemType } from "@/features/saves/model/models";
import { Button } from "@/shared/ui/Button";
import { IconPlus, IconSearch } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/Input";
import { FC } from "react";
import { SaveListItem } from "./SaveListItem/SaveListItem";

interface SavesListProps {
  saves: SaveListItemType[];
  onSelectSave: (save: SaveListItemType) => void;
  selectedSaveId: string | null;
}

export const SavesList: FC<SavesListProps> = ({
  saves,
  onSelectSave,
  selectedSaveId,
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex flex-col gap-space-md">
        <div className="flex gap-space-md">
          <Input
            placeholder="Введите запрос"
            size="lg"
            leftIcon={<IconSearch size={24} />}
          />
          <Button
            size="lg"
            variant="soft"
            tone="tertiary"
            rightIcon={<IconPlus size={24} />}
          >
            Добавить сейв
          </Button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none">
          {saves.map((save) => (
            <SaveListItem
              key={save.id}
              save={save}
              onSelect={onSelectSave}
              selected={save.id?.toString() === selectedSaveId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
