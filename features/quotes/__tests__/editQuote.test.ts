import { describe, it, expect, beforeEach, mock } from "bun:test";
import { editQuote } from "../actions/editQuote";
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
  quote: "  Отредактированная цитата  ",
  authorId: "42",
  date: "2026-09-06",
};

const lastUpdate = () => quotes.update.mock.calls[0][0];

describe("editQuote", () => {
  beforeEach(() => {
    quotes.update.mockClear();
    revalidatePath.mockClear();
    resolveSession = () => Promise.resolve({ id: 7n });
  });

  it("updates the addressed quote with the validated payload", async () => {
    const result = await editQuote(validBody, 5);

    expect(result).toEqual({ ok: true });
    expect(lastUpdate().where).toEqual({ id: 5 });
    // В базу уходит результат схемы, а не тело запроса: текст обрезан,
    // id автора приведён к BigInt, дата — к Date.
    expect(lastUpdate().data).toMatchObject({
      quote: "Отредактированная цитата",
      quote_by: 42n,
      date: new Date("2026-09-06"),
    });
    expect(revalidatePath).toHaveBeenCalledWith("/quotes");
  });

  it("does not reassign the record author", async () => {
    // created_by — это «кто добавил цитату», а не «кто её последним трогал».
    // Правка чужой опечатки не должна переписывать авторство записи.
    await editQuote(validBody, 5);

    expect(lastUpdate().data).not.toHaveProperty("created_by");
  });

  it("rejects a payload the schema does not accept", async () => {
    // Экшен — публичный эндпоинт: типы стёрты, дата приходит из сети в любом
    // виде, а слой БД делает из неё new Date().
    const result = await editQuote({ ...validBody, date: "06.09.2026" }, 5);

    expect(result).toEqual({ ok: false, error: "invalid" });
    expect(quotes.update).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuses to save without a valid session", async () => {
    resolveSession = () => Promise.reject(new UnauthError());

    const result = await editQuote(validBody, 5);

    expect(result).toEqual({ ok: false, error: "unauthorized" });
    expect(quotes.update).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
