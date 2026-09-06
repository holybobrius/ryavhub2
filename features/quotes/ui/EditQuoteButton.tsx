import { Button } from "@/shared/ui/Button";
import { useQuoteModal } from "../lib/providers/QuoteModalProvider";
import { IconEdit02 } from "@/shared/ui/icons";
import { Quote } from "../model/models";
import { FC } from "react";

interface EditQuoteButtonProps {
  quote: Quote;
}

export const EditQuoteButton: FC<EditQuoteButtonProps> = ({ quote }) => {
  const { openEditModal } = useQuoteModal();

  return (
    <Button
      variant="soft"
      tone="tertiary"
      rightIcon={<IconEdit02 />}
      onClick={() => openEditModal(quote)}
    />
  );
};
