import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quoteId = parseInt(id);
    if (isNaN(quoteId)) {
      return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
    }

    const { type } = await request.json();
    if (type !== "upvote" && type !== "downvote") {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    const sessionCookie = (await cookies()).get("sessionId")?.value;
    const user = await validateSession(sessionCookie);
    const userId = BigInt(user.id);

    const voteType = type === "upvote" ? "Upvote" : "Downvote";

    const existingVote = await db.quote_rankings.findFirst({
      where: {
        quote_id: quoteId,
        created_by: userId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.quote_rankings.delete({
          where: { id: existingVote.id },
        });
      } else {
        await db.quote_rankings.update({
          where: { id: existingVote.id },
          data: { type: voteType },
        });
      }
    } else {
      await db.quote_rankings.create({
        data: {
          quote_id: quoteId,
          created_by: userId,
          type: voteType,
        },
      });
    }

    const upvotes = await db.quote_rankings.count({
      where: {
        quote_id: quoteId,
        type: "Upvote",
      },
    });

    const downvotes = await db.quote_rankings.count({
      where: {
        quote_id: quoteId,
        type: "Downvote",
      },
    });

    const userVote = await db.quote_rankings.findFirst({
      where: {
        quote_id: quoteId,
        created_by: userId,
      },
    });

    return NextResponse.json({
      upvotes,
      downvotes,
      userVote: userVote
        ? {
            type: userVote.type === "Upvote" ? "upvote" : "downvote",
          }
        : null,
    });
  } catch (error) {
    console.error("Error voting on quote:", error);
    return NextResponse.json(
      { error: "Failed to vote on quote" },
      { status: 500 }
    );
  }
}
