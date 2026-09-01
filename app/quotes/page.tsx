import { getQuotesStats } from "@/features/quotes/getQuotesStats";
import { getQuotesList, getBestQuote } from "@/features/quotes/getQuotesList";
import { QuoteCard } from "@/features/quotes/ui/QuoteCard";
import { Typography } from "@/shared/ui/Typography";
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

  // Список уже загружен — передаём его, чтобы не выгружать цитаты второй раз.
  const bestQuote = await getBestQuote(quotes);

  // Свежие цитаты сверху (в БД они лежат по возрастанию id).
  const orderedQuotes = [...quotes].reverse();

  return (
    <div className="flex flex-col gap-60">
      <QuotesHero quotesCount={quotesCount} rankingsCount={rankingsCount} />

      <section className="flex flex-col gap-24">
        <Typography.Heading size="xl" as="h2" color="heading">
          Все цитаты
        </Typography.Heading>

        <div className="flex flex-col gap-20">
          {orderedQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isBest={quote.id === bestQuote?.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
