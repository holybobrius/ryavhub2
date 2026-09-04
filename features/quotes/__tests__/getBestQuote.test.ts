import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getBestQuote } from "../getQuotesList";
import { mockDb } from "./mockDb";

mock.module("@/lib/db", () => ({ db: mockDb }));

const mockGetUserById = mock(async (id: number) => {
  const users = [
    { id: 1, name: "User 1", avatarUrl: "" },
    { id: 2, name: "User 2", avatarUrl: "" },
  ];
  return users.find((u) => u.id === id);
});

mock.module("../users/getUsersList", () => ({
  getUserById: mockGetUserById,
}));

describe("getBestQuote", () => {
  beforeEach(() => {
    mockGetUserById.mockClear();
  });

  it("should return null when no quotes exist", async () => {
    mockDb.quotes.findMany.mockResolvedValueOnce([]);

    const result = await getBestQuote();

    expect(result).toBeNull();
  });

  it("should return quote with highest score", async () => {
    mockDb.quotes.findMany.mockResolvedValueOnce([
      {
        id: 1n,
        quote: "Quote 1",
        quote_by: 1n,
        date: new Date(),
        users_quotes_quote_byTousers: { id: 1n, name: "User 1" },
        quote_rankings: [
          { id: 1n, quote_id: 1n, created_by: 1n, type: "Upvote" as const },
        ],
      },
      {
        id: 2n,
        quote: "Quote 2",
        quote_by: 2n,
        date: new Date(),
        users_quotes_quote_byTousers: { id: 2n, name: "User 2" },
        quote_rankings: [],
      },
    ]);

    const result = await getBestQuote();

    expect(result?.id).toBe(1);
  });

  it("should return a quote when all scores are equal", async () => {
    mockDb.quotes.findMany.mockResolvedValueOnce([
      {
        id: 1n,
        quote: "Quote 1",
        quote_by: 1n,
        date: new Date(),
        users_quotes_quote_byTousers: { id: 1n, name: "User 1" },
        quote_rankings: [],
      },
      {
        id: 2n,
        quote: "Quote 2",
        quote_by: 2n,
        date: new Date(),
        users_quotes_quote_byTousers: { id: 2n, name: "User 2" },
        quote_rankings: [],
      },
    ]);

    const result = await getBestQuote();

    expect(result).not.toBeNull();
    expect([1, 2]).toContain(result!.id);
  });
});
