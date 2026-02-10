"use client";

import { useEffect, useRef, useState } from "react";
import { TimelineItem as TimelineItemComponent } from "./TimelineItem";
import { GroupedTimeline, TimelineItem as TimelineItemType } from "../models";
import { Typography } from "@/shared/ui/Typography";

interface FlatItem {
  globalIndex: number;
  year: number;
  item: TimelineItemType;
}

interface LineLayout {
  leftPx: number;
  dotOffsetPx: number;
}

interface Props {
  groupedTimeline: GroupedTimeline[];
}

export const TimelineWithLine = ({ groupedTimeline }: Props) => {
  const dotRefs = useRef<Map<number, HTMLElement>>(new Map());
  const lineWrapperRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const yearColumnRef = useRef<HTMLDivElement>(null);
  const itemsColumnRef = useRef<HTMLDivElement>(null);

  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeLineHeight, setActiveLineHeight] = useState(0);
  const [lineTop, setLineTop] = useState(0);
  const [lineLayout, setLineLayout] = useState<LineLayout | null>(null);

  const flatItems: FlatItem[] = [];
  for (const group of groupedTimeline) {
    for (const item of group.items) {
      flatItems.push({ globalIndex: flatItems.length, year: group.year, item });
    }
  }

  const indexToYear = new Map<number, number>();
  for (const fi of flatItems) {
    indexToYear.set(fi.globalIndex, fi.year);
  }

  const itemsByYear = new Map<number, FlatItem[]>();
  for (const fi of flatItems) {
    let arr = itemsByYear.get(fi.year);
    if (!arr) {
      arr = [];
      itemsByYear.set(fi.year, arr);
    }
    arr.push(fi);
  }

  useEffect(() => {
    const update = () => {
      const viewportCenter = window.innerHeight / 2;

      const newActiveIndices = new Set<number>();
      dotRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        if (rect.top + rect.height / 2 < viewportCenter) {
          newActiveIndices.add(id);
        }
      });
      setActiveIndices(newActiveIndices);

      if (newActiveIndices.size > 0) {
        const lastId = Math.max(...newActiveIndices);
        setActiveYear(indexToYear.get(lastId) ?? null);
      } else {
        setActiveYear(null);
      }

      const wrapper = lineWrapperRef.current;
      const yearCol = yearColumnRef.current;
      const itemsCol = itemsColumnRef.current;
      if (wrapper && yearCol && itemsCol) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const yearRect = yearCol.getBoundingClientRect();
        const itemsRect = itemsCol.getBoundingClientRect();
        const centerX = (yearRect.right + itemsRect.left) / 2;
        const leftPx = centerX - wrapperRect.left;
        const dotOffsetPx = leftPx - (itemsRect.left - wrapperRect.left) - 6;
        setLineLayout({ leftPx, dotOffsetPx });
      }

      const firstDot = firstDotRef.current;
      if (wrapper && firstDot) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const dotRect = firstDot.getBoundingClientRect();
        const start = dotRect.top - wrapperRect.top + dotRect.height / 2;
        setLineTop(start);
        setActiveLineHeight(
          Math.max(0, viewportCenter - wrapperRect.top - start)
        );
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [groupedTimeline]);

  const setDotRef = (el: HTMLElement | null, index: number) => {
    if (el) {
      dotRefs.current.set(index, el);
      if (index === 0) {
        (firstDotRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el as HTMLDivElement;
      }
    } else {
      dotRefs.current.delete(index);
    }
  };

  return (
    <section className="px-15 mb-38 mt-38">
      <div ref={lineWrapperRef} className="flex flex-col gap-19 relative">
        {lineLayout && (
          <>
            <div
              className="absolute w-0.5 bg-black-500 pointer-events-none"
              style={{
                left: lineLayout.leftPx,
                top: lineTop,
                height: `calc(100% - ${lineTop}px - 2rem)`,
              }}
            />
            {activeLineHeight > 0 && (
              <div
                className="absolute w-0.5 bg-primary-500 pointer-events-none"
                style={{
                  left: lineLayout.leftPx,
                  top: lineTop,
                  height: `${activeLineHeight}px`,
                }}
              />
            )}
          </>
        )}

        {groupedTimeline.map((group, groupIdx) => (
          <div key={group.year} className="flex">
            <div
              ref={groupIdx === 0 ? yearColumnRef : undefined}
              className="w-1/5 shrink-0 flex flex-col items-start relative"
            >
              <div
                className="sticky"
                style={{ top: "50vh", transform: "translateY(-50%)" }}
              >
                <Typography.Display
                  className={`transition-colors duration-300 ${activeYear === group.year
                    ? "text-primary-500"
                    : "text-black-500"
                    }`}
                  level={4}
                >
                  {group.year}
                </Typography.Display>
              </div>
            </div>

            <div className="flex-1" />

            <div
              ref={groupIdx === 0 ? itemsColumnRef : undefined}
              className="shrink-0 w-3/5 flex flex-col gap-5"
            >
              {(itemsByYear.get(group.year) ?? []).map((fi) => (
                <div
                  key={`${fi.year}-${fi.item.id}`}
                  data-item-id={fi.globalIndex}
                  className="flex flex-col gap-6"
                >
                  <div className="relative">
                    <div
                      ref={(el) => setDotRef(el, fi.globalIndex)}
                      className={`absolute w-3 h-3 rounded-full transition-colors duration-300 z-10 ${activeIndices.has(fi.globalIndex)
                        ? "bg-primary-500"
                        : "bg-black-500"
                        }`}
                      style={{
                        left: lineLayout?.dotOffsetPx ?? "-1.4375rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <TimelineItemComponent item={fi.item} disabled={!activeIndices.has(fi.globalIndex)} />
                  </div>
                  <div className="h-0.25 w-full bg-black-850 my-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
