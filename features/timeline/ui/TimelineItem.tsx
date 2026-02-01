"use client";

import { Typography } from "@/shared/ui/Typography";
import { TimelineItem as TimelineItemType } from "../models";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Chip } from "@/shared/ui/Chip/Chip";
import { IconView } from "@/shared/ui/IconView/IconView";
import { suGlobe04 } from "stratis-ui-icons";

interface Props {
    item: TimelineItemType;
}

export const TimelineItem = ({ item }: Props) => {
    dayjs.locale("ru");
    const date = dayjs(item.date);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <Chip text={item.location} type="primary" variant="soft" prefix={<IconView icon={suGlobe04} size={18} />} />
                    <Typography.Text size={18} className="text-black-500">{date.format("DD MMMM YYYY")}</Typography.Text>
                </div>
                <Typography.Title level={2}>{item.title}</Typography.Title>
            </div>
            <div className="flex gap-2 flex-wrap">
                {item.users.map(n => <Chip key={`${item.id}-${n.id}`} text={n.name} type="secondary" variant="filled" avatar={n.avatarUrl} />)}
            </div>
        </div>
    )
};