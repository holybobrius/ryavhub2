import { Quote, QuotesFilters } from "../model/models";

export const filterQuotes = (
  quotes: Quote[],
  filters: QuotesFilters,
  search: string,
) => {
  const authorIds = new Set(filters.authors.map((author) => author.id));
  const years = new Set(filters.years.map((year) => year.year));
  const searchQuery = search.trim().toLowerCase();

  const filteredQuotes = quotes.filter(
    (quote) =>
      years.has(quote.date.getFullYear()) &&
      (!quote.quoteAuthor?.id || authorIds.has(quote.quoteAuthor?.id)) &&
      (searchQuery === "" || quote.quote.toLowerCase().includes(searchQuery)),
  );

  return filteredQuotes;
};
