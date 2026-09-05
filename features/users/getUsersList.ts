import { User } from "./models";
import { db } from "@/lib/db";
import { getMCAvatarUrl } from "@/shared/lib/avatars";

export const getUserById = async (id: number): Promise<User | undefined> => {
  try {
    const user = await db.users.findUnique({ where: { id } });

    return {
      id: Number(id),
      name: user?.name || "",
      avatarUrl: getMCAvatarUrl(user?.mc_uuid),
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
