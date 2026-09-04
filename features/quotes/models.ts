export type QuoteRanking = {
  id: number;
  created_by: number;
};

export interface Quote {
  id: number;
  quote: string;
  quoteAuthor: {
    // Нужен для группировки: имена авторов не уникальны.
    id?: number;
    name: string;
    avatarUrl?: string;
  };
  date: Date;
  upvotes?: QuoteRanking[];
  downvotes?: QuoteRanking[];
}
