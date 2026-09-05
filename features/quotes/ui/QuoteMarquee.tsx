import type { CSSProperties } from "react";
import { QuoteChip } from "./QuoteChip";
import "./quote-marquee.css";

const PHRASES = [
  "ты в муте",
  "ха ха, иногда",
  "spam#3396",
  "eщё я постригся",
  "схуяли",
  "что такое пинакл?",
  "намана дядь",
  "что за агхессия",
  "бредик",
  "статус позволяет",
  "все, сил нет",
  "сколько долгов?",
  "инфа от егора",
  "я комп купил",
  "гога усиление",
  "разъебал",
  "хаммерикс ест сигареты",
  "отойду посмолить",
];

interface QuoteMarqueeProps {
  phrases?: string[];
  durationSec?: number;
  className?: string;
}

export const QuoteMarquee = ({
  phrases = PHRASES,
  durationSec = 110,
  className,
}: QuoteMarqueeProps) => {
  const shuffled = shuffle(phrases);
  const half = Math.ceil(shuffled.length / 2);
  const rows = [shuffled.slice(0, half), shuffled.slice(half)];

  return (
    <section
      className={["flex flex-col gap-space-md", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      {rows.map((row, index) => (
        <MarqueeRow
          key={index}
          phrases={row}
          reverse={index % 2 === 1}
          durationSec={durationSec + index * 20}
        />
      ))}
    </section>
  );
};

interface MarqueeRowProps {
  phrases: string[];
  reverse: boolean;
  durationSec: number;
}

const MarqueeRow = ({ phrases, reverse, durationSec }: MarqueeRowProps) => {
  return (
    <div className="quote-marquee__viewport">
      <div
        className="quote-marquee__track"
        data-reverse={reverse || undefined}
        style={{ "--marquee-duration": `${durationSec}s` } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div className="quote-marquee__group" key={copy}>
            {phrases.map((phrase, index) => (
              <QuoteChip key={`${copy}-${index}`} className="whitespace-nowrap">
                {phrase}
              </QuoteChip>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
