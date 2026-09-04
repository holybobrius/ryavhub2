"use client";

import * as Ariakit from "@ariakit/react";
import type { ReactElement, ReactNode } from "react";
import "./tooltip.css";

// 12 направлений из макета = {сторона}-{выравнивание}. Второе слово —
// куда смотрит стрелка (край, у которого она стоит).
export type TooltipDirection =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-bottom"
  | "left-center"
  | "left-top";

// Маппинг на placement Ariakit (start/end относительно стороны).
const PLACEMENT: Record<
  TooltipDirection,
  Ariakit.TooltipStoreProps["placement"]
> = {
  "top-left": "top-start",
  "top-center": "top",
  "top-right": "top-end",
  "right-top": "right-start",
  "right-center": "right",
  "right-bottom": "right-end",
  "bottom-right": "bottom-end",
  "bottom-center": "bottom",
  "bottom-left": "bottom-start",
  "left-bottom": "left-end",
  "left-center": "left",
  "left-top": "left-start",
};

export interface TooltipProps {
  /** Текст подсказки. */
  content: ReactNode;
  /** Элемент-триггер (кнопка, иконка и т.п.). */
  children: ReactElement;
  direction?: TooltipDirection;
  /** Задержка показа по ховеру, мс (у Ariakit дефолт 500 — слишком много). */
  showDelay?: number;
  /** Управляемая видимость (для витрин/контроля извне). */
  open?: boolean;
  defaultOpen?: boolean;
}

export const Tooltip = ({
  content,
  children,
  direction = "top-center",
  showDelay = 200,
  open,
  defaultOpen,
}: TooltipProps) => {
  return (
    <Ariakit.TooltipProvider
      placement={PLACEMENT[direction]}
      // showTimeout — задержка показа; hideTimeout у тултип-стора = 0 (скрытие мгновенно).
      showTimeout={showDelay}
      open={open}
      defaultOpen={defaultOpen}
    >
      <Ariakit.TooltipAnchor render={children} />
      {/* gutter — зазор между триггером и подсказкой (--ryav-tooltip-arrow-gap = 8). */}
      <Ariakit.Tooltip className="tooltip" gutter={8}>
        <Ariakit.TooltipArrow className="tooltip__arrow" size={16} />
        {content}
      </Ariakit.Tooltip>
    </Ariakit.TooltipProvider>
  );
};
