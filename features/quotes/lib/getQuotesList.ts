import { db } from "@/lib/db";
import { Quote } from "../model/models";
import { selectBestQuotes } from "./getBestQuotes";
import { MC_AVATAR_BASE_URL } from "@/shared/const/constants";

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

    console.log(n.users_quotes_quote_byTousers);
    return {
      id: Number(n.id),
      quote: n.quote,
      quoteAuthor: {
        id: n.quote_by == null ? undefined : Number(n.quote_by),
        name: n.users_quotes_quote_byTousers?.name ?? "",
        avatarUrl: n.users_quotes_quote_byTousers?.mc_name
          ? `${MC_AVATAR_BASE_URL}${n.users_quotes_quote_byTousers?.mc_name}`
          : undefined,
      },
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
  const best = selectBestQuotes(quotes);

  if (best.length === 0) {
    return null;
  }

  return best[Math.floor(Math.random() * best.length)];
};
