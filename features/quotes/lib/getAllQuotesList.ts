import {
  Quote,
  QuotesByYear,
  QuotesFilters,
  QuotesSortType,
} from "../model/models";
import { sortQuotes } from "../lib/sortQuotes";
import { filterQuotes } from "./filterQuotes";

interface AllQuotesListProps {
  quotes: Quote[];
  sort: QuotesSortType;
  filters: QuotesFilters;
  search: string;
}

export const getAllQuotesList = ({
  sort,
  quotes,
  filters,
  search,
}: AllQuotesListProps): QuotesByYear[] => {
  const filteredQuotes = filterQuotes(quotes, filters, search);

  const sortedQuotes = sortQuotes(filteredQuotes, sort);

  const quotesByYear = new Map<number, Quote[]>();

  if (sort === "best" || sort === "worst") {
    return [{ quotes: sortedQuotes }];
  }

  for (const quote of sortedQuotes) {
    const year = quote.date.getFullYear();
    quotesByYear.set(year, [...(quotesByYear.get(year) ?? []), quote]);
  }

  return Array.from(quotesByYear.entries()).map(([year, quotes]) => ({
    year,
    quotes,
  }));
};
