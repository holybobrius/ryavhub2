import { describe, it, expect } from "bun:test";
import { buildQuotesLeaderboards } from "../getLeaderboards";
import type { Quote } from "../models";

const quote = (
  id: number,
  authorId: number,
  name: string,
  upvotes: number,
  downvotes: number,
): Quote => ({
  id,
  quote: `Quote ${id}`,
  quoteAuthor: { id: authorId, name },
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

describe("buildQuotesLeaderboards", () => {
  it("returns empty boards for no quotes", () => {
    const boards = buildQuotesLeaderboards([]);

    expect(boards.mostLiked).toEqual([]);
    expect(boards.mostDisliked).toEqual([]);
    expect(boards.mostQuoted).toEqual([]);
  });

  it("sums likes across all quotes of one author", () => {
    const boards = buildQuotesLeaderboards([
      quote(1, 1, "Сусанин", 5, 0),
      quote(2, 1, "Сусанин", 2, 0),
      quote(3, 2, "Ткач", 4, 0),
    ]);

    expect(boards.mostLiked[0]).toMatchObject({
      name: "Сусанин",
      value: "+7",
      tone: "positive",
    });
    expect(boards.mostLiked[1]).toMatchObject({ name: "Ткач", value: "+4" });
  });

  it("marks dislikes as negative", () => {
    const boards = buildQuotesLeaderboards([quote(1, 1, "Ремарон", 0, 4)]);

    expect(boards.mostDisliked[0]).toMatchObject({
      name: "Ремарон",
      value: "−4",
      tone: "negative",
    });
  });

  it("counts quotes per author", () => {
    const boards = buildQuotesLeaderboards([
      quote(1, 1, "Сусанин", 0, 0),
      quote(2, 1, "Сусанин", 0, 0),
      quote(3, 2, "Ткач", 0, 0),
    ]);

    expect(boards.mostQuoted[0]).toMatchObject({ name: "Сусанин", value: 2 });
    expect(boards.mostQuoted[1]).toMatchObject({ name: "Ткач", value: 1 });
  });

  it("leaves out authors with a zero score", () => {
    const boards = buildQuotesLeaderboards([quote(1, 1, "Сусанин", 0, 3)]);

    expect(boards.mostLiked).toEqual([]);
    expect(boards.mostDisliked).toHaveLength(1);
  });

  it("keeps at most five rows", () => {
    const quotes = Array.from({ length: 8 }, (_, i) =>
      quote(i + 1, i + 1, `User ${i + 1}`, 8 - i, 0),
    );

    expect(buildQuotesLeaderboards(quotes).mostLiked).toHaveLength(5);
  });

  it("breaks ties by name so the order is stable", () => {
    const boards = buildQuotesLeaderboards([
      quote(1, 1, "Яков", 3, 0),
      quote(2, 2, "Антон", 3, 0),
    ]);

    expect(boards.mostLiked.map((e) => e.name)).toEqual(["Антон", "Яков"]);
  });

  it("skips quotes without an author", () => {
    const orphan: Quote = {
      ...quote(1, 1, "", 5, 0),
      quoteAuthor: { name: "" },
    };

    expect(buildQuotesLeaderboards([orphan]).mostLiked).toEqual([]);
  });
});
