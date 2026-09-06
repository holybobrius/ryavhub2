import { describe, it, expect, beforeEach, mock } from "bun:test";
import { voteQuote } from "../actions/voteQuote";
import { UnauthError } from "@/shared/errors/UnauthError";
import type { QuoteVoteType } from "../model/models";

const toggleQuoteVote = mock(() => Promise.resolve("created"));
const revalidatePath = mock(() => undefined);

// Подменяется в тестах: по умолчанию — валидная сессия пользователя 7.
let resolveSession: () => Promise<{ id: bigint }> = () =>
  Promise.resolve({ id: 7n });

mock.module("../lib/toggleQuoteVote", () => ({ toggleQuoteVote }));
mock.module("next/cache", () => ({ revalidatePath }));
mock.module("next/headers", () => ({
  cookies: () => Promise.resolve({ get: () => ({ value: "session-id" }) }),
}));
mock.module("@/shared/model/validateSession", () => ({
  validateSession: () => resolveSession(),
}));

describe("voteQuote", () => {
  beforeEach(() => {
    toggleQuoteVote.mockClear();
    revalidatePath.mockClear();
    resolveSession = () => Promise.resolve({ id: 7n });
  });

  it("votes and revalidates the quotes page", async () => {
    const result = await voteQuote(1, "Upvote");

    expect(result).toEqual({ ok: true });
    expect(toggleQuoteVote).toHaveBeenCalledWith(1, 7, "Upvote");
    expect(revalidatePath).toHaveBeenCalledWith("/quotes");
  });

  it("rejects a non-integer quote id", async () => {
    const result = await voteQuote(1.5, "Upvote");

    expect(result).toEqual({ ok: false, error: "invalid" });
    expect(toggleQuoteVote).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects an unknown vote type", async () => {
    // Экшен — публичный эндпоинт: типы стёрты, значение приходит из сети.
    const result = await voteQuote(1, "Like" as QuoteVoteType);

    expect(result).toEqual({ ok: false, error: "invalid" });
    expect(toggleQuoteVote).not.toHaveBeenCalled();
  });

  it("refuses to vote without a valid session", async () => {
    resolveSession = () => Promise.reject(new UnauthError());

    const result = await voteQuote(1, "Upvote");

    expect(result).toEqual({ ok: false, error: "unauthorized" });
    expect(toggleQuoteVote).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rethrows unexpected failures instead of reporting them as unauthorized", async () => {
    resolveSession = () => Promise.reject(new Error("database is down"));

    await expect(voteQuote(1, "Upvote")).rejects.toThrow("database is down");
  });
});
