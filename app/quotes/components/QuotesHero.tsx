import Image from "next/image";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { IconPlus } from "@/shared/ui/icons";
import { StatCard } from "./StatCard";

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
