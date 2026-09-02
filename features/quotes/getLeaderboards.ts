import type { Quote } from "./models";
import type { LeaderboardEntry } from "@/shared/ui/Leaderboard";

export interface QuotesLeaderboards {
  /** Кому больше всего наплюсовали за его фразы. */
  mostLiked: LeaderboardEntry[];
  /** Кому больше всего наминусовали. */
  mostDisliked: LeaderboardEntry[];
  /** У кого больше всего цитат. */
  mostQuoted: LeaderboardEntry[];
}

const TOP_SIZE = 5;

interface AuthorTotals {
  name: string;
  likes: number;
  dislikes: number;
  quotes: number;
}

/**
 * Три рейтинга по авторам фраз.
 *
 * Чистая функция от уже загруженного списка: страница всё равно тянет
 * цитаты целиком, поэтому отдельные GROUP BY к БД не нужны. Если появится
 * пагинация — считать придётся в SQL, здесь этого уже не хватит.
 */
export function buildQuotesLeaderboards(quotes: Quote[]): QuotesLeaderboards {
  const totals = new Map<number, AuthorTotals>();

  for (const quote of quotes) {
    const authorId = quote.quoteAuthor.id;
    // Цитаты без автора ни в один рейтинг не попадают — их некому засчитать.
    if (authorId == null) continue;

    const current = totals.get(authorId) ?? {
      name: quote.quoteAuthor.name,
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
        // U+2212: настоящий минус, по ширине парный к плюсу
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

/**
 * Топ авторов по одной метрике: нули отбрасываем, при равном счёте
 * сортируем по имени — иначе порядок зависел бы от того, как строки
 * легли в БД, и рейтинг «прыгал» бы между рендерами.
 */
function board(
  authors: AuthorTotals[],
  score: (author: AuthorTotals) => number,
  format: (score: number) => Pick<LeaderboardEntry, "value" | "tone">,
): LeaderboardEntry[] {
  return authors
    .filter((author) => score(author) > 0)
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, "ru"))
    .slice(0, TOP_SIZE)
    .map((author) => ({ name: author.name, ...format(score(author)) }));
}
