import { Suspense } from "react";
import { getTimelineItems } from "@/features/timeline/getTimelineItems";
import { GroupedTimeline, TimelineItem as TimelineItemType } from "@/features/timeline/models";
import { TimelineWithLine } from "@/features/timeline/ui/TimelineWithLine";
import { TimelineSkeleton } from "@/features/timeline/ui/TimelineSkeleton";
import dayjs from "dayjs";

const TimelineContent = async () => {
  const timelineItems = await getTimelineItems();

  const groupedByYear = timelineItems.reduce<
    Record<number, TimelineItemType[]>
  >((acc, item) => {
    const year = dayjs(item.date).year();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  const groupedTimeline: GroupedTimeline[] = Object.entries(groupedByYear)
    .map(([year, items]) => ({ year: parseInt(year), items }))
    .sort((a, b) => b.year - a.year);

  return <TimelineWithLine groupedTimeline={groupedTimeline} />;
};

export const TimelineWithSuspense = () => {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelineContent />
    </Suspense>
  );
};
