import type { Quote } from "./models";

export interface AuthorFilter {
  id: number;
  name: string;
  avatarUrl?: string;
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

export function buildQuotesFilters(quotes: Quote[]): QuotesFilters {
  const authors = new Map<number, AuthorFilter>();
  const years = new Map<number, number>();

  for (const quote of quotes) {
    const author = quote.quoteAuthor;

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
    authors: [...authors.values()].sort(
      // При равном счёте — по имени, иначе порядок зависит от порядка строк в БД.
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, "ru"),
    ),
    years: [...years.entries()]
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year),
  };
}
