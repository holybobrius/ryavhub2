"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Quote } from "../../model/models";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteFormValues, quoteSchema } from "../../model/addQuoteSchema";
import dayjs from "dayjs";

type QuoteModalState =
  { mode: "closed" } | { mode: "add" } | { mode: "edit"; quote: Quote };

type QuoteModalContextType = {
  state: QuoteModalState;
  openAddModal: () => void;
  openEdit: (quote: Quote) => void;
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
  const [state, setState] = useState<QuoteModalState>({ mode: "closed" });

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: EMPTY,
  });

  const openAddModal = () => {
    form.reset(EMPTY);
    setState({ mode: "add" });
  };

  const openEdit = (quote: Quote) => {
    form.reset({
      quote: quote.quote,
      date: dayjs(quote.date).format("YYYY-MM-DD"),
      authorId: String(quote.quoteAuthor.id ?? ""),
    });
    setState({ mode: "edit", quote });
  };

  const close = () => {
    setState({ mode: "closed" });
    form.reset(EMPTY);
  };

  return (
    <QuoteModalContext value={{ state, openAddModal, form, openEdit, close }}>
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
