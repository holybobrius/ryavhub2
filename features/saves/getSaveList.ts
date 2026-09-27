import { db } from "@/lib/db";
import { SaveListItem } from "./model/models";
import { baseImageUrl } from "./getSaveImageUrl";

export const getSaveList = async (): Promise<SaveListItem[]> => {
  const saves = await db.gamesaves.findMany({
    orderBy: [{ year: "desc" }, { id: "desc" }],
  });

  return saves.map((save) => {
    return {
      id: save.id,
      name: save.name,
      imageUrl: `${baseImageUrl}/${save.id}-1.webp`,
      year: save.year,
      version: save.version ?? "-",
      size: save.size,
      downloadUrl: save.download,
    };
  });
};
