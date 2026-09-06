import { useState } from "react";
import { AuthorFilter, YearFilter } from "./models";

type QuotesFilters = {
  authors: AuthorFilter[];
  years: YearFilter[];
};

interface Props {
  authorsList: AuthorFilter[];
  yearsList: YearFilter[];
}

interface HookReturns {
  filters: QuotesFilters;
  setFilters: (filters: QuotesFilters) => void;
  clearAuthorsFilters: () => void;
  resetAuthorsFilters: () => void;
  clearFilters: () => void;
}

export const useQuotesFilters = ({
  authorsList,
  yearsList,
}: Props): HookReturns => {
  const [excludedAuthorIds, setExcludedAuthorIds] = useState<number[]>([]);
  const [excludedYears, setExcludedYears] = useState<number[]>([]);

  const filters = {
    authors: authorsList.filter((n) => !excludedAuthorIds.includes(n.id)),
    years: yearsList.filter((n) => !excludedYears.includes(n.year)),
  };

  const setFilters = (next: QuotesFilters) => {
    setExcludedAuthorIds(
      authorsList
        .filter((n) => !next.authors.some((s) => s.id === n.id))
        .map((n) => n.id),
    );
    setExcludedYears(
      yearsList
        .filter((n) => !next.years.some((s) => s.year === n.year))
        .map((n) => n.year),
    );
  };

  const clearAuthorsFilters = () =>
    setExcludedAuthorIds(authorsList.map((n) => n.id));

  const resetAuthorsFilters = () => setExcludedAuthorIds([]);

  const clearFilters = () => {
    setExcludedAuthorIds([]);
    setExcludedYears([]);
  };

  return {
    filters,
    setFilters,
    clearAuthorsFilters,
    resetAuthorsFilters,
    clearFilters,
  };
};
