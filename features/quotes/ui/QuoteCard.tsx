import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Avatar } from "@/shared/ui/Avatar";
import { Typography } from "@/shared/ui/Typography";
import { IconArrowUpRight } from "@/shared/ui/icons";
import type { Quote } from "../model/models";
import { QuoteReactions } from "./QuoteReactions/QuoteReactions";
import { EditQuoteButton } from "./EditQuoteButton";

interface QuoteCardProps {
  quote: Quote;
  isBest?: boolean;
}

const TEXT_CLASS = "whitespace-pre-line text-quote-card-text-color";

export const QuoteCard = ({ quote, isBest = false }: QuoteCardProps) => {
  const upvotes = quote.upvotes ?? 0;
  const downvotes = quote.downvotes ?? 0;

  return (
    <article className="overflow-hidden rounded-quote-card border-quote-card border-quote-card-border-color bg-quote-card-bg">
      <div className="flex flex-col gap-space-sm p-quote-card-body">
        {isBest && (
          <div className="flex items-center gap-space-2xs text-quote-card-label-color">
            <IconArrowUpRight
              size={20}
              className="text-quote-card-icon-color"
            />
            <Typography.Body size="sm">Цитата-победитель</Typography.Body>
          </div>
        )}

        {isBest ? (
          <Typography.Heading size="lg" as="blockquote" className={TEXT_CLASS}>
            {quote.quote}
          </Typography.Heading>
        ) : (
          <Typography.Body size="lg" as="blockquote" className={TEXT_CLASS}>
            {quote.quote}
          </Typography.Body>
        )}
      </div>

      <div className="flex items-center justify-between border-t-quote-card border-t-quote-card-border-color p-quote-card-footer">
        <div className="flex items-center gap-author-block">
          <Avatar
            size={40}
            shape="square"
            src={quote.quoteAuthor.avatarUrl}
            aria-hidden
          >
            {quote.quoteAuthor.name.slice(0, 1)}
          </Avatar>

          <div className="flex flex-col gap-author-block-info">
            <Typography.Body size="sm" className="text-author-block-name-color">
              {quote.quoteAuthor.name}
            </Typography.Body>
            <Typography.Label
              size="sm"
              className="text-author-block-date-color"
            >
              {formatQuoteDate(quote.date)}
            </Typography.Label>
          </div>
        </div>

        <div className="flex items-center gap-space-xl">
          <QuoteReactions
            quoteId={quote.id}
            upvotes={upvotes}
            downvotes={downvotes}
            userVote={quote.userVote}
          />
          {!isBest && <EditQuoteButton quote={quote} />}
        </div>
      </div>
    </article>
  );
};

function formatQuoteDate(date: Date): string {
  const d = dayjs(date).locale("ru");
  const month = d.format("MMM");

  return `${d.format("D")} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.format("YYYY")}г.`;
}
