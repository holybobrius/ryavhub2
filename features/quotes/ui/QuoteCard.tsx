import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Avatar } from "@/shared/ui/Avatar";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { IconArrowUpRight, IconThumbUp } from "@/shared/ui/icons";
import type { Quote } from "../models";

interface QuoteCardProps {
  quote: Quote;
  /** Помечает карточку меткой «Цитата-победитель». */
  isBest?: boolean;
}

/**
 * Карточка цитаты. Server-компонент: пока только вывод, голосование
 * (POST /api/quotes/[id]/vote) добавим отдельным клиентским блоком.
 */
export function QuoteCard({ quote, isBest = false }: QuoteCardProps) {
  const upvotes = quote.upvotes?.length ?? 0;
  const downvotes = quote.downvotes?.length ?? 0;

  return (
    <article className="overflow-hidden rounded-[var(--ryav-quote-card-border-radius)] border-[length:var(--ryav-quote-card-border-width)] border-[color:var(--color-quote-card-border-color)] bg-[color:var(--color-quote-card-bg)]">
      <div className="flex flex-col gap-16 px-[var(--ryav-quote-card-body-padding-x)] pt-[var(--ryav-quote-card-body-padding-top)] pb-[var(--ryav-quote-card-body-padding-bottom)]">
        {isBest && (
          <div className="flex items-center gap-8 text-[color:var(--color-quote-card-label-color)]">
            <IconArrowUpRight
              size={20}
              className="text-[color:var(--color-quote-card-icon-color)]"
            />
            <Typography.Body size="sm">Цитата-победитель</Typography.Body>
          </div>
        )}

        <Typography.Heading
          size="lg"
          as="blockquote"
          className="text-[color:var(--color-quote-card-text-color)]"
        >
          {quote.quote}
        </Typography.Heading>
      </div>

      {/* Футер отделён той же линией, что и рамка карточки */}
      <div className="flex items-center justify-between border-t-[length:var(--ryav-quote-card-border-width)] border-t-[color:var(--color-quote-card-border-color)] px-[var(--ryav-quote-card-footer-padding-x)] py-[var(--ryav-quote-card-footer-padding-y)]">
        <div className="flex items-center gap-[var(--ryav-author-block-gap)]">
          <Avatar
            size={40}
            shape="square"
            src={quote.quoteAuthor.avatarUrl}
            aria-hidden
          >
            {quote.quoteAuthor.name.slice(0, 1)}
          </Avatar>

          <div className="flex flex-col gap-[var(--ryav-author-block-info-gap)]">
            <Typography.Body
              size="sm"
              className="text-[color:var(--color-author-block-name-color)]"
            >
              {quote.quoteAuthor.name}
            </Typography.Body>
            <Typography.Label
              size="sm"
              className="text-[color:var(--color-author-block-date-color)]"
            >
              {formatQuoteDate(quote.date)}
            </Typography.Label>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Reaction kind="like" count={upvotes} />
          <Reaction kind="dislike" count={downvotes} />
        </div>
      </div>
    </article>
  );
}

/**
 * «16 Авг. 2024г.» — как в макете: месяц сокращён и с заглавной,
 * год слипается с «г.». Локаль задаём на инстансе, чтобы модуль не
 * зависел от того, вызвал ли кто-то dayjs.locale("ru") раньше.
 */
function formatQuoteDate(date: Date): string {
  const d = dayjs(date).locale("ru");
  const month = d.format("MMM");

  return `${d.format("D")} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.format("YYYY")}г.`;
}

interface ReactionProps {
  kind: "like" | "dislike";
  count: number;
}

/**
 * Счётчик реакции. Ненажатое состояние — обычная кнопка ДС (soft/tertiary,
 * размер md). Цветные токены --color-quote-reaction-* приберегаем для
 * состояния «мой голос», когда появится голосование.
 */
function Reaction({ kind, count }: ReactionProps) {
  const isLike = kind === "like";

  return (
    <Button
      variant="soft"
      tone="tertiary"
      size="md"
      aria-label={isLike ? "Нравится" : "Не нравится"}
      rightIcon={<IconThumbUp className={isLike ? undefined : "rotate-180"} />}
    >
      {count}
    </Button>
  );
}
