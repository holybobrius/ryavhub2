export type QuoteRanking = {
  id: number;
  created_by: number;
};

export interface Quote {
  id: number;
  quote: string;
  quoteAuthor: {
    /** id автора фразы (quotes.quote_by). Нужен для группировки: имена
     *  не уникальны. Отсутствует, если автор в цитате не проставлен. */
    id?: number;
    name: string;
    avatarUrl?: string;
  };
  date: Date;
  upvotes?: QuoteRanking[];
  downvotes?: QuoteRanking[];
}
