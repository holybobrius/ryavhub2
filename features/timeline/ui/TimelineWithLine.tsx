"use client";

import { useEffect, useRef, useState } from "react";
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
  const lineWrapperRef = useRef<HTMLDivElement>(null);
  const firstItemDotRef = useRef<HTMLDivElement>(null);
  const [activeLineHeight, setActiveLineHeight] = useState(0);
  const [activeItemIndices, setActiveItemIndices] = useState<Set<number>>(new Set());
  const [lineTop, setLineTop] = useState(0);

  useEffect(() => {
    const updateActiveState = () => {
      const viewportCenter = window.innerHeight / 2;
      const activeIndices = new Set<number>();

      // Find which items are active (past viewport center)
      itemRefs.current.forEach((element, id) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        if (itemCenter < viewportCenter) {
          activeIndices.add(id);
        }
      });

      setActiveItemIndices(activeIndices);

      // Calculate the active line height based on the last active item's position
      if (activeIndices.size > 0 && lineWrapperRef.current && firstItemDotRef.current) {
        const lastActiveId = Math.max(...activeIndices);
        const lastActiveEl = itemRefs.current.get(lastActiveId);
        const firstDotEl = firstItemDotRef.current;

        if (lastActiveEl && firstDotEl) {
          const lineRect = lineWrapperRef.current.getBoundingClientRect();
          const firstDotRect = firstDotEl.getBoundingClientRect();
          const itemRect = lastActiveEl.getBoundingClientRect();

          // Line starts at the first dot's position
          const lineStart = firstDotRect.top - lineRect.top + firstDotRect.height / 2;
          // Active line goes to the center of the last active item
          const activeEnd = itemRect.top - lineRect.top + itemRect.height / 2;

          setLineTop(lineStart);
          setActiveLineHeight(activeEnd - lineStart);
        }
      } else {
        setActiveLineHeight(0);
      }
    };

    // Initial check
    updateActiveState();

    // Update on scroll and resize
    const handleScroll = () => updateActiveState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveState);
    };
  }, [groupedTimeline]);

  const setItemRef = (element: HTMLElement | null, id: number) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  let globalIndex = 0;

  return (
    <section className="px-15 mb-38 mt-38">
      <div ref={lineWrapperRef} className="flex flex-col gap-19 relative">
        {/* Continuous background line (inactive - black-500) */}
        <div
          className="absolute w-0.5 bg-black-500 pointer-events-none"
          style={{ left: "calc(40% - 0.35rem)", top: lineTop, height: `calc(100% - ${lineTop}px - 2rem)` }}
        />

        {/* Continuous active line (primary-500) - fills from top based on scroll */}
        {activeLineHeight > 0 && (
          <div
            className="absolute w-0.5 bg-primary-500 transition-all duration-150 ease-out pointer-events-none"
            style={{ left: "calc(40% - 0.35rem)", top: lineTop, height: `${activeLineHeight}px` }}
          />
        )}

        {groupedTimeline.map((group) => (
          <div key={group.year} className="flex gap-5">
            {/* Year column */}
            <div className="w-2/5 flex flex-col items-end pr-8">
              <Typography.Display className="text-primary-500 mt-4" level={4}>
                {group.year}
              </Typography.Display>
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
                      {/* Dot - ref for first item to calculate line position */}
                      <div
                        ref={isFirstItem ? firstItemDotRef : null}
                        className={`
                          absolute w-3 h-3 rounded-full transition-colors duration-300 z-10
                          ${isActive ? "bg-primary-500" : "bg-black-500"}
                        `}
                        style={{ left: "-1.4375rem", top: "50%", transform: "translateY(-50%)" }}
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
        ))}
      </div>
    </section>
  );
};
