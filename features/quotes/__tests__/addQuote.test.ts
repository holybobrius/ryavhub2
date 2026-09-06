import { describe, it, expect, beforeEach, mock } from "bun:test";
import { addQuote } from "../actions/addQuote";
import { UnauthError } from "@/shared/errors/UnauthError";
import { mockDb } from "./mockDb";

const revalidatePath = mock(() => undefined);

// Подменяется в тестах: по умолчанию — валидная сессия пользователя 7.
let resolveSession: () => Promise<{ id: bigint }> = () =>
  Promise.resolve({ id: 7n });

mock.module("@/lib/db", () => ({ db: mockDb }));
mock.module("next/cache", () => ({ revalidatePath }));
mock.module("next/headers", () => ({
  cookies: () => Promise.resolve({ get: () => ({ value: "session-id" }) }),
}));
mock.module("@/shared/model/validateSession", () => ({
  validateSession: () => resolveSession(),
}));

const quotes = mockDb.quotes;

const validBody = {
  quote: "  Цитата с пробелами по краям  ",
  authorId: "42",
  date: "2026-09-06",
};

describe("addQuote", () => {
  beforeEach(() => {
    quotes.create.mockClear();
    revalidatePath.mockClear();
    resolveSession = () => Promise.resolve({ id: 7n });
  });

  it("saves the validated payload and revalidates the quotes page", async () => {
    const result = await addQuote(validBody);

    expect(result).toEqual({ ok: true });
    expect(quotes.create).toHaveBeenCalledWith({
      data: {
        // В базу уходит результат схемы, а не тело запроса: текст обрезан,
        // id автора приведён к BigInt, дата — к Date.
        quote: "Цитата с пробелами по краям",
        quote_by: 42n,
        date: new Date("2026-09-06"),
        // created_by берётся из сессии, а не из формы: экшен — публичный
        // эндпоинт, и телу запроса верить нельзя.
        created_by: 7n,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/quotes");
  });

  it("rejects a payload the schema does not accept", async () => {
    // Экшен — публичный эндпоинт: типы стёрты, дата приходит из сети в любом
    // виде, а слой БД делает из неё new Date().
    const result = await addQuote({ ...validBody, date: "06.09.2026" });

    expect(result).toEqual({ ok: false, error: "invalid" });
    expect(quotes.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuses to save without a valid session", async () => {
    resolveSession = () => Promise.reject(new UnauthError());

    const result = await addQuote(validBody);

    expect(result).toEqual({ ok: false, error: "unauthorized" });
    expect(quotes.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
