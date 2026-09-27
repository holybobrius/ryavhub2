import { SaveListItem as SaveListItemType } from "@/features/saves/model/models";
import { Typography } from "@/shared/ui/Typography";
import { FC } from "react";
import "./save-list-item.css";
import { IconChevronRight } from "@/shared/ui/icons";

interface SaveListItemProps {
  save: SaveListItemType;
  onSelect: (save: SaveListItemType) => void;
  selected: boolean;
}

export const SaveListItem: FC<SaveListItemProps> = ({
  save,
  onSelect,
  selected,
}) => {
  return (
    <div
      className="save-list-item"
      data-selected={selected}
      onMouseEnter={() => onSelect(save)}
    >
      <Typography.Heading size="xl">{save.name}</Typography.Heading>
      <IconChevronRight size={48} />
    </div>
  );
};
