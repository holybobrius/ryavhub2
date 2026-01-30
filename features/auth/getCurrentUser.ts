import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { User } from "./models";

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const { id, name, gauntlet } = await validateSession(
      (await cookies()).get("sessionId")?.value
    );

    return { id: Number(id), name, gauntlet };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
