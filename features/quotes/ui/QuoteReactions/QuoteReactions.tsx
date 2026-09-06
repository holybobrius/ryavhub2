"use client";

import { QuoteVoteType } from "../../model/models";
import { useOptimistic, useTransition } from "react";
import { voteQuote } from "../../actions/voteQuote";
import { QuoteReaction } from "../QuoteReaction/QuoteReaction";

type VoteState = {
  upvotes: number;
  downvotes: number;
  userVote?: QuoteVoteType;
};

interface QuoteReactionsProps extends VoteState {
  quoteId: number;
}

const applyVote = (state: VoteState, voteType: QuoteVoteType): VoteState => {
  const removed = state.userVote;
  const added = removed === voteType ? undefined : voteType;

  return {
    upvotes:
      state.upvotes -
      (removed === "Upvote" ? 1 : 0) +
      (added === "Upvote" ? 1 : 0),
    downvotes:
      state.downvotes -
      (removed === "Downvote" ? 1 : 0) +
      (added === "Downvote" ? 1 : 0),
    userVote: added,
  };
};

export const QuoteReactions = ({
  quoteId,
  upvotes,
  downvotes,
  userVote,
}: QuoteReactionsProps) => {
  const [, startTransition] = useTransition();

  const [state, addOptimisticVote] = useOptimistic(
    { upvotes, downvotes, userVote },
    applyVote,
  );

  const handleVote = (voteType: QuoteVoteType) =>
    startTransition(async () => {
      addOptimisticVote(voteType);

      const result = await voteQuote(quoteId, voteType);

      if (!result.ok) {
        console.error(result.error);
      }
    });

  return (
    <div className="flex items-center gap-space-2xs">
      <QuoteReaction
        kind="like"
        count={state.upvotes}
        isActive={state.userVote === "Upvote"}
        onClick={() => handleVote("Upvote")}
      />
      <QuoteReaction
        kind="dislike"
        count={state.downvotes}
        isActive={state.userVote === "Downvote"}
        onClick={() => handleVote("Downvote")}
      />
    </div>
  );
};
