import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { User } from "./models";
import { MC_AVATAR_BASE_URL } from "@/shared/const/constants";

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const { id, name, gauntlet, mc_name } = await validateSession(
      (await cookies()).get("sessionId")?.value,
    );

    return {
      id: Number(id),
      name,
      gauntlet,
      avatarUrl: mc_name ? `${MC_AVATAR_BASE_URL}${mc_name}` : undefined,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
