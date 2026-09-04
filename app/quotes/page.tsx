import { getQuotesStats } from "@/features/quotes/getQuotesStats";
import { buildQuotesLeaderboards } from "@/features/quotes/getLeaderboards";
import { getQuotesList } from "@/features/quotes/getQuotesList";
import { selectBestQuotes } from "@/features/quotes/getBestQuotes";
import { buildQuotesFilters } from "@/features/quotes/getQuotesFilters";
import { QuoteCard } from "@/features/quotes/ui/QuoteCard";
import { BestQuote } from "@/features/quotes/ui/BestQuote";
import { QuoteMarquee } from "@/features/quotes/ui/QuoteMarquee";
import { QuotesFilters } from "@/features/quotes/ui/QuotesFilters";
import { LeaderboardCard } from "@/shared/ui/Leaderboard";
import { Typography } from "@/shared/ui/Typography";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import {
  IconMessageCircle,
  IconPlus,
  IconSearch,
  IconThumbUp,
} from "@/shared/ui/icons";
import { QuotesHero } from "./components/QuotesHero";

export default async function QuotesPage() {
  const [{ quotesCount, rankingsCount }, quotes] = await Promise.all([
    getQuotesStats(),
    getQuotesList(),
  ]);

  const bestQuotes = selectBestQuotes(quotes);

  const orderedQuotes = [...quotes].reverse();

  const { mostLiked, mostDisliked, mostQuoted } =
    buildQuotesLeaderboards(quotes);

  const { authors, years } = buildQuotesFilters(quotes);

  return (
    <div className="flex flex-col">
      <QuotesHero quotesCount={quotesCount} rankingsCount={rankingsCount} />

      {/* Отрицательный margin гасит padding <main> — лента идёт от края до края.
          Шаги 96 и 56 в токенах не заведены — спросить у дизайнера. */}
      <QuoteMarquee className="mt-96 -mx-page-margin" />

      <BestQuote quotes={bestQuotes} className="mt-layout-block" />

      <section className="mt-56 grid grid-cols-3 gap-space-md">
        <LeaderboardCard
          title="Больше всего лайков"
          icon={<IconThumbUp size={20} />}
          entries={mostLiked}
        />
        <LeaderboardCard
          title="Топ дизлайков"
          icon={<IconThumbUp size={20} className="rotate-180" />}
          entries={mostDisliked}
        />
        <LeaderboardCard
          title="Больше всего цитат"
          icon={<IconMessageCircle size={20} />}
          entries={mostQuoted}
        />
      </section>

      <section className="mt-[184px] flex flex-col gap-space-lg">
        <Typography.Heading size="xl" as="h2" color="heading">
          Все цитаты
        </Typography.Heading>

        <div className="flex items-start gap-space-xl">
          <div className="flex min-w-0 flex-1 flex-col gap-space-md">
            <div className="flex items-center gap-space-md">
              <Input
                size="lg"
                type="search"
                placeholder="Найти цитату"
                aria-label="Найти цитату"
                leftIcon={<IconSearch />}
                className="flex-1"
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
            {orderedQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>

          <QuotesFilters
            authors={authors}
            years={years}
            className="w-[390px] shrink-0"
          />
        </div>
      </section>
    </div>
  );
}
