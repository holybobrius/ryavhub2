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

const CHEVRON_INSET =
  "calc((var(--ryav-grid-margin-desktop-xl) + var(--ryav-button-icon-only-md-size)) / -2)";

export const BestQuote = ({ quotes, className }: BestQuoteProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeIndex = Math.max(
    0,
    quotes.findIndex((quote) => quote.id === activeId),
  );

  if (quotes.length === 0) return null;

  const hasMultiple = quotes.length > 1;

  const shift = (step: number) =>
    setActiveId(
      quotes[(activeIndex + step + quotes.length) % quotes.length]?.id,
    );

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

      <QuoteCard quote={quotes[activeIndex]} isBest />

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
