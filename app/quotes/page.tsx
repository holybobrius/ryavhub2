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

  // Значения фильтров — оттуда же: авторы с ненулевым числом цитат и годы.
  const { authors, years } = buildQuotesFilters(quotes);

  return (
    // Интервалы между блоками разные, поэтому не общий gap контейнера,
    // а mt- на каждом блоке. Крупный шаг между зонами — токен
    // --ryav-layout-block-gap (184px), у него есть и половинный (92px).
    // Шаги 96 и 56 ниже в токенах не заведены — спросить у дизайнера.
    <div className="flex flex-col">
      <QuotesHero quotesCount={quotesCount} rankingsCount={rankingsCount} />

      {/* Лента идёт от края до края: гасим горизонтальный padding <main>
          отрицательными полями на ту же величину (full-bleed).
          TODO: фразы пока моковые — подставим реальный список, когда будет */}
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

        {/* Поле занимает всё свободное место (flex-1 = basis 0), кнопка
            держит свою ширину по содержимому (shrink-0).
            TODO: поиск и создание цитаты пока не подключены. */}
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
