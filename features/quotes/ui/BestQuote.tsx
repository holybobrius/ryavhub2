"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { IconChevronLeft, IconChevronRight } from "@/shared/ui/icons";
import { QuoteCard } from "./QuoteCard";
import type { Quote } from "../models";

interface BestQuoteProps {
  /** Все цитаты с максимальным рейтингом. */
  quotes: Quote[];
  /** Внешние отступы задаёт вызывающая сторона. */
  className?: string;
}

/**
 * Шеврон стоит по центру бокового поля страницы: половина ширины поля плюс
 * половина ширины кнопки — тогда карточка занимает всю ширину контента, а
 * кнопка выходит наружу и попадает ровно в середину отступа.
 */
const CHEVRON_INSET =
  "calc((var(--ryav-grid-margin-desktop-xl) + var(--ryav-button-icon-only-md-size)) / -2)";

/**
 * Цитата-победитель. Клиентский компонент: при ничьей победителей
 * несколько, и между ними переключаются шевронами по бокам.
 *
 * Состояние — только индекс: сами цитаты приходят с сервера уже готовыми,
 * докачивать по клику нечего.
 */
export function BestQuote({ quotes, className }: BestQuoteProps) {
  const [index, setIndex] = useState(0);

  if (quotes.length === 0) return null;

  const hasMultiple = quotes.length > 1;
  // По кругу: с последней — на первую и наоборот.
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
}
