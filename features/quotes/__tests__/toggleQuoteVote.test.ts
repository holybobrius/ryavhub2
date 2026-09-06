import { describe, it, expect, beforeEach, mock } from "bun:test";
import { toggleQuoteVote } from "../lib/toggleQuoteVote";
import { mockDb } from "./mockDb";

mock.module("@/lib/db", () => ({ db: mockDb }));

const rankings = mockDb.quote_rankings;

const existingVote = (type: "Upvote" | "Downvote") => ({
  id: 42n,
  quote_id: 1n,
  created_by: 7n,
  type,
});

describe("toggleQuoteVote", () => {
  beforeEach(() => {
    rankings.findFirst.mockClear();
    rankings.create.mockClear();
    rankings.update.mockClear();
    rankings.delete.mockClear();
  });

  it("creates a vote when the user has not voted yet", async () => {
    rankings.findFirst.mockResolvedValueOnce(null);

    const result = await toggleQuoteVote(1, 7, "Upvote");

    expect(result).toBe("created");
    expect(rankings.create).toHaveBeenCalledWith({
      data: { quote_id: 1, created_by: 7, type: "Upvote" },
    });
    expect(rankings.update).not.toHaveBeenCalled();
    expect(rankings.delete).not.toHaveBeenCalled();
  });

  it("removes the vote when the same type is sent again", async () => {
    rankings.findFirst.mockResolvedValueOnce(existingVote("Upvote"));

    const result = await toggleQuoteVote(1, 7, "Upvote");

    expect(result).toBe("removed");
    expect(rankings.delete).toHaveBeenCalledWith({ where: { id: 42n } });
    expect(rankings.create).not.toHaveBeenCalled();
    expect(rankings.update).not.toHaveBeenCalled();
  });

  it("switches the vote when the other type is sent", async () => {
    rankings.findFirst.mockResolvedValueOnce(existingVote("Downvote"));

    const result = await toggleQuoteVote(1, 7, "Upvote");

    expect(result).toBe("switched");
    expect(rankings.update).toHaveBeenCalledWith({
      where: { id: 42n },
      data: { type: "Upvote" },
    });
    expect(rankings.create).not.toHaveBeenCalled();
    expect(rankings.delete).not.toHaveBeenCalled();
  });

  it("looks the vote up by quote and user, not by quote alone", async () => {
    rankings.findFirst.mockResolvedValueOnce(null);

    await toggleQuoteVote(1, 7, "Downvote");

    expect(rankings.findFirst).toHaveBeenCalledWith({
      where: { quote_id: 1, created_by: 7 },
    });
  });
});
