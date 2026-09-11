"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Quote } from "../../model/models";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteFormValues, quoteSchema } from "../../model/addQuoteSchema";
import dayjs from "dayjs";

type QuoteModalTarget = { mode: "add" } | { mode: "edit"; quote: Quote };

type QuoteModalContextType = {
  state: QuoteModalTarget;
  openAddModal: () => void;
  openEditModal: (quote: Quote) => void;
  open: boolean;
  close: () => void;
  form: UseFormReturn<QuoteFormValues>;
};

const EMPTY: QuoteFormValues = {
  quote: "",
  date: "",
  authorId: "",
};

const QuoteModalContext = createContext<QuoteModalContextType | null>(null);

export const QuoteModalProvider = ({ children }: PropsWithChildren) => {
  const [target, setTarget] = useState<QuoteModalTarget>({ mode: "add" });
  const [open, setOpen] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: EMPTY,
  });

  const openAddModal = () => {
    form.reset(EMPTY);
    setTarget({ mode: "add" });
    setOpen(true);
  };

  const openEditModal = (quote: Quote) => {
    form.reset({
      quote: quote.quote,
      date: dayjs(quote.date).format("YYYY-MM-DD"),
      authorId: String(quote.quoteAuthor.id ?? ""),
    });
    setTarget({ mode: "edit", quote });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    form.reset(EMPTY);
  };

  return (
    <QuoteModalContext
      value={{ state: target, openAddModal, form, open, openEditModal, close }}
    >
      {children}
    </QuoteModalContext>
  );
};

export const useQuoteModal = () => {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error("useQuoteModal must be used within a QuoteModalProvider");
  }
  return context;
};
