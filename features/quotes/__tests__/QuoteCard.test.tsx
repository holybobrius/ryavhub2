// Set up JSDOM first before any imports
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window as any;
global.navigator = dom.window.navigator as any;

import { describe, it, expect, mock, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuoteCard } from "../ui/QuoteCard";
import { Quote } from "../models";

// Mock images to avoid Next.js errors
mock.module("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock localStorage
const localStorageMock = {
  getItem: mock(() => null),
  setItem: mock(() => {}),
  removeItem: mock(() => {}),
  clear: mock(() => {}),
};
global.localStorage = localStorageMock;

// Mock useAuth - create a mock that can be controlled
const mockUseAuth = mock(() => ({ user: null }));
mock.module("@/features/auth/useAuth", () => ({
  useAuth: mockUseAuth,
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
  beforeEach(() => {
    // Reset localStorage mock before each test
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should render quote text", () => {
    const { getByText } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(getByText("Test quote text")).toBeInTheDocument();
  });

  it("should render author name", () => {
    const { getByText } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(getByText("Test User")).toBeInTheDocument();
  });

  it("should show upvote count", () => {
    const { getByText } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    expect(getByText("1")).toBeInTheDocument();
  });

  it("should show downvote count as 0", () => {
    const { getAllByRole } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const downvoteButton = getAllByRole("button").find(
      b => b.textContent?.includes("0")
    );
    expect(downvoteButton).toBeInTheDocument();
  });
});

describe("QuoteCard voting", () => {
  beforeEach(() => {

    // Suppress console.error to avoid error logs in test output
    global.console.error = mock(() => {});
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ upvotes: 2, downvotes: 0, userVote: { type: "upvote" } }),
      })
    ) as any;

    // Set the mock to return a user
    mockUseAuth.mockReturnValue({ user: { id: 1, name: "User" } });
  });

  it("should send upvote request when clicking upvote button", async () => {
    const { getAllByRole } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    // Find buttons by their content - upvote button contains "1", downvote contains "0"
    const buttons = getAllByRole("button");
    const upvoteButton = buttons.find(b => b.textContent?.includes("1"))!;

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
    const { getAllByRole } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const buttons = getAllByRole("button");
    const downvoteButton = buttons.find(b => b.textContent?.includes("0"))!;

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

    const { getAllByRole, getByText } = render(<QuoteCard quote={mockQuote} formattedDate="1 января 2024" size="default" />);

    const buttons = getAllByRole("button");
    const upvoteButton = buttons.find(b => b.textContent?.includes("1"))!;

    await userEvent.click(upvoteButton);

    // Should revert to original state
    expect(getByText("1")).toBeInTheDocument();
  });
});
