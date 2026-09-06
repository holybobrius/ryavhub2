"use client";

import { Button, ButtonProps } from "@/shared/ui/Button";
import { useQuoteModal } from "../lib/providers/QuoteModalProvider";
import { FC } from "react";

export const AddQuoteTrigger: FC<ButtonProps> = (props) => {
  const { openAddModal } = useQuoteModal();

  return <Button {...props} onClick={openAddModal} />;
};
