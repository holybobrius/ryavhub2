import { getQuotesStats } from "@/features/quotes/lib/getQuotesStats";
import { buildQuotesLeaderboards } from "@/features/quotes/lib/getLeaderboards";
import { getQuotesList } from "@/features/quotes/lib/getQuotesList";
import { selectBestQuotes } from "@/features/quotes/lib/getBestQuotes";
import { buildQuotesFilters } from "@/features/quotes/lib/getQuotesFilters";
import { BestQuote } from "@/features/quotes/ui/BestQuote";
import { QuoteMarquee } from "@/features/quotes/ui/QuoteMarquee/QuoteMarquee";
import { LeaderboardCard } from "@/shared/ui/Leaderboard";
import { Typography } from "@/shared/ui/Typography";
import { IconMessageCircle, IconThumbUp } from "@/shared/ui/icons";
import { QuotesHero } from "./components/QuotesHero";
import { QuotesBrowser } from "@/features/quotes/ui/QuotesBrowser";
import { getCurrentUser } from "@/features/auth/getCurrentUser";

export default async function QuotesPage() {
  const user = await getCurrentUser();
  const [{ quotesCount, rankingsCount }, quotes] = await Promise.all([
    getQuotesStats(),
    getQuotesList(user?.id),
  ]);

  const bestQuotes = selectBestQuotes(quotes);

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

      <section className="mt-[184px] flex flex-col gap-space-3xl">
        <Typography.Heading size="xl" as="h2" color="heading">
          Все цитаты
        </Typography.Heading>

        <QuotesBrowser quotes={quotes} authors={authors} years={years} />
      </section>
    </div>
  );
}
