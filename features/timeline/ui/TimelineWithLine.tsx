"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TimelineItem as TimelineItemComponent } from "./TimelineItem";
import { TimelineItem as TimelineItemType } from "../models";
import { Typography } from "@/shared/ui/Typography";

interface GroupedTimeline {
  year: number;
  items: TimelineItemType[];
}

interface Props {
  groupedTimeline: GroupedTimeline[];
}

export const TimelineWithLine = ({ groupedTimeline }: Props) => {
  const dotRefs = useRef<Map<number, HTMLElement>>(new Map());
  const lineWrapperRef = useRef<HTMLDivElement>(null);
  const firstItemDotRef = useRef<HTMLDivElement>(null);
  const yearColumnRef = useRef<HTMLDivElement>(null);
  const itemsColumnRef = useRef<HTMLDivElement>(null);

  const [activeLineHeight, setActiveLineHeight] = useState(0);
  const [activeItemIndices, setActiveItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [lineTop, setLineTop] = useState(0);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [lineLeftPx, setLineLeftPx] = useState<number | null>(null);
  const [dotOffsetPx, setDotOffsetPx] = useState<number | null>(null);

  // Build a mapping of globalIndex -> year for determining active year
  const indexToYear = useRef<Map<number, number>>(new Map());
  useEffect(() => {
    const map = new Map<number, number>();
    let idx = 0;
    for (const group of groupedTimeline) {
      for (const _ of group.items) {
        map.set(idx, group.year);
        idx++;
      }
    }
    indexToYear.current = map;
  }, [groupedTimeline]);

  const updateActiveState = useCallback(() => {
    const viewportCenter = window.innerHeight / 2;
    const activeIndices = new Set<number>();

    // Find which items are active (their dot has passed viewport center)
    dotRefs.current.forEach((dotElement, id) => {
      if (!dotElement) return;
      const dotRect = dotElement.getBoundingClientRect();
      const dotCenter = dotRect.top + dotRect.height / 2;
      if (dotCenter < viewportCenter) {
        activeIndices.add(id);
      }
    });

    setActiveItemIndices(activeIndices);

    // Determine the active year from the last active item
    if (activeIndices.size > 0) {
      const lastActiveId = Math.max(...activeIndices);
      const year = indexToYear.current.get(lastActiveId);
      if (year !== undefined) {
        setActiveYear(year);
      }
    } else {
      setActiveYear(null);
    }

    // Calculate line left position: centered between year column right edge and items column left edge
    if (
      yearColumnRef.current &&
      itemsColumnRef.current &&
      lineWrapperRef.current
    ) {
      const wrapperRect = lineWrapperRef.current.getBoundingClientRect();
      const yearRect = yearColumnRef.current.getBoundingClientRect();
      const itemsRect = itemsColumnRef.current.getBoundingClientRect();
      const centerX = (yearRect.right + itemsRect.left) / 2;
      const linePx = centerX - wrapperRect.left;
      setLineLeftPx(linePx);
      // Dot offset: line position relative to items column left edge, minus half dot width (6px)
      setDotOffsetPx(linePx - (itemsRect.left - wrapperRect.left) - 6);
    }

    // Calculate the active line height: always ends at viewport center
    if (lineWrapperRef.current && firstItemDotRef.current) {
      const lineRect = lineWrapperRef.current.getBoundingClientRect();
      const firstDotRect = firstItemDotRef.current.getBoundingClientRect();

      // Line starts at the first dot's position
      const lineStart =
        firstDotRect.top - lineRect.top + firstDotRect.height / 2;
      setLineTop(lineStart);

      // Active line ends at viewport center (converted to wrapper-relative coords)
      const viewportCenterInWrapper = viewportCenter - lineRect.top;
      const activeHeight = viewportCenterInWrapper - lineStart;

      if (activeHeight > 0) {
        setActiveLineHeight(activeHeight);
      } else {
        setActiveLineHeight(0);
      }
    }
  }, []);

  useEffect(() => {
    // Initial check
    updateActiveState();

    // Update on scroll and resize
    window.addEventListener("scroll", updateActiveState, { passive: true });
    window.addEventListener("resize", updateActiveState);

    return () => {
      window.removeEventListener("scroll", updateActiveState);
      window.removeEventListener("resize", updateActiveState);
    };
  }, [groupedTimeline, updateActiveState]);

  const setDotRef = (element: HTMLElement | null, id: number) => {
    if (element) {
      dotRefs.current.set(id, element);
    } else {
      dotRefs.current.delete(id);
    }
  };

  let globalIndex = 0;
  let yearColumnRefSet = false;
  let itemsColumnRefSet = false;

  return (
    <section className="px-15 mb-38 mt-38">
      <div ref={lineWrapperRef} className="flex flex-col gap-19 relative">
        {/* Continuous background line (inactive - black-500) */}
        {lineLeftPx !== null && (
          <div
            className="absolute w-0.5 bg-black-500 pointer-events-none"
            style={{
              left: lineLeftPx,
              top: lineTop,
              height: `calc(100% - ${lineTop}px - 2rem)`,
            }}
          />
        )}

        {/* Continuous active line (primary-500) - always ends at viewport center */}
        {activeLineHeight > 0 && lineLeftPx !== null && (
          <div
            className="absolute w-0.5 bg-primary-500 pointer-events-none"
            style={{
              left: lineLeftPx,
              top: lineTop,
              height: `${activeLineHeight}px`,
            }}
          />
        )}

        {groupedTimeline.map((group) => {
          const isYearActive = activeYear === group.year;
          // Capture refs from the first group to measure column positions
          const captureYearRef = !yearColumnRefSet;
          const captureItemsRef = !itemsColumnRefSet;
          if (captureYearRef) yearColumnRefSet = true;
          if (captureItemsRef) itemsColumnRefSet = true;

          return (
            <div key={group.year} className="flex gap-5">
              {/* Year column - sticky at viewport center when active */}
              <div
                ref={captureYearRef ? yearColumnRef : undefined}
                className="w-2/5 flex flex-col items-start pl-8 relative"
              >
                <div
                  className="sticky"
                  style={{ top: "50vh", transform: "translateY(-50%)" }}
                >
                  <Typography.Display
                    className={`transition-colors duration-300 ${isYearActive ? "text-primary-500" : "text-black-500"}`}
                    level={4}
                  >
                    {group.year}
                  </Typography.Display>
                </div>
              </div>

              {/* Items column with dots */}
              <div
                ref={captureItemsRef ? itemsColumnRef : undefined}
                className="w-3/5 flex flex-col gap-5"
              >
                {group.items.map((item) => {
                  const currentGlobalIndex = globalIndex++;
                  const isActive = activeItemIndices.has(currentGlobalIndex);
                  const isFirstItem = currentGlobalIndex === 0;

                  return (
                    <div
                      key={`${group.year}-${item.id}`}
                      data-item-id={currentGlobalIndex}
                      className="flex flex-col gap-6"
                    >
                      <div className="relative">
                        {/* Dot on the line */}
                        <div
                          ref={(el) => {
                            if (isFirstItem) {
                              (
                                firstItemDotRef as React.MutableRefObject<HTMLDivElement | null>
                              ).current = el;
                            }
                            setDotRef(el, currentGlobalIndex);
                          }}
                          className={`
                            absolute w-3 h-3 rounded-full transition-colors duration-300 z-10
                            ${isActive ? "bg-primary-500" : "bg-black-500"}
                          `}
                          style={{
                            left: dotOffsetPx ?? "-1.4375rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />

                        {/* Timeline item content */}
                        <TimelineItemComponent item={item} />
                      </div>
                      <div className="h-0.25 w-full bg-black-850 my-20" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
