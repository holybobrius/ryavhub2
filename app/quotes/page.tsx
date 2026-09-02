import { getQuotesStats } from "@/features/quotes/getQuotesStats";
import { buildQuotesLeaderboards } from "@/features/quotes/getLeaderboards";
import { getQuotesList } from "@/features/quotes/getQuotesList";
import { selectBestQuotes } from "@/features/quotes/getBestQuotes";
import { QuoteCard } from "@/features/quotes/ui/QuoteCard";
import { BestQuote } from "@/features/quotes/ui/BestQuote";
import { LeaderboardCard } from "@/shared/ui/Leaderboard";
import { Typography } from "@/shared/ui/Typography";
import { IconMessageCircle, IconThumbUp } from "@/shared/ui/icons";
import { QuotesHero } from "./components/QuotesHero";

/**
 * Server Component: данные берём прямо в компоненте, без API-роута и
 * useEffect — запросы к БД выполняются на сервере при рендере страницы.
 */
export default async function QuotesPage() {
  const [{ quotesCount, rankingsCount }, quotes] = await Promise.all([
    getQuotesStats(),
    getQuotesList(),
  ]);

  // Победителей может быть несколько — при равном рейтинге показываем все,
  // переключение внутри BestQuote.
  const bestQuotes = selectBestQuotes(quotes);

  // Свежие цитаты сверху (в БД они лежат по возрастанию id).
  const orderedQuotes = [...quotes].reverse();

  // Рейтинги считаем из уже загруженного списка — без похода в БД.
  const { mostLiked, mostDisliked, mostQuoted } =
    buildQuotesLeaderboards(quotes);

  return (
    <div className="flex flex-col gap-60">
      <QuotesHero quotesCount={quotesCount} rankingsCount={rankingsCount} />

      <BestQuote quotes={bestQuotes} />

      <section className="grid grid-cols-3 gap-20">
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

      <section className="flex flex-col gap-24">
        <Typography.Heading size="xl" as="h2" color="heading">
          Все цитаты
        </Typography.Heading>

        <div className="flex flex-col gap-20">
          {orderedQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      </section>
    </div>
  );
}
