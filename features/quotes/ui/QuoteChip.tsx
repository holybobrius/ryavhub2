import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Typography } from "@/shared/ui/Typography";

export type QuoteChipTone = "default" | "primary";

interface QuoteChipProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** `default` — приглушённая серая плашка, `primary` — фиолетовый акцент. */
  tone?: QuoteChipTone;
  children: ReactNode;
}

/**
 * Крупная плашка с короткой фразой из цитаты («ты в муте»). Не кнопка и не
 * тег — просто акцентный блок текста, поэтому это `div`, а не `button`.
 *
 * Токены в Figma заданы парами: `--color-quote-chip-bg` и
 * `--color-quote-chip-bg-primary`. Чтобы не дублировать классы под каждый
 * тон, кладём выбранную пару в локальные `--quote-chip-*` переменные, а
 * классы всегда ссылаются на них — тот же приём, что в `Divider`.
 *
 * Локальный компонент фичи: за пределами страницы цитат не нужен.
 */
export function QuoteChip({
  tone = "default",
  className,
  style,
  children,
  ...rest
}: QuoteChipProps) {
  const suffix = tone === "primary" ? "-primary" : "";

  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "rounded-quote-chip",
        "border-quote-chip border-(color:--quote-chip-border-color)",
        "bg-(--quote-chip-bg)",
        "p-quote-chip",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--quote-chip-bg": `var(--color-quote-chip-bg${suffix})`,
          "--quote-chip-border-color": `var(--color-quote-chip-border-color${suffix})`,
          "--quote-chip-text-color": `var(--color-quote-chip-text-color${suffix})`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <Typography.Display
        size="sm"
        as="span"
        className="text-(--quote-chip-text-color)"
      >
        {children}
      </Typography.Display>
    </div>
  );
}
