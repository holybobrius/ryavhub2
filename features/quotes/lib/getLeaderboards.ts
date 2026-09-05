import type { Quote } from "../model/models";
import type { LeaderboardEntry } from "@/shared/ui/Leaderboard";

export interface QuotesLeaderboards {
  mostLiked: LeaderboardEntry[];
  mostDisliked: LeaderboardEntry[];
  mostQuoted: LeaderboardEntry[];
}

const TOP_SIZE = 5;

interface AuthorTotals {
  name: string;
  avatarUrl?: string;
  likes: number;
  dislikes: number;
  quotes: number;
}

export function buildQuotesLeaderboards(quotes: Quote[]): QuotesLeaderboards {
  const totals = new Map<number, AuthorTotals>();

  for (const quote of quotes) {
    const authorId = quote.quoteAuthor.id;

    if (authorId == null) continue;

    const current = totals.get(authorId) ?? {
      name: quote.quoteAuthor.name,
      avatarUrl: quote.quoteAuthor.avatarUrl,
      likes: 0,
      dislikes: 0,
      quotes: 0,
    };

    current.likes += quote.upvotes?.length ?? 0;
    current.dislikes += quote.downvotes?.length ?? 0;
    current.quotes += 1;

    totals.set(authorId, current);
  }

  const authors = [...totals.values()];

  return {
    mostLiked: board(
      authors,
      (a) => a.likes,
      (score) => ({
        value: `+${score}`,
        tone: "positive",
      }),
    ),
    mostDisliked: board(
      authors,
      (a) => a.dislikes,
      (score) => ({
        // U+2212 — настоящий минус, по ширине парный к плюсу.
        value: `−${score}`,
        tone: "negative",
      }),
    ),
    mostQuoted: board(
      authors,
      (a) => a.quotes,
      (score) => ({ value: score }),
    ),
  };
}

function board(
  authors: AuthorTotals[],
  score: (author: AuthorTotals) => number,
  format: (score: number) => Pick<LeaderboardEntry, "value" | "tone">,
): LeaderboardEntry[] {
  return (
    authors
      .filter((author) => score(author) > 0)
      // При равном счёте — по имени: иначе порядок зависел бы от того,
      // как строки легли в БД, и рейтинг «прыгал» бы между рендерами.
      .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, "ru"))
      .slice(0, TOP_SIZE)
      .map((author) => ({
        name: author.name,
        avatarSrc: author.avatarUrl,
        ...format(score(author)),
      }))
  );
}
