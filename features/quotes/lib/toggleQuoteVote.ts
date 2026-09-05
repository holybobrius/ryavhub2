import { db } from "@/lib/db";

export type VoteResult = "created" | "removed" | "switched";

export const toggleQuoteVote = async (
  quoteId: number,
  userId: number,
  voteType: "Upvote" | "Downvote",
): Promise<VoteResult> => {
  const existingVote = await db.quote_rankings.findFirst({
    where: { quote_id: quoteId, created_by: userId },
  });

  if (!existingVote) {
    await db.quote_rankings.create({
      data: { quote_id: quoteId, created_by: userId, type: voteType },
    });
    return "created";
  }

  if (existingVote.type === voteType) {
    await db.quote_rankings.delete({
      where: { id: existingVote.id },
    });
    return "removed";
  }

  await db.quote_rankings.update({
    where: { id: existingVote.id },
    data: { type: voteType },
  });

  return "switched";
};
