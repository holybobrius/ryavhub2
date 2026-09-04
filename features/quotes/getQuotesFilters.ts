import type { Quote } from "./models";

export interface AuthorFilter {
  id: number;
  name: string;
  avatarUrl?: string;
  /** Сколько цитат у автора. Всегда ≥ 1 — см. комментарий к функции. */
  count: number;
}

export interface YearFilter {
  year: number;
  count: number;
}

export interface QuotesFilters {
  authors: AuthorFilter[];
  years: YearFilter[];
}

/**
 * Значения для панели фильтров: авторы и годы со счётчиками.
 *
 * Считаем из уже загруженного списка цитат, а не из таблицы users. Это и
 * есть ответ на «только те, у кого не 0 цитат»: в users лежат все
 * пользователи, включая тех, кого ни разу не цитировали, а здесь автор
 * попадает в Map только когда встретился в цитате — значит счётчик не
 * может быть нулём по построению, отдельный фильтр не нужен.
 *
 * Как и buildQuotesLeaderboards, это чистая функция без похода в БД:
 * страница всё равно тянет цитаты целиком. Появится пагинация — счётчики
 * придётся считать в SQL (GROUP BY), потому что на странице будет уже не
 * весь список.
 */
export function buildQuotesFilters(quotes: Quote[]): QuotesFilters {
  const authors = new Map<number, AuthorFilter>();
  const years = new Map<number, number>();

  for (const quote of quotes) {
    const author = quote.quoteAuthor;

    // Цитаты без проставленного автора фильтровать не по кому.
    if (author.id != null) {
      const current = authors.get(author.id);

      if (current) {
        current.count += 1;
      } else {
        authors.set(author.id, {
          id: author.id,
          name: author.name,
          avatarUrl: author.avatarUrl,
          count: 1,
        });
      }
    }

    const year = quote.date.getFullYear();
    years.set(year, (years.get(year) ?? 0) + 1);
  }

  return {
    // При равном счёте — по имени: иначе порядок зависел бы от того, как
    // строки легли в БД, и список бы «прыгал» между рендерами.
    authors: [...authors.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, "ru"),
    ),
    years: [...years.entries()]
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year),
  };
}
