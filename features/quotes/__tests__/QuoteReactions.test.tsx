import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render } from "@/test-utils";
import { QuoteReactions } from "../ui/QuoteReactions/QuoteReactions";
import type { User } from "@/features/auth/models";
import type { QuoteVoteType } from "../model/models";
import { VoteQuoteResult } from "../actions/voteQuote";

// Экшен уходит на сервер, поэтому в тесте это управляемый промис: пока он
// не зарезолвен, транзишен висит — ровно в этот момент и видно оптимистику.

let settleVote: ((result: VoteQuoteResult) => void) | undefined;

const voteQuote = mock(
  () =>
    new Promise<VoteQuoteResult>((resolve) => {
      settleVote = resolve;
    }),
);

mock.module("../actions/voteQuote", () => ({ voteQuote }));

const authUser: User = { id: 7, name: "Тестовый", gauntlet: false };

interface Props {
  upvotes?: number;
  downvotes?: number;
  userVote?: QuoteVoteType;
}

const renderReactions = ({ upvotes = 0, downvotes = 0, userVote }: Props) =>
  render(
    <QuoteReactions
      quoteId={1}
      upvotes={upvotes}
      downvotes={downvotes}
      userVote={userVote}
    />,
    { authUser },
  );

describe("QuoteReactions", () => {
  beforeEach(() => {
    voteQuote.mockClear();
    settleVote = undefined;
  });

  // Незавершённый асинхронный транзишен переживает размонтирование и не даёт
  // React закрыть транзишены следующих тестов — оптимистика в них залипает.
  afterEach(async () => {
    await act(async () => {
      settleVote?.({ ok: true });
    });
  });

  it("shows the new count before the server answers", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderReactions({ upvotes: 2 });

    await user.click(getByLabelText("Нравится"));

    const like = getByLabelText("Нравится");
    expect(like.textContent).toContain("3");
    expect(like.dataset.active).toBe("true");
    expect(voteQuote).toHaveBeenCalledWith(1, "Upvote");
  });

  it("takes the like back when the same button is clicked again", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderReactions({
      upvotes: 3,
      userVote: "Upvote",
    });

    await user.click(getByLabelText("Нравится"));

    const like = getByLabelText("Нравится");
    expect(like.textContent).toContain("2");
    expect(like.dataset.active).toBe("false");
  });

  it("moves the vote from dislike to like, updating both counters", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderReactions({
      upvotes: 1,
      downvotes: 4,
      userVote: "Downvote",
    });

    await user.click(getByLabelText("Нравится"));

    expect(getByLabelText("Нравится").textContent).toContain("2");
    expect(getByLabelText("Нравится").dataset.active).toBe("true");
    expect(getByLabelText("Не нравится").textContent).toContain("3");
    expect(getByLabelText("Не нравится").dataset.active).toBe("false");
  });

  it("falls back to the server value when the vote fails", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderReactions({ upvotes: 2 });

    await user.click(getByLabelText("Нравится"));
    expect(getByLabelText("Нравится").textContent).toContain("3");

    await act(async () => {
      settleVote?.({ ok: false, error: "unauthorized" });
    });

    const like = getByLabelText("Нравится");
    expect(like.textContent).toContain("2");
    expect(like.dataset.active).toBe("false");
  });
});
