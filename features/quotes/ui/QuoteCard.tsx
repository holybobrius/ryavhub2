"use client";

import { Typography } from "@/shared/ui/Typography";
import { Quote } from "../models";
import { UserCell } from "@/shared/ui/UserCell/UserCell";
import { Button } from "@/shared/ui/Button";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { suEditContained, suPlus01, suMinimise01, suEdit02 } from "stratis-ui-icons";
import { IconButton } from "@/shared/ui/Button/IconButton";
import { IconView } from "@/shared/ui/IconView/IconView";

interface Props {
  quote: Quote;
  formattedDate: string;
  className?: string;
  size: "small" | "default";
}

export const QuoteCard = ({ quote, formattedDate, className, size }: Props) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(quote.upvotes?.length || 0);
  const [downvotes, setDownvotes] = useState(quote.downvotes?.length || 0);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(() => {
    if (!user) return null;
    const hasUpvote = quote.upvotes?.some((v) => v.created_by === user.id);
    const hasDownvote = quote.downvotes?.some((v) => v.created_by === user.id);
    if (hasUpvote) return "upvote";
    if (hasDownvote) return "downvote";
    return null;
  });

  const DURAK_ENABLED = localStorage.getItem("durak-enabled") === "true";

  useEffect(() => {
    if (!user) {
      setUserVote(null);
      return;
    }
    const hasUpvote = quote.upvotes?.some((v) => v.created_by === user.id);
    const hasDownvote = quote.downvotes?.some((v) => v.created_by === user.id);
    if (hasUpvote) {
      setUserVote("upvote");
    } else if (hasDownvote) {
      setUserVote("downvote");
    } else {
      setUserVote(null);
    }
  }, [user, quote.upvotes, quote.downvotes]);

  const handleVote = useCallback(
    async (type: "upvote" | "downvote") => {
      if (!user) return;

      const prevUpvotes = upvotes;
      const prevDownvotes = downvotes;
      const prevUserVote = userVote;

      let newUpvotes = prevUpvotes;
      let newDownvotes = prevDownvotes;
      let newUserVote: "upvote" | "downvote" | null = prevUserVote;

      if (type === "upvote") {
        if (prevUserVote === "upvote") {
          newUpvotes = Math.max(0, prevUpvotes - 1);
          newUserVote = null;
        } else if (prevUserVote === "downvote") {
          newUpvotes = prevUpvotes + 1;
          newDownvotes = Math.max(0, prevDownvotes - 1);
          newUserVote = "upvote";
        } else {
          newUpvotes = prevUpvotes + 1;
          newUserVote = "upvote";
        }
      } else {
        if (prevUserVote === "downvote") {
          newDownvotes = Math.max(0, prevDownvotes - 1);
          newUserVote = null;
        } else if (prevUserVote === "upvote") {
          newDownvotes = prevDownvotes + 1;
          newUpvotes = Math.max(0, prevUpvotes - 1);
          newUserVote = "downvote";
        } else {
          newDownvotes = prevDownvotes + 1;
          newUserVote = "downvote";
        }
      }

      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      setUserVote(newUserVote);

      try {
        const response = await fetch(`/api/quotes/${quote.id}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        });

        if (!response.ok) {
          throw new Error("Failed to vote");
        }

        const data = await response.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote?.type || null);
      } catch (error) {
        setUpvotes(prevUpvotes);
        setDownvotes(prevDownvotes);
        setUserVote(prevUserVote);
        console.error("Error voting on quote:", error);
      }
    },
    [user, quote.id, upvotes, downvotes, userVote]
  );

  const isUpvoted = userVote === "upvote";
  const isDownvoted = userVote === "downvote";

  return (
    <div className={`bg-black-950 rounded-lg flex flex-col ${className}`}>
      <div className="px-8 py-13 h-full whitespace-pre-wrap break-words overflow-wrap-anywhere">
        <Typography.Text size={size === "small" ? 28 : 40}>
          {quote.quote}
        </Typography.Text>
      </div>
      <div className="h-0.25 w-full bg-black-850" />
      <div className="px-8 py-6 flex justify-between items-center">
        <UserCell userInfo={quote.quoteAuthor} description={formattedDate} />
        <div className="flex items-center gap-25">
          <div className="flex items-center gap-2">
            <Button
              size="small"
              type={isDownvoted ? "danger" : "secondary"}
              variant="soft"
              className="w-48"
              onClick={() => handleVote("downvote")}
            >
              <div className="flex items-center gap-2">
                <div>{downvotes}</div>
               {DURAK_ENABLED && <Image
                  src="/quotes/downvote.png"
                  alt="downvote"
                  width={24}
                  height={24}
                />}
              </div>
            </Button>
            <Button
              size="small"
              type={isUpvoted ? "primary" : "secondary"}
              variant="soft"
              className="w-48"
              onClick={() => handleVote("upvote")}
            >
              <div className="flex items-center gap-2">
                <div>{upvotes}</div>
               {DURAK_ENABLED && <Image
                  src="/quotes/upvote.png"
                  alt="upvote"
                  width={24}
                  height={24}
                />}
              </div>
            </Button>
          </div>
          <IconButton
            icon={suEdit02}
            type="secondary"
            size="small"
          />
        </div>
      </div>
    </div>
  );
};
