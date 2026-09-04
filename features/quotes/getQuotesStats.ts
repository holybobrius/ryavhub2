import { db } from "@/lib/db";

export interface QuotesStats {
  quotesCount: number;
  rankingsCount: number;
}

export const getQuotesStats = async (): Promise<QuotesStats> => {
  const [quotesCount, rankingsCount] = await Promise.all([
    db.quotes.count(),
    db.quote_rankings.count(),
  ]);

  return { quotesCount, rankingsCount };
};
