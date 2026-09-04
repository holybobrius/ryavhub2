import { describe, it, expect, beforeEach, mock } from "bun:test";
import { getQuotesList } from "../getQuotesList";
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
      upvotes: [],
      downvotes: [],
    });
    expect(result[1]).toMatchObject({
      id: 2,
      quote: "Another quote",
      upvotes: [{ id: 1, created_by: 1 }],
      downvotes: [],
    });
  });

  it("should take the author from the included relation", async () => {
    const result = await getQuotesList();

    expect(result[0].quoteAuthor.name).toBe("User 1");
    expect(result[1].quoteAuthor.name).toBe("User 2");
  });

  it("should hit the database once, without a query per quote", async () => {
    await getQuotesList();

    expect(mockDb.quotes.findMany).toHaveBeenCalledTimes(1);
    expect(mockDb.quote_rankings.findMany).not.toHaveBeenCalled();
  });
});
