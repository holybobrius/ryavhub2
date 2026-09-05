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
  const [filters, setFilters] = useState<QuotesFilters>({
    authors: authorsList,
    years: yearsList,
  });

  const clearAuthorsFilters = () => {
    setFilters({
      authors: [],
      years: filters.years,
    });
  };

  const resetAuthorsFilters = () => {
    setFilters({
      authors: authorsList,
      years: filters.years,
    });
  };

  const clearFilters = () => {
    setFilters({
      authors: authorsList,
      years: yearsList,
    });
  };

  return {
    filters,
    setFilters,
    clearAuthorsFilters,
    resetAuthorsFilters,
    clearFilters,
  };
};
