export const MC_AVATAR_BASE_URL = "https://render.crafty.gg/2d/head/";

export const getMCAvatarUrl = (mcUuid?: string | null): string | undefined => {
  return mcUuid
    ? `${MC_AVATAR_BASE_URL}${encodeURIComponent(mcUuid)}`
    : undefined;
};
