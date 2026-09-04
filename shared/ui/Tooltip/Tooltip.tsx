"use client";

import * as Ariakit from "@ariakit/react";
import type { ReactElement, ReactNode } from "react";
import "./tooltip.css";

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
  content: ReactNode;
  children: ReactElement;
  direction?: TooltipDirection;
  showDelay?: number;
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
      showTimeout={showDelay}
      open={open}
      defaultOpen={defaultOpen}
    >
      <Ariakit.TooltipAnchor render={children} />

      <Ariakit.Tooltip className="tooltip" gutter={8}>
        <Ariakit.TooltipArrow className="tooltip__arrow" size={16} />
        {content}
      </Ariakit.Tooltip>
    </Ariakit.TooltipProvider>
  );
};
