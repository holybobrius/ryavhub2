import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { User } from "./models";
import { getMCAvatarUrl } from "@/shared/lib/avatars";

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const { id, name, gauntlet, mc_uuid } = await validateSession(
      (await cookies()).get("sessionId")?.value,
    );

    return {
      id: Number(id),
      name,
      gauntlet,
      avatarUrl: getMCAvatarUrl(mc_uuid),
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
