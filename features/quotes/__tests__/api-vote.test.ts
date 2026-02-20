import { describe, it, expect, beforeEach, mock } from "bun:test";
import { POST } from "@/app/api/quotes/[id]/vote/route";
import { NextRequest } from "next/server";
import { mockDb } from "./mockDb";

mock.module("@/lib/db", () => ({ db: mockDb }));

mock.module("@/shared/model/validateSession", () => ({
  validateSession: () => Promise.resolve({ id: 1, name: "Test User" }),
}));

mock.module("next/headers", () => ({
  cookies: () => ({ get: () => ({ value: "mock-session-id" }) }),
}));

describe("POST /api/quotes/[id]/vote", () => {
  beforeEach(() => {
    mockDb.quote_rankings.findFirst.mockClear();
    mockDb.quote_rankings.create.mockClear();
    mockDb.quote_rankings.update.mockClear();
    mockDb.quote_rankings.delete.mockClear();
  });

  it("should return 400 for invalid quote ID", async () => {
    const request = new NextRequest("http://localhost/api/quotes/invalid/vote", {
      method: "POST",
      body: JSON.stringify({ type: "upvote" }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "invalid" }) });

    expect(response.status).toBe(400);
  });

  it("should return 400 for invalid vote type", async () => {
    const request = new NextRequest("http://localhost/api/quotes/1/vote", {
      method: "POST",
      body: JSON.stringify({ type: "invalid" }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });

    expect(response.status).toBe(400);
  });

  it("should create new upvote when no existing vote", async () => {
    mockDb.quote_rankings.findFirst.mockResolvedValueOnce(null); // no existing vote
    mockDb.quote_rankings.create.mockResolvedValueOnce({ id: 1n });
    mockDb.quote_rankings.count
      .mockResolvedValueOnce(1) // upvotes
      .mockResolvedValueOnce(0); // downvotes
    mockDb.quote_rankings.findFirst.mockResolvedValueOnce({
      id: 1n,
      quote_id: 1n,
      created_by: 1n,
      type: "Upvote",
    }); // userVote after create

    const request = new NextRequest("http://localhost/api/quotes/1/vote", {
      method: "POST",
      body: JSON.stringify({ type: "upvote" }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(data).toEqual({
      upvotes: 1,
      downvotes: 0,
      userVote: { type: "upvote" },
    });
  });

  it("should remove vote when clicking same vote type", async () => {
    mockDb.quote_rankings.findFirst.mockResolvedValueOnce({
      id: 1n,
      quote_id: 1n,
      created_by: 1n,
      type: "Upvote",
    });
    mockDb.quote_rankings.delete.mockResolvedValueOnce(undefined);
    mockDb.quote_rankings.count
      .mockResolvedValueOnce(0) // upvotes
      .mockResolvedValueOnce(0); // downvotes

    const request = new NextRequest("http://localhost/api/quotes/1/vote", {
      method: "POST",
      body: JSON.stringify({ type: "upvote" }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });

    expect(response.status).toBe(200);
  });
});
