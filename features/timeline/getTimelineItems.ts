import { db } from "@/lib/db";
import { TimelineItem } from "./models";

export const getTimelineItems = async (): Promise<TimelineItem[]> => {
    const timelineItems = await db.timeline.findMany();
    const timelineParticipants = await db.timeline_participants.findMany();
    const users = await db.users.findMany();

    return timelineItems.reverse().map((n) => {
        return {
          id: Number(n.id),
          title: n.title,
          location: n.location ?? '',
          date: n.date?.toISOString() || new Date().toISOString(),
          created_by: Number(n.created_by),
          users: timelineParticipants
            .filter((p) => p.timeline_id === n.id)
            .map((p) => ({
              id: Number(p.user_id),
              name: users.find((u) => u.id === p.user_id)?.name || "",
              avatarUrl: "",
            })),
          description: n.description ?? undefined,
        };
    });
};