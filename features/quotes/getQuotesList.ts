import { db } from "@/lib/db";
import { Quote } from "./models";

/**
 * Все цитаты с автором и оценками.
 *
 * Один запрос с `include`: Prisma забирает автора и оценки вместе с
 * цитатами (JOIN на стороне БД). Раньше здесь был N+1 — отдельный
 * SELECT за пользователем на каждую цитату, то есть 160+ запросов
 * на текущем объёме.
 */
export const getQuotesList = async (): Promise<Quote[]> => {
  const quotes = await db.quotes.findMany({
    include: {
      users_quotes_quote_byTousers: true,
      quote_rankings: true,
    },
  });

  return quotes.map((n) => {
    const rankings = n.quote_rankings ?? [];
    const byType = (type: "Upvote" | "Downvote") =>
      rankings
        .filter((r) => r.type === type)
        .map((r) => ({ id: Number(r.id), created_by: Number(r.created_by) }));

    return {
      id: Number(n.id),
      quote: n.quote,
      quoteAuthor: { name: n.users_quotes_quote_byTousers?.name ?? "" },
      date: n.date || new Date(),
      upvotes: byType("Upvote"),
      downvotes: byType("Downvote"),
    };
  });
};

export const getBestQuote = async (
  preloadedQuotes?: Quote[],
): Promise<Quote | null> => {
  const quotes = preloadedQuotes ?? (await getQuotesList());

  if (quotes.length === 0) {
    return null;
  }

  const quotesWithScores = quotes.map((quote) => ({
    quote,
    score: (quote.upvotes?.length || 0) - (quote.downvotes?.length || 0),
  }));

  const maxScore = Math.max(...quotesWithScores.map((q) => q.score));

  const bestQuotes = quotesWithScores
    .filter((q) => q.score === maxScore)
    .map((q) => q.quote);

  return bestQuotes[Math.floor(Math.random() * bestQuotes.length)];
};
