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
    })
  );
};

export const getBestQuote = async (): Promise<Quote | null> => {
  const quotes = await getQuotesList();

  if (quotes.length === 0) {
    return null;
  }

  return quotes.reduce((best, current) => {
    const bestScore =
      (best.upvotes?.length || 0) - (best.downvotes?.length || 0);
    const currentScore =
      (current.upvotes?.length || 0) - (current.downvotes?.length || 0);

    if (currentScore > bestScore) {
      return current;
    } else if (currentScore === bestScore) {
      const bestUpvotes = best.upvotes?.length || 0;
      const currentUpvotes = current.upvotes?.length || 0;
      return currentUpvotes > bestUpvotes ? current : best;
    }
    return best;
  });
};
