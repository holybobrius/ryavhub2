import type { Quote } from "./models";

export const quoteScore = (quote: Quote): number =>
  (quote.upvotes?.length ?? 0) - (quote.downvotes?.length ?? 0);

export function selectBestQuotes(quotes: Quote[]): Quote[] {
  if (quotes.length === 0) return [];

  const topScore = Math.max(...quotes.map(quoteScore));

  return quotes.filter((quote) => quoteScore(quote) === topScore);
}
