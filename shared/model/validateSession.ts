import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { db } from "@/lib/db";
import { UnauthError } from "@/shared/errors/UnauthError";

dayjs.extend(utc);

export const validateSession = (session?: string) => {
  if (!session) return Promise.reject(new UnauthError());
  return db.sessions
    .findFirstOrThrow({ where: { session }, include: { users: true } })
    .then(({ valid_till, users }) => {
      if (dayjs.utc().isAfter(dayjs.utc(valid_till))) {
        db.sessions.delete({ where: { session } });
        return Promise.reject(new UnauthError());
      }

      return users;
    })
    .catch((error) => {
      console.error("Error validating session", error);
      return Promise.reject(new UnauthError());
    });
};
