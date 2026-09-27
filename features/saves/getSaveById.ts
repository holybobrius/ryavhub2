import { db } from "@/lib/db";
import { Save } from "./model/models";
import { getSaveImages } from "./saveImages";

export const getSaveById = async (id: string): Promise<Save | null> => {
  const save = await db.gamesaves.findUnique({
    where: { id: parseInt(id) },
  });

  return save
    ? {
        id: save.id,
        name: save.name,
        images: await getSaveImages(save.id.toString()),
        year: save.year,
        version: save.version ?? "-",
        size: save.size,
        downloadUrl: save.download,
      }
    : null;
};
