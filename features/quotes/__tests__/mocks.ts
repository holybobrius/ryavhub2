import { Quote } from "../model/models";

export const mockQuote: Quote = {
  id: 1,
  quote: "Test quote",
  quoteAuthor: {
    name: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
  },
  date: new Date("2024-01-01"),
  upvotes: 0,
  downvotes: 0,
};

export const mockQuotes: Quote[] = [
  mockQuote,
  {
    id: 2,
    quote: "Another test quote",
    quoteAuthor: { name: "Another User", avatarUrl: undefined },
    date: new Date("2024-01-02"),
    upvotes: 1,
    downvotes: 0,
    userVote: "Upvote",
  },
];
