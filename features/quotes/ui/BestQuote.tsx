"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/shared/ui/icons";
import { QuoteCard } from "./QuoteCard";
import type { Quote } from "../model/models";

interface BestQuoteProps {
  quotes: Quote[];
  className?: string;
}

// Шеврон — по центру бокового поля страницы: половина ширины поля плюс
// половина ширины кнопки, тогда карточка занимает всю ширину контента.
const CHEVRON_INSET =
  "calc((var(--ryav-grid-margin-desktop-xl) + var(--ryav-button-icon-only-md-size)) / -2)";

export const BestQuote = ({ quotes, className }: BestQuoteProps) => {
  const [index, setIndex] = useState(0);

  if (quotes.length === 0) return null;

  const hasMultiple = quotes.length > 1;

  const shift = (step: number) =>
    setIndex((current) => (current + step + quotes.length) % quotes.length);

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      {hasMultiple && (
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: CHEVRON_INSET }}
        >
          <Button
            variant="ghost"
            tone="secondary"
            size="md"
            aria-label="Предыдущая цитата-победитель"
            onClick={() => shift(-1)}
            leftIcon={<IconChevronLeft />}
          />
        </div>
      )}

      <QuoteCard quote={quotes[index]} isBest />

      {hasMultiple && (
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ right: CHEVRON_INSET }}
        >
          <Button
            variant="ghost"
            tone="secondary"
            size="md"
            aria-label="Следующая цитата-победитель"
            onClick={() => shift(1)}
            leftIcon={<IconChevronRight />}
          />
        </div>
      )}
    </div>
  );
};
