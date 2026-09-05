import { MC_AVATAR_BASE_URL } from "@/shared/const/constants";
import { User } from "./models";
import { db } from "@/lib/db";

export const getUserById = async (id: number): Promise<User | undefined> => {
  try {
    const user = await db.users.findUnique({ where: { id } });

    return {
      id: Number(id),
      name: user?.name || "",
      avatarUrl: `${MC_AVATAR_BASE_URL}${user?.mc_name}`,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
