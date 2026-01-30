export type QuoteRanking = {
  id: number;
  created_by: number;
};

export interface Quote {
  id: number;
  quote: string;
  quoteAuthor: {
    name: string;
    avatarUrl?: string;
  };
  date: Date;
  upvotes?: QuoteRanking[];
  downvotes?: QuoteRanking[];
}
