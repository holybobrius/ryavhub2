import { db } from "@/lib/db";

export interface QuotesStats {
  /** Сколько всего цитат в коллекции. */
  quotesCount: number;
  /** Сколько всего оценок поставлено (плюсы и минусы вместе). */
  rankingsCount: number;
}

/**
 * Счётчики для hero страницы цитат.
 *
 * Два COUNT(*) вместо getQuotesList(): тот выгружает все цитаты, все оценки
 * и делает запрос за автором на каждую цитату — для двух чисел это лишнее.
 * Запросы независимы, поэтому идут параллельно.
 */
export const getQuotesStats = async (): Promise<QuotesStats> => {
  const [quotesCount, rankingsCount] = await Promise.all([
    db.quotes.count(),
    db.quote_rankings.count(),
  ]);

  return { quotesCount, rankingsCount };
};
