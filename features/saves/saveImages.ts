import { readdir } from "node:fs/promises";
import path from "node:path";

const SAVE_IMAGES_DIR =
  process.env.SAVE_IMAGES_DIR ??
  path.join(process.cwd(), "public", "save-images");
const SAVE_IMAGES_BASE_URL = process.env.SAVE_IMAGES_BASE_URL ?? "/save-images";

const readSaveImagesDir = async () => {
  try {
    return await readdir(SAVE_IMAGES_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export const getSaveImages = async (saveId: string) => {
  const pattern = new RegExp(`^${saveId}-(\\d+)\\.webp$`);
  const files = await readSaveImagesDir();

  return files
    .map((file) => ({ file, number: Number(file.match(pattern)?.[1]) }))
    .filter((file) => file.number > 0)
    .sort((a, b) => a.number - b.number)
    .map((file) => `${SAVE_IMAGES_BASE_URL}/${file.file}`);
};

export const getSavePreviewUrl = (saveId: string) => {
  return `${SAVE_IMAGES_BASE_URL}/${saveId}-1.webp`;
};
