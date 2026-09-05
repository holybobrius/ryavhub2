import { describe, it, expect, beforeEach, mock } from "bun:test";
import { getQuotesList } from "../lib/getQuotesList";
import { mockDb } from "./mockDb";

mock.module("@/lib/db", () => ({
  db: mockDb,
}));

describe("getQuotesList", () => {
  beforeEach(() => {
    mockDb.quotes.findMany.mockClear();
  });

  it("should return empty array when no quotes exist", async () => {
    mockDb.quotes.findMany.mockResolvedValueOnce([]);

    const result = await getQuotesList();

    expect(result).toEqual([]);
  });

  it("should map quotes with author and rankings", async () => {
    const result = await getQuotesList();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 1,
      quote: "Test quote",
      upvotes: 0,
      downvotes: 0,
    });
    expect(result[1]).toMatchObject({
      id: 2,
      quote: "Another quote",
      upvotes: 1,
      downvotes: 0,
    });
  });

  it("should take the author from the included relation", async () => {
    const result = await getQuotesList();

    expect(result[0].quoteAuthor.name).toBe("User 1");
    expect(result[1].quoteAuthor.name).toBe("User 2");
  });

  it("should leave userVote undefined for an anonymous visitor", async () => {
    const result = await getQuotesList();

    expect(result[0].userVote).toBeUndefined();
    expect(result[1].userVote).toBeUndefined();
  });

  it("should mark the vote of the current user", async () => {
    const result = await getQuotesList(1);

    expect(result[0].userVote).toBeUndefined();
    expect(result[1].userVote).toBe("Upvote");
  });

  it("should not mark votes cast by other users", async () => {
    const result = await getQuotesList(2);

    expect(result[1].userVote).toBeUndefined();
  });

  it("should hit the database once, without a query per quote", async () => {
    await getQuotesList();

    expect(mockDb.quotes.findMany).toHaveBeenCalledTimes(1);
    expect(mockDb.quote_rankings.findMany).not.toHaveBeenCalled();
  });
});
