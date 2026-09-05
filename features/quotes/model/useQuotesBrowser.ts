import { useDeferredValue } from "react";
import { getAllQuotesList } from "../lib/getAllQuotesList";
import {
  AuthorFilter,
  Quote,
  QuotesByYear,
  QuotesFilters,
  QuotesSortType,
  YearFilter,
} from "./models";
import { useQuotesFilters } from "./useQuotesFilters";
import { useQuotesSearch } from "./useQuotesSearch";
import { useQuotesSort } from "./useQuotesSort";

interface UseQuotesBrowserProps {
  quotes: Quote[];
  authorsList: AuthorFilter[];
  yearsList: YearFilter[];
}

interface HookReturns {
  quotesByYear: QuotesByYear[];
  sort: QuotesSortType;
  handleSortChange: (sort: QuotesSortType) => void;
  filters: QuotesFilters;
  setFilters: (filters: QuotesFilters) => void;
  clearAuthorsFilters: () => void;
  resetAuthorsFilters: () => void;
  clearFilters: () => void;
  search: string;
  handleSearchChange: (search: string) => void;
}

export const useQuotesBrowser = ({
  quotes,
  authorsList,
  yearsList,
}: UseQuotesBrowserProps): HookReturns => {
  const { sort, handleSortChange } = useQuotesSort();
  const {
    filters,
    setFilters,
    clearAuthorsFilters,
    resetAuthorsFilters,
    clearFilters,
  } = useQuotesFilters({ authorsList, yearsList });
  const { search, handleSearchChange } = useQuotesSearch();
  const deferredSearch = useDeferredValue(search);

  const quotesByYear = getAllQuotesList({
    sort,
    quotes,
    filters,
    search: deferredSearch,
  });
  return {
    quotesByYear,
    sort,
    handleSortChange,
    filters,
    setFilters,
    clearAuthorsFilters,
    resetAuthorsFilters,
    clearFilters,
    search,
    handleSearchChange,
  };
};
