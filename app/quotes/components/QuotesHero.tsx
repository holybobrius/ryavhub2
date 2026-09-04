import Image from "next/image";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { IconPlus } from "@/shared/ui/icons";
import { StatCard } from "./StatCard";

/**
 * Hero страницы цитат: фоновая картинка на всю ширину контента + заголовок.
 * Server-компонент — интерактива нет.
 *
 * next/image с `fill` растягивает картинку по родителю с position:relative,
 * поэтому пропорцию задаёт сам <section> (aspect-[1800/562] — из макета 1920).
 * Картинка 3600×1200 (3:1) чуть шире блока — лишнее срезает object-cover.
 * `priority` — это LCP-элемент страницы: Next добавит <link rel=preload>
 * и не будет лениво грузить.
 */
const formatCount = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value);

interface QuotesHeroProps {
  quotesCount: number;
  rankingsCount: number;
}

export const QuotesHero = ({ quotesCount, rankingsCount }: QuotesHeroProps) => {
  return (
    <section className="relative aspect-[1800/562] overflow-hidden rounded-lg">
      <Image
        src="/quotes_bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* p-[3.3333%] = 60/1800 макета. Процентный padding в CSS считается
          от ШИРИНЫ контейнера — для всех четырёх сторон, — поэтому одно
          значение даёт равные отступы и масштабируется вместе с блоком:
          на 2К отступы растут пропорционально высоте.

          relative — чтобы текст лёг поверх absolute-картинки без z-index.
          Заголовок и подзаголовок лежат в одном inline-потоке: h1 остаётся
          цельным («Коллекция цитат»), а подзаголовок как inline-block встаёт
          сразу после ПОСЛЕДНЕЙ строки заголовка, как на макете. */}
      <div className="relative flex h-full justify-between p-[3.3333%]">
        <div>
          <Typography.Display
            size="lg"
            as="h1"
            color="heading"
            className="inline uppercase"
          >
            Коллекция
            <br />
            цитат
          </Typography.Display>

          <Typography.Body
            size="lg"
            color="tertiary"
            className="ml-space-xl inline-block pb-inset-sm align-bottom"
          >
            Годы разговоров в одном месте.
            <br />
            Листай, оценивай, добавляй своё.
          </Typography.Body>
        </div>

        {/* Правая колонка: ряд счётчиков + кнопка под ними, обе прижаты
            к правому краю (items-end). */}
        <div className="flex flex-col items-end gap-space-xl">
          <div className="flex gap-space-md">
            <StatCard label="Всего цитат" value={formatCount(quotesCount)} />
            <StatCard label="Всего оценок" value={formatCount(rankingsCount)} />
          </div>

          {/* TODO: привязать создание цитаты — формы/роута пока нет */}
          <Button
            size="lg"
            variant="filled"
            tone="secondary"
            rightIcon={<IconPlus />}
          >
            Добавить цитату
          </Button>
        </div>
      </div>
    </section>
  );
};
