export type QuotesSortType = "newest" | "best" | "oldest" | "worst";

export type QuoteVoteType = "Upvote" | "Downvote";

export interface Quote {
  id: number;
  quote: string;
  quoteAuthor: {
    id?: number;
    name: string;
    avatarUrl?: string;
  };
  date: Date;
  upvotes?: number;
  downvotes?: number;
  userVote?: QuoteVoteType;
}

export interface AuthorFilter {
  id: number;
  name: string;
  avatarUrl?: string;
  count: number;
}

export interface YearFilter {
  year: number;
  count: number;
}

export interface QuotesFilters {
  authors: AuthorFilter[];
  years: YearFilter[];
}

export interface QuotesByYear {
  year?: number;
  quotes: Quote[];
}
