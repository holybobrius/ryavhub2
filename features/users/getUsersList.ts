import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { User } from "./models";
import { db } from "@/lib/db";

export const getUserById = async (id: number): Promise<User | undefined> => {
  try {
    const user = await db.users.findUnique({ where: { id } });

    return {
      id: Number(id),
      name: user?.name || "",
      avatarUrl: "",
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
