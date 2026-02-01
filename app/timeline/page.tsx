import { getTimelineItems } from "@/features/timeline/getTimelineItems";
import { Button } from "@/shared/ui/Button";
import { IconView } from "@/shared/ui/IconView/IconView";
import { Typography } from "@/shared/ui/Typography";
import { suPlus01 } from "stratis-ui-icons";

const TimelinePage = async () => {
  const timelineItems = await getTimelineItems();
  console.log(timelineItems);
  return <div>
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
      <section className="px-15 mb-38 mt-38">
        <div className="flex flex-col gap-19">
          <div className="flex flex-col gap-5">
            asd
          </div>
        </div>
      </section>
    </div>
};

export default TimelinePage;