"use client";

import { useState } from "react";
import { QuotesSortType } from "./models";

interface HookReturns {
  sort: QuotesSortType;
  handleSortChange: (sort: QuotesSortType) => void;
}

export const useQuotesSort = (): HookReturns => {
  const [sort, setSort] = useState<QuotesSortType>("newest");

  const handleSortChange = (sort: QuotesSortType) => {
    setSort(sort);
  };

  return { sort, handleSortChange };
};
