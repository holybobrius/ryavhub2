"use server";

import { validateSession } from "@/shared/model/validateSession";
import { cookies } from "next/headers";
import { toggleQuoteVote } from "../lib/toggleQuoteVote";
import { revalidatePath } from "next/cache";
import { isUnauthError } from "@/shared/errors/UnauthError";

export type VoteQuoteResult =
  { ok: true } | { ok: false; error: "unauthorized" | "invalid" };

export const voteQuote = async (
  quoteId: number,
  voteType: "Upvote" | "Downvote",
): Promise<VoteQuoteResult> => {
  if (
    !Number.isInteger(quoteId) ||
    quoteId <= 0 ||
    !["Upvote", "Downvote"].includes(voteType)
  ) {
    return { ok: false, error: "invalid" };
  }

  try {
    const sessionId = (await cookies()).get("sessionId")?.value;
    const { id } = await validateSession(sessionId);

    await toggleQuoteVote(quoteId, Number(id), voteType);
  } catch (error) {
    if (isUnauthError(error)) return { ok: false, error: "unauthorized" };
    throw error;
  }

  revalidatePath("/quotes");

  return { ok: true };
};
