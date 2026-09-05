"use client";

import { Input } from "@/shared/ui/Input";
import { AuthorFilter, YearFilter } from "../model/models";
import { Quote } from "../model/models";
import { useQuotesBrowser } from "../model/useQuotesBrowser";
import { IconPlus, IconSearch } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/Button";
import { QuoteCard } from "./QuoteCard";
import { YearDivider } from "./YearDivider/YearDivider";
import { QuotesFilters } from "./QuoteFilters/QuotesFilters";

interface QuotesBrowserProps {
  quotes: Quote[];
  authors: AuthorFilter[];
  years: YearFilter[];
}

export const QuotesBrowser = ({
  quotes,
  authors,
  years,
}: QuotesBrowserProps) => {
  const {
    quotesByYear,
    sort,
    handleSortChange,
    search,
    handleSearchChange,
    filters,
    setFilters,
    clearAuthorsFilters,
    resetAuthorsFilters,
    clearFilters,
  } = useQuotesBrowser({
    quotes,
    authorsList: authors,
    yearsList: years,
  });

  return (
    <div className="flex items-start gap-space-xl">
      <div className="flex min-w-0 flex-1 flex-col gap-60">
        <div className="flex items-center gap-space-md">
          <Input
            size="lg"
            type="search"
            placeholder="Найти цитату"
            aria-label="Найти цитату"
            leftIcon={<IconSearch />}
            className="flex-1"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Button
            size="lg"
            variant="soft"
            tone="tertiary"
            rightIcon={<IconPlus />}
            className="shrink-0"
          >
            Добавить цитату
          </Button>
        </div>
        {quotesByYear.map(({ year, quotes }) => (
          <div key={`quotes-${year}`} className="flex flex-col gap-space-xl">
            {year && <YearDivider year={year} />}
            <div className="flex flex-col gap-space-md">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <QuotesFilters
        authors={authors}
        years={years}
        className="w-[390px] shrink-0"
        sort={sort}
        handleSortChange={handleSortChange}
        filters={filters}
        setFilters={setFilters}
        clearAuthorsFilters={clearAuthorsFilters}
        resetAuthorsFilters={resetAuthorsFilters}
        clearFilters={clearFilters}
      />
    </div>
  );
};
