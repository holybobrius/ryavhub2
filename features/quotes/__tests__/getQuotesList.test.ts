import { describe, it, expect, beforeEach, mock } from "bun:test";
import { getQuotesList } from "../getQuotesList";
import { mockDb } from "./mockDb";

// Mock the database module
mock.module("@/lib/db", () => ({
  db: mockDb,
}));

// Mock the getUserById function
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

describe("getQuotesList", () => {
  beforeEach(() => {
    mockDb.quotes.findMany.mockClear();
    mockDb.quote_rankings.findMany.mockClear();
    mockGetUserById.mockClear();
  });

  it("should return empty array when no quotes exist", async () => {
    mockDb.quotes.findMany.mockResolvedValueOnce([]);
    mockDb.quote_rankings.findMany.mockResolvedValueOnce([]);

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
});
