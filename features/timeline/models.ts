import { User } from "../users/models";

export interface TimelineItem {
  id: number;
  title: string;
  location: string;
  date: string;
  created_by: number;
  users: User[];
  description?: string;
}

export interface GroupedTimeline {
  year: number;
  items: TimelineItem[];
}
