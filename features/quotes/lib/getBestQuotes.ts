import type { Quote } from "../model/models";

export const quoteScore = (quote: Quote): number =>
  (quote.upvotes ?? 0) - (quote.downvotes ?? 0);

export function selectBestQuotes(quotes: Quote[]): Quote[] {
  if (quotes.length === 0) return [];

  const topScore = Math.max(...quotes.map(quoteScore));

  return quotes.filter((quote) => quoteScore(quote) === topScore);
}
