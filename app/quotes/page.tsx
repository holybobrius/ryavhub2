import { getQuotesList, getBestQuote } from "@/features/quotes/getQuotesList";
import { Quote } from "@/features/quotes/models";
import { QuoteCard } from "@/features/quotes/ui/QuoteCard";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Button } from "@/shared/ui/Button/Button";
import { IconView } from "@/shared/ui/IconView/IconView";
import { Typography } from "@/shared/ui/Typography";
import dayjs from "dayjs";
import Image from "next/image";
import { suPlus01 } from "stratis-ui-icons";

const SMALL_QUOTE_LENGTH = 150;

type QuoteSize = "small" | "default";

interface QuoteWithSize {
  quote: Quote;
  size: QuoteSize;
  length: number;
}

type QuoteRow = QuoteWithSize[];

const QuotesPage = async () => {
  const quotes = await getQuotesList();
  const bestQuote = await getBestQuote();

  const groupQuotesIntoRows = (quotes: Quote[]): QuoteRow[] => {
    const rows: QuoteRow[] = [];
    let currentRow: QuoteWithSize[] = [];

    for (const quote of quotes) {
      const size: QuoteSize =
        quote.quote.length > SMALL_QUOTE_LENGTH ? "default" : "small";

      if (size === "default") {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
        }
        rows.push([{ quote, size, length: quote.quote.length }]);
      } else {
        if (currentRow.length === 0) {
          currentRow.push({ quote, size, length: quote.quote.length });
        } else if (currentRow.length === 1 && currentRow[0].size === "small") {
          currentRow.push({ quote, size, length: quote.quote.length });
          rows.push(currentRow);
          currentRow = [];
        } else {
          rows.push(currentRow);
          currentRow = [{ quote, size, length: quote.quote.length }];
        }
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const quoteRows = groupQuotesIntoRows(quotes.reverse());

  return (
    <div>
      <section
        className="py-38.25 px-15 h-[calc(100vh-4rem)]"
        style={{
          backgroundImage: "url(/quotes-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-19">
          <Typography.Display className="max-w-175" level={1}>
            КОЛЛЕКЦИЯ ЦИТАТ
          </Typography.Display>
          <Typography.Title level={2} className="max-w-220">
            Здесь собираются различные фразы и шутки друзей. Можно добавлять
            новые и редактировать существующие
          </Typography.Title>
        </div>
        <div className="flex justify-between items-end">
          <Button type="primary" size="large" variant="ghost" bordered suffix={<IconView icon={suPlus01} size={32} />}>
            Добавить цитату
          </Button>
          <Typography.Text size={24} className="max-w-145">
            В редизайне мы уделили этому разделу особое внимание и решили
            добавить небольшой интерактив: теперь, как и в Блядких мемах, можно
            оценивать цитаты!
          </Typography.Text>
        </div>
      </section>
      {bestQuote && (
        <section
          className="py-25 px-15 h-screen mb-38"
          style={{
            backgroundImage: "url(/best-quote-bg.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-11">
              <div>
                <Typography.Display level={3} className="max-w-220 z-999">
                  Поздравляем,{" "}
                  <span className="text-primary-500">
                    {bestQuote.quoteAuthor.name}
                  </span>
                </Typography.Display>
                <div className="relative">
                  <Avatar
                    src={bestQuote.quoteAuthor.avatarUrl || ""}
                    name={bestQuote.quoteAuthor.name}
                    size={588}
                  />
                  <Image
                    className="absolute top-[-150px] left-[400px]"
                    src="/QuoteBest.svg"
                    alt="crown"
                    width={320}
                    height={260}
                  />
                </div>
              </div>
              <Typography.Text size={24} className="max-w-145">
                <span className="text-primary-500">
                  {dayjs(bestQuote.date).format("D MMMM YYYY")} года
                </span>{" "}
                ты сказал настолько отборную хуйню, что она вызвала всеобщий
                восторг и уважение. Уровень держишь уверенно, продолжай радовать
                публику.
              </Typography.Text>
            </div>
            <QuoteCard
              size="default"
              quote={bestQuote}
              formattedDate={dayjs(bestQuote.date).format("D MMMM YYYY")}
              className="w-222"
            />
          </div>
        </section>
      )}
      <section className="px-15 mb-38">
        <div className="flex flex-col gap-19">
          <Typography.Display level={3}>Все цитаты</Typography.Display>
          <div className="flex flex-col gap-5">
            {quoteRows.map((row) => (
              <div
                className="flex gap-5"
                key={row.map((r) => r.quote.id).join(",")}
              >
                {row.map((r) => (
                  <QuoteCard
                    key={r.quote.id}
                    quote={r.quote}
                    formattedDate={dayjs(r.quote.date).format("D MMMM YYYY")}
                    className="w-full"
                    size={r.size}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotesPage;
