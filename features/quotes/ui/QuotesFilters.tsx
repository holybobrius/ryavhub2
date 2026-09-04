import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Divider } from "@/shared/ui/Divider";
import { Input } from "@/shared/ui/Input";
import { Radio } from "@/shared/ui/Radio";
import { Typography } from "@/shared/ui/Typography";
import { IconSearch } from "@/shared/ui/icons";
import type { AuthorFilter, YearFilter } from "../getQuotesFilters";
import "./quotes-filters.css";

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
}

export function QuotesFilters({
  authors,
  years,
  className,
}: QuotesFiltersProps) {
  return (
    <aside
      className={["flex flex-col gap-space-md", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-sidebar-card-section rounded-sidebar-card border-sidebar-card border-sidebar-card-border-color bg-sidebar-card-bg p-sidebar-card">
        <Section title="Сортировка">
          <div className="flex flex-col gap-space-sm">
            {SORT_OPTIONS.map((option, index) => (
              <Radio
                key={option.value}
                name="quotes-sort"
                value={option.value}
                label={option.label}
                defaultChecked={index === 0}
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
            >
              Снять всё
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
            />

            <div className="quotes-filters__scroll flex flex-col gap-space-sm pr-inset-xs">
              {authors.map((author) => (
                <Checkbox
                  key={author.id}
                  className="quotes-filters__author"
                  defaultChecked
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
              <button key={year} type="button" className="quotes-filters__year">
                <Typography.Body size="sm" as="span">
                  {year}
                </Typography.Body>
                <Typography.Label
                  size="xs"
                  as="span"
                  className="quotes-filters__year-count"
                >
                  {count}
                </Typography.Label>
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Button variant="outlined" tone="tertiary" size="lg" className="w-full">
        Сбросить фильтры
      </Button>
    </aside>
  );
}

interface SectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, action, children }: SectionProps) {
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
}
