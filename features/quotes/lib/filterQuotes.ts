import { Quote, QuotesFilters } from "../model/models";

export const filterQuotes = (
  quotes: Quote[],
  filters: QuotesFilters,
  search: string,
) => {
  const filteredQuotes = quotes.filter((quote) => {
    return (
      quote.quote.toLowerCase().includes(search.toLowerCase()) &&
      filters.authors.some((author) => author.id === quote.quoteAuthor?.id) &&
      filters.years.some((year) => year.year === quote.date.getFullYear())
    );
  });

  return filteredQuotes;
};
