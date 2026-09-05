import { Quote } from "../model/models";

export const mockQuote: Quote = {
  id: 1,
  quote: "Test quote",
  quoteAuthor: {
    name: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
  },
  date: new Date("2024-01-01"),
  upvotes: [],
  downvotes: [],
};

export const mockQuotes: Quote[] = [
  mockQuote,
  {
    id: 2,
    quote: "Another test quote",
    quoteAuthor: { name: "Another User", avatarUrl: undefined },
    date: new Date("2024-01-02"),
    upvotes: [{ id: 1, created_by: 1 }],
    downvotes: [],
  },
];
