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

export const getUsersList = async (): Promise<User[]> => {
  const users = await db.users.findMany({
    select: { id: true, name: true, mc_uuid: true },
    orderBy: { name: "asc" },
  });

  return users.map((user) => ({
    id: Number(user.id),
    name: user.name,
    avatarUrl: getMCAvatarUrl(user.mc_uuid),
  }));
};
