import { db } from "@/lib/db";
import { Quote } from "./models";
import { getUserById } from "../users/getUsersList";

export const getQuotesList = async (): Promise<Quote[]> => {
  const quotes = await db.quotes.findMany();
  const rankings = await db.quote_rankings.findMany();
  return Promise.all(
    quotes.map(async (n) => {
      const quoteAuthor = await getUserById(Number(n.quote_by));
      return {
        id: Number(n.id),
        quote: n.quote,
        quoteAuthor: quoteAuthor
          ? {
              name: quoteAuthor.name,
              avatarUrl: quoteAuthor.avatarUrl,
            }
          : {
              name: "",
            },
        date: n.date || new Date(),
        upvotes: rankings
          .filter((r) => r.quote_id === n.id && r.type === "Upvote")
          .map((r) => ({
            id: Number(r.id),
            created_by: Number(r.created_by),
          })),
        downvotes: rankings
          .filter((r) => r.quote_id === n.id && r.type === "Downvote")
          .map((r) => ({
            id: Number(r.id),
            created_by: Number(r.created_by),
          })),
      };
    }),
  );
};

export const getBestQuote = async (): Promise<Quote | null> => {
  const quotes = await getQuotesList();

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
