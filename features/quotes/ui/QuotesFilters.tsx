import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Divider } from "@/shared/ui/Divider";
import { Input } from "@/shared/ui/Input";
import { Radio } from "@/shared/ui/Radio";
import { Typography } from "@/shared/ui/Typography";
import { IconSearch } from "@/shared/ui/icons";
import type {
  AuthorFilter,
  QuotesFilters as QuotesFiltersModel,
  QuotesSortType,
  YearFilter,
} from "../model/models";
import "./quotes-filters.css";
import { YearFilterTag } from "./YearFilterTag";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "best", label: "Сначала лучшие" },
  { value: "oldest", label: "Сначала старые" },
  { value: "worst", label: "Сначала худшие" },
];

interface QuotesFiltersProps {
  authors: AuthorFilter[];
  years: YearFilter[];
  className?: string;
  sort: QuotesSortType;
  handleSortChange: (sort: QuotesSortType) => void;
  filters: QuotesFiltersModel;
  setFilters: (filters: QuotesFiltersModel) => void;
  clearAuthorsFilters: () => void;
  resetAuthorsFilters: () => void;
  clearFilters: () => void;
}

export const QuotesFilters = ({
  authors,
  years,
  className,
  sort,
  handleSortChange,
  filters,
  setFilters,
  clearAuthorsFilters,
  resetAuthorsFilters,
  clearFilters,
}: QuotesFiltersProps) => {
  const [searchAuthor, setSearchAuthor] = useState("");

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchAuthor.toLowerCase()),
  );

  return (
    <aside
      className={["flex flex-col gap-space-md", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-sidebar-card-section rounded-sidebar-card border-sidebar-card border-sidebar-card-border-color bg-sidebar-card-bg p-sidebar-card">
        <Section title="Сортировка">
          <div className="flex flex-col gap-space-sm">
            {SORT_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                name="quotes-sort"
                value={option.value}
                checked={sort === option.value}
                onChange={() =>
                  handleSortChange(option.value as QuotesSortType)
                }
                label={option.label}
              />
            ))}
          </div>
        </Section>

        <Divider />

        <Section
          title="Авторы"
          action={
            <button
              type="button"
              className="text-label-md tracking-label-md font-body cursor-pointer text-surface-text-link"
              onClick={
                filters.authors.length > 0
                  ? clearAuthorsFilters
                  : resetAuthorsFilters
              }
            >
              {filters.authors.length > 0 ? "Снять всё" : "Выбрать все"}
            </button>
          }
        >
          <div className="flex flex-col gap-space-sm">
            <Input
              size="md"
              type="search"
              placeholder="Поиск автора"
              aria-label="Поиск автора"
              leftIcon={<IconSearch />}
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />

            <div className="quotes-filters__scroll flex flex-col gap-space-sm pr-inset-xs">
              {filteredAuthors.map((author) => (
                <Checkbox
                  key={author.id}
                  className="quotes-filters__author"
                  checked={filters.authors.some(
                    (filter) => filter.id === author.id,
                  )}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      authors: filters.authors.some(
                        (filter) => filter.id === author.id,
                      )
                        ? filters.authors.filter(
                            (filter) => filter.id !== author.id,
                          )
                        : [...filters.authors, author],
                    })
                  }
                  value={String(author.id)}
                  label={
                    <span className="flex items-center gap-space-xs">
                      <Avatar
                        size={24}
                        shape="square"
                        src={author.avatarUrl}
                        aria-hidden
                      >
                        {author.name.slice(0, 1)}
                      </Avatar>

                      <Typography.Body
                        size="sm"
                        as="span"
                        className="flex-1 truncate"
                      >
                        {author.name}
                      </Typography.Body>

                      <Typography.Label size="sm" as="span" color="quaternary">
                        {author.count}
                      </Typography.Label>
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        <Section title="Год">
          <div className="flex flex-wrap gap-year-nav">
            {years.map(({ year, count }) => (
              <YearFilterTag
                key={year}
                year={year}
                count={count}
                active={filters.years.some((filter) => filter.year === year)}
                onClick={() =>
                  setFilters({
                    ...filters,
                    years: filters.years.some((filter) => filter.year === year)
                      ? filters.years.filter((filter) => filter.year !== year)
                      : [...filters.years, { year, count }],
                  })
                }
              />
            ))}
          </div>
        </Section>
      </div>

      <Button
        variant="outlined"
        tone="tertiary"
        size="lg"
        className="w-full"
        onClick={clearFilters}
      >
        Сбросить фильтры
      </Button>
    </aside>
  );
};

interface SectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, action, children }: SectionProps) => {
  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between gap-space-xs">
        <Typography.Label size="sm" color="quaternary" className="uppercase">
          {title}
        </Typography.Label>
        {action}
      </div>
      {children}
    </section>
  );
};
