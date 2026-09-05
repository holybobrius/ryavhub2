import { describe, it, expect } from "bun:test";
import { selectBestQuotes } from "../lib/getBestQuotes";
import type { Quote } from "../model/models";

const quote = (id: number, upvotes: number, downvotes: number): Quote => ({
  id,
  quote: `Quote ${id}`,
  quoteAuthor: { id: 1, name: "Автор" },
  date: new Date("2024-01-01"),
  upvotes: Array.from({ length: upvotes }, (_, i) => ({
    id: id * 100 + i,
    created_by: 999,
  })),
  downvotes: Array.from({ length: downvotes }, (_, i) => ({
    id: id * 200 + i,
    created_by: 999,
  })),
});

describe("selectBestQuotes", () => {
  it("returns an empty array for no quotes", () => {
    expect(selectBestQuotes([])).toEqual([]);
  });

  it("returns the single highest-rated quote", () => {
    const best = selectBestQuotes([quote(1, 5, 1), quote(2, 2, 0)]);

    expect(best.map((q) => q.id)).toEqual([1]);
  });

  it("returns every quote sharing the top score", () => {
    const best = selectBestQuotes([
      quote(1, 3, 0),
      quote(2, 4, 1),
      quote(3, 1, 0),
    ]);

    expect(best.map((q) => q.id)).toEqual([1, 2]);
  });

  it("counts downvotes against the score", () => {
    const best = selectBestQuotes([quote(1, 5, 5), quote(2, 1, 0)]);

    expect(best.map((q) => q.id)).toEqual([2]);
  });

  it("still picks a leader when every score is negative", () => {
    const best = selectBestQuotes([quote(1, 0, 3), quote(2, 0, 1)]);

    expect(best.map((q) => q.id)).toEqual([2]);
  });

  it("treats missing vote arrays as zero", () => {
    const bare: Quote = {
      id: 7,
      quote: "No votes",
      quoteAuthor: { id: 1, name: "Автор" },
      date: new Date("2024-01-01"),
    };

    expect(selectBestQuotes([bare]).map((q) => q.id)).toEqual([7]);
  });
});
