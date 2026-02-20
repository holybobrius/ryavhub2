# Quotes Feature Testing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive tests for the quotes feature using Bun's built-in test runner and React Testing Library.

**Architecture:** Three-tier testing structure with unit tests for data functions, component tests for React components, and integration tests for API routes. All tests use Bun's native test runner with mocked dependencies.

**Tech Stack:** Bun test runner (native), React Testing Library, @testing-library/jest-dom, @testing-library/user-event, jsdom

---

## Phase 1: Test Setup

### Task 1: Install testing dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install dependencies**

Run: `bun add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`

Expected: Dependencies installed successfully to devDependencies

**Step 2: Add test scripts to package.json**

Add to `scripts` section:
```json
"test": "bun test",
"test:watch": "bun test --watch",
"test:ui": "bun test --watch",  // Bun has built-in watch UI
"test:coverage": "bun test --coverage"
```

**Step 3: Create bunfig.toml for test configuration**

Create: `bunfig.toml`
```toml
[test]
preload = "./test-setup.ts"
root = "./"
coverage = true
coverageDir = "./coverage"
```

**Step 4: Create test setup file**

Create: `test-setup.ts`
```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeEach } from "bun:test";

beforeEach(() => {
  cleanup();
});
```

**Step 5: Verify test runner works**

Create: `test-smoke.test.ts`
```typescript
import { describe, it, expect } from "bun:test";

describe("smoke test", () => {
  it("should run tests", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `bun test test-smoke.test.ts`

Expected: PASS

**Step 6: Clean up smoke test**

Run: `rm test-smoke.test.ts`

---

## Phase 2: Unit Tests for Data Functions

### Task 2: Create mocks for unit tests

**Files:**
- Create: `features/quotes/__tests__/mocks.ts`

**Step 1: Create mock utilities**

Create: `features/quotes/__tests__/mocks.ts`
```typescript
import { Quote } from "../models";

export const mockQuote: Quote = {
  id: 1,
  quote: "Test quote",
  quoteAuthor: {
    name: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
  },
  date: new Date("2024-01-01"),
  upvotes: [],
  downvotes: [],
};

export const mockQuotes: Quote[] = [
  mockQuote,
  {
    id: 2,
    quote: "Another test quote",
    quoteAuthor: { name: "Another User", avatarUrl: undefined },
    date: new Date("2024-01-02"),
    upvotes: [{ id: 1, created_by: 1 }],
    downvotes: [],
  },
];
```

**Step 2: Mock Prisma client for unit tests**

Create: `features/quotes/__tests__/mockDb.ts`
```typescript
import { mock } from "bun:test";

export const mockQuotes = [
  { id: 1n, quote: "Test quote", quote_by: 1n, date: new Date("2024-01-01") },
  { id: 2n, quote: "Another quote", quote_by: 2n, date: new Date("2024-01-02") },
];

export const mockRankings = [
  { id: 1n, quote_id: 2n, created_by: 1n, type: "Upvote" as const },
];

export const mockDb = {
  quotes: {
    findMany: mock(() => Promise.resolve(mockQuotes)),
  },
  quote_rankings: {
    findMany: mock(() => Promise.resolve(mockRankings)),
  },
};
```

---

### Task 3: Test getQuotesList - empty array

**Files:**
- Create: `features/quotes/__tests__/getQuotesList.test.ts`

**Step 1: Write failing test**

Create: `features/quotes/__tests__/getQuotesList.test.ts`
```typescript
import { describe, it, expect, beforeEach } from "bun:test";
import { getQuotesList } from "../getQuotesList";
import { mockDb } from "./mockDb";

describe("getQuotesList", () => {
  beforeEach(() => {
    mockDb.quotes.findMany.mockClear();
    mockDb.quote_rankings.findMany.mockClear();
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
```

**Step 2: Run tests**

Run: `bun test features/quotes/__tests__/getQuotesList.test.ts`

Expected: PASS

---

### Task 4: Test getBestQuote

**Files:**
- Create: `features/quotes/__tests__/getBestQuote.test.ts`

**Step 1: Write tests**

Create: `features/quotes/__tests__/getBestQuote.test.ts`
```typescript
import { describe, it, expect, mock } from "bun:test";
import { getBestQuote } from "../getQuotesList";

const mockGetQuotesList = mock(async () => []);

// Mock the import
import module from "../getQuotesList";
(module as any).getQuotesList = mockGetQuotesList;

describe("getBestQuote", () => {
  beforeEach(() => {
    mockGetQuotesList.mockClear();
  });

  it("should return null when no quotes exist", async () => {
    mockGetQuotesList.mockResolvedValueOnce([]);

    const result = await getBestQuote();

    expect(result).toBeNull();
  });

  it("should return quote with highest score", async () => {
    mockGetQuotesList.mockResolvedValueOnce([
      {
        id: 1,
        quote: "Quote 1",
        quoteAuthor: { name: "User 1" },
        date: new Date(),
        upvotes: [{ id: 1, created_by: 1 }],
        downvotes: [],
      },
      {
        id: 2,
        quote: "Quote 2",
        quoteAuthor: { name: "User 2" },
        date: new Date(),
        upvotes: [],
        downvotes: [],
      },
    ]);

    const result = await getBestQuote();

    expect(result?.id).toBe(1);
  });

  it("should return a quote when all scores are equal", async () => {
    mockGetQuotesList.mockResolvedValueOnce([
      {
        id: 1,
        quote: "Quote 1",
        quoteAuthor: { name: "User 1" },
        date: new Date(),
        upvotes: [],
        downvotes: [],
      },
      {
        id: 2,
        quote: "Quote 2",
        quoteAuthor: { name: "User 2" },
        date: new Date(),
        upvotes: [],
        downvotes: [],
      },
    ]);

    const result = await getBestQuote();

    expect(result).not.toBeNull();
    expect([1, 2]).toContain(result?.id);
  });
});
```

**Step 2: Run tests**

Run: `bun test features/quotes/__tests__/getBestQuote.test.ts`

Expected: PASS

---

## Phase 3: Component Tests

### Task 5: Create test utilities for components

**Files:**
- Create: `test-utils.tsx`

**Step 1: Create custom render with providers**

Create: `test-utils.tsx`
```typescript
import { render } from "@testing-library/react";
import React from "react";
import { AuthProvider } from "@/features/auth/useAuth";

interface Options {
  authUser?: { id: number; name: string } | null;
}

export function renderWithProviders(ui: React.ReactElement, options?: Options) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider initialUser={options?.authUser || null}>
        {children}
      </AuthProvider>
    );
  };
  return render(ui, { wrapper: Wrapper });
}
```

---

### Task 6: Test QuoteCard rendering

**Files:**
- Create: `features/quotes/__tests__/QuoteCard.test.tsx`

**Step 1: Write tests**

Create: `features/quotes/__tests__/QuoteCard.test.tsx`
```typescript
import { describe, it, expect, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { QuoteCard } from "../ui/QuoteCard";
import { Quote } from "../models";

// Mock images to avoid Next.js errors
mock.module("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock useAuth
mock.module("@/features/auth/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

const mockQuote: Quote = {
  id: 1,
  quote: "Test quote text",
  quoteAuthor: { name: "Test User", avatarUrl: "https://example.com/avatar.jpg" },
  date: new Date(),
  upvotes: [{ id: 1, created_by: 1 }],
  downvotes: [],
};

describe("QuoteCard", () => {
  it("should render quote text", () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(screen.getByText("Test quote text")).toBeInTheDocument();
  });

  it("should render author name", () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("should show upvote count", () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should show downvote count as 0", () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const downvoteButton = screen.getAllByRole("button").find(
      b => b.textContent?.includes("0")
    );
    expect(downvoteButton).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

Run: `bun test features/quotes/__tests__/QuoteCard.test.tsx`

Expected: PASS

---

### Task 7: Test QuoteCard voting interaction

**Files:**
- Modify: `features/quotes/__tests__/QuoteCard.test.tsx`

**Step 1: Add voting interaction tests**

Add to `features/quotes/__tests__/QuoteCard.test.tsx`:
```typescript
import userEvent from "@testing-library/user-event";

describe("QuoteCard voting", () => {
  beforeEach(() => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ upvotes: 2, downvotes: 0, userVote: { type: "upvote" } }),
      })
    ) as any;

    mock.module("@/features/auth/useAuth", () => ({
      useAuth: () => ({ user: { id: 1, name: "User" } }),
    }));
  });

  it("should send upvote request when clicking upvote button", async () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const buttons = screen.getAllByRole("button");
    const upvoteButton = buttons[buttons.length - 1]; // Last button is upvote

    await userEvent.click(upvoteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/quotes/1/vote",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ type: "upvote" }),
      })
    );
  });

  it("should send downvote request when clicking downvote button", async () => {
    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const buttons = screen.getAllByRole("button");
    const downvoteButton = buttons[buttons.length - 2];

    await userEvent.click(downvoteButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/quotes/1/vote",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ type: "downvote" }),
      })
    );
  });

  it("should handle vote error gracefully", async () => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to vote" }),
      })
    ) as any;

    render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const buttons = screen.getAllByRole("button");
    const upvoteButton = buttons[buttons.length - 1];

    await userEvent.click(upvoteButton);

    // Should revert to original state
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

Run: `bun test features/quotes/__tests__/QuoteCard.test.tsx`

Expected: PASS

---

## Phase 4: Integration Tests

### Task 8: Test vote API route

**Files:**
- Create: `features/quotes/__tests__/api-vote.test.ts`

**Step 1: Write tests**

Create: `features/quotes/__tests__/api-vote.test.ts`
```typescript
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { POST } from "@/app/api/quotes/[id]/vote/route";
import { NextRequest } from "next/server";
import { mockDb } from "./mockDb";

mock.module("@/lib/db", () => ({ db: mockDb }));

mock.module("@/shared/model/validateSession", () => ({
  validateSession: () => Promise.resolve({ id: 1, name: "Test User" }),
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
    mockDb.quote_rankings.findFirst.mockResolvedValueOnce(null);
    mockDb.quote_rankings.create.mockResolvedValueOnce({ id: 1n });
    mockDb.quote_rankings.count
      .mockResolvedValueOnce(1) // upvotes
      .mockResolvedValueOnce(0); // downvotes

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
```

**Step 2: Run tests**

Run: `bun test features/quotes/__tests__/api-vote.test.ts`

Expected: PASS

---

## Phase 5: Finalization

### Task 9: Run all tests and verify coverage

**Step 1: Run all tests**

Run: `bun test`

Expected: All tests pass

**Step 2: Run with coverage**

Run: `bun test --coverage`

Expected: Coverage report shows ~70-80% for quotes feature

**Step 3: Run watch mode for development**

Run: `bun test --watch`

Expected: Tests run in watch mode, re-running on file changes

---

## Summary

This plan implements:
1. Test setup with Bun's native test runner and React Testing Library
2. Unit tests for `getQuotesList` and `getBestQuote`
3. Component tests for `QuoteCard` with interaction testing
4. Integration tests for the vote API route
5. Coverage reporting

Total tasks: 9
Estimated time: 45-60 minutes (Bun is faster than Vitest)

## Notes on Bun Test Runner

- Bun's test runner is built-in and requires no separate installation
- Uses a Jest-like API but is much faster
- `mock()` function from `bun:test` is used for mocking
- `mock.module()` is used for module mocking
- Coverage is built-in with `--coverage` flag
- Watch mode is built-in with `--watch` flag
