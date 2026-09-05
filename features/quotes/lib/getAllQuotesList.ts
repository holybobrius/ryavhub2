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
  const sortedQuotes = sortQuotes(quotes, sort);

  const quotesByYear = new Map<number, Quote[]>();

  const filteredQuotes = filterQuotes(sortedQuotes, filters, search);

  if (sort === "best" || sort === "worst") {
    return [{ quotes: filteredQuotes }];
  }

  for (const quote of filteredQuotes) {
    const year = quote.date.getFullYear();
    quotesByYear.set(year, [...(quotesByYear.get(year) ?? []), quote]);
  }

  return Array.from(quotesByYear.entries()).map(([year, quotes]) => ({
    year,
    quotes,
  }));
};
