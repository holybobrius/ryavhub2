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
  const [activeItems, setActiveItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const updateActiveItems = () => {
      const viewportCenter = window.innerHeight / 2;
      const newActive = new Set<number>();

      itemRefs.current.forEach((element, id) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const itemTop = rect.top;
        // Item is active if its top is above the viewport center
        if (itemTop < viewportCenter) {
          newActive.add(id);
        }
      });

      setActiveItems(newActive);
    };

    // Initial check
    updateActiveItems();

    // Update on scroll
    const handleScroll = () => updateActiveItems();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveItems);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveItems);
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
  const totalItems = groupedTimeline.reduce((sum, group) => sum + group.items.length, 0);
  const gapBetweenGroups = 19; // gap-19 = 19 * 0.25rem = 4.75rem

  return (
    <section className="px-15 mb-38 mt-38">
      <div className="flex flex-col gap-19">
        {groupedTimeline.map((group, groupIndex) => {
          const isLastGroup = groupIndex === groupedTimeline.length - 1;
          const groupStartIndex = globalIndex;

          return (
            <div key={group.year} className="flex gap-5">
              {/* Year column */}
              <div className="w-2/5 flex flex-col items-end pr-8">
                <Typography.Display className="text-primary-500 mt-4" level={4}>
                  {group.year}
                </Typography.Display>
              </div>

              {/* Items column with dots and lines */}
              <div className="w-3/5 flex flex-col gap-5 relative">
                {group.items.map((item, itemIndex) => {
                  const currentGlobalIndex = globalIndex++;
                  const isActive = activeItems.has(currentGlobalIndex);
                  const isLastItem = isLastGroup && itemIndex === group.items.length - 1;
                  const isLastInGroup = itemIndex === group.items.length - 1;

                  return (
                    <div
                      key={`${group.year}-${item.id}`}
                      ref={(el) => setItemRef(el, currentGlobalIndex)}
                      data-item-id={currentGlobalIndex}
                      className="flex flex-col gap-6 relative"
                    >
                      {/* Dot */}
                      <div
                        className={`
                          absolute w-3 h-3 rounded-full transition-colors duration-300 z-10
                          ${isActive ? "bg-primary-500" : "bg-black-500"}
                        `}
                        style={{ left: "-1.625rem", top: "0" }}
                      />

                      {/* Line segment extending from dot downward */}
                      {!isLastItem && (
                        <div
                          className={`
                            absolute left-0 top-0 w-0.5 transition-colors duration-300
                            ${isActive ? "bg-primary-500" : "bg-black-500"}
                          `}
                          style={{
                            left: "-1.5rem",
                            top: "0.375rem",
                            height: `calc(100% + ${isLastInGroup ? 0 : 5}rem + 0.375rem)`,
                          }}
                        />
                      )}

                      {/* Timeline item content */}
                      <TimelineItemComponent item={item} />
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
