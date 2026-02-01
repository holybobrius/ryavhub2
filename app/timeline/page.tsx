import { getTimelineItems } from "@/features/timeline/getTimelineItems";
import { TimelineItem as TimelineItemType } from "@/features/timeline/models";
import { TimelineWithLine } from "@/features/timeline/ui/TimelineWithLine";
import { Button } from "@/shared/ui/Button";
import { IconView } from "@/shared/ui/IconView/IconView";
import { Typography } from "@/shared/ui/Typography";
import { suPlus01 } from "stratis-ui-icons";
import dayjs from "dayjs";

interface GroupedTimeline {
  year: number;
  items: TimelineItemType[];
}

const TimelinePage = async () => {
  const timelineItems = await getTimelineItems();

  const groupedByYear = timelineItems.reduce<Record<number, TimelineItemType[]>>((acc, item) => {
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

  return (
    <div>
      <section
        className="py-38.25 px-15 h-[calc(100vh-4rem)] flex flex-col justify-end"
        style={{
          backgroundImage: "url(/timeline-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-25">
          <Typography.Display className="max-w-175" level={1}>
            ТАЙМЛАЙН СОБЫТИЙ
          </Typography.Display>
          <div className="flex flex-col gap-14">
            <Typography.Title level={2} className="max-w-220">
              Добавляйте ключевые события хаба, чтобы вместе создать живую историю сообщества.
            </Typography.Title>
            <Button type="primary" size="large" variant="ghost" bordered className="w-fit" suffix={<IconView icon={suPlus01} size={32} />}>
              Добавить событие
            </Button>
          </div>
        </div>
      </section>
      <TimelineWithLine groupedTimeline={groupedTimeline} />
    </div>
  );
};

export default TimelinePage;