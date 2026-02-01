import { Dayjs } from "dayjs";
import { User } from "../users/models";

export interface TimelineItem {
  id: number;
  title: string;
  location: string;
  date: Dayjs;
  created_by: number;
  users: User[];
  description?: string;
}