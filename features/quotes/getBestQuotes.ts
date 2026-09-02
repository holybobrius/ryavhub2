import type { Quote } from "./models";

/** Рейтинг цитаты: плюсы минус минусы. */
export const quoteScore = (quote: Quote): number =>
  (quote.upvotes?.length ?? 0) - (quote.downvotes?.length ?? 0);

/**
 * Все цитаты с максимальным рейтингом — победителей может быть несколько.
 * Порядок исходного списка сохраняется.
 */
export function selectBestQuotes(quotes: Quote[]): Quote[] {
  if (quotes.length === 0) return [];

  const topScore = Math.max(...quotes.map(quoteScore));

  return quotes.filter((quote) => quoteScore(quote) === topScore);
}
