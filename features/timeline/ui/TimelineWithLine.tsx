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
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const dotRefs = useRef<Map<number, HTMLElement>>(new Map());
  const lineWrapperRef = useRef<HTMLDivElement>(null);
  const firstItemDotRef = useRef<HTMLDivElement>(null);
  const lineElementRef = useRef<HTMLDivElement>(null);
  const [activeLineHeight, setActiveLineHeight] = useState(0);
  const [activeItemIndices, setActiveItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [lineTop, setLineTop] = useState(0);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [fixedDotLeft, setFixedDotLeft] = useState<number | null>(null);

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

    // Calculate fixed dot left position from the actual line element
    if (lineElementRef.current) {
      const bgLineRect = lineElementRef.current.getBoundingClientRect();
      setFixedDotLeft(bgLineRect.left + bgLineRect.width / 2);
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

  const setItemRef = (element: HTMLElement | null, id: number) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  const setDotRef = (element: HTMLElement | null, id: number) => {
    if (element) {
      dotRefs.current.set(id, element);
    } else {
      dotRefs.current.delete(id);
    }
  };

  let globalIndex = 0;

  return (
    <section className="px-15 mb-38 mt-38">
      <div ref={lineWrapperRef} className="flex flex-col gap-19 relative">
        {/* Continuous background line (inactive - black-500) */}
        <div
          ref={lineElementRef}
          className="absolute w-0.5 bg-black-500 pointer-events-none"
          style={{
            left: "calc(40% - 0.35rem)",
            top: lineTop,
            height: `calc(100% - ${lineTop}px - 2rem)`,
          }}
        />

        {/* Continuous active line (primary-500) - always ends at viewport center */}
        {activeLineHeight > 0 && (
          <div
            className="absolute w-0.5 bg-primary-500 pointer-events-none"
            style={{
              left: "calc(40% - 0.35rem)",
              top: lineTop,
              height: `${activeLineHeight}px`,
            }}
          />
        )}

        {/* Dot fixed at viewport center on the line */}
        {fixedDotLeft !== null && (
          <div
            className="fixed w-4 h-4 rounded-full bg-primary-500 z-20 pointer-events-none"
            style={{
              left: fixedDotLeft,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {groupedTimeline.map((group) => {
          const isYearActive = activeYear === group.year;

          return (
            <div key={group.year} className="flex gap-5">
              {/* Year column - sticky at viewport center when active */}
              <div className="w-2/5 flex flex-col items-start pl-8 relative">
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
              <div className="w-3/5 flex flex-col gap-5">
                {group.items.map((item) => {
                  const currentGlobalIndex = globalIndex++;
                  const isActive = activeItemIndices.has(currentGlobalIndex);
                  const isFirstItem = currentGlobalIndex === 0;

                  return (
                    <div
                      key={`${group.year}-${item.id}`}
                      ref={(el) => setItemRef(el, currentGlobalIndex)}
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
                            left: "-1.4375rem",
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
