"use client";

import { EmptyState } from "@/shared/ui/EmptyState";
import { IconImage } from "@/shared/ui/icons";
import Image, { ImageProps } from "next/image";
import { FC, useState } from "react";

interface SaveListItemImageProps extends Omit<ImageProps, "src"> {
  src?: string;
}

export const SaveListItemImage: FC<SaveListItemImageProps> = ({
  src,
  alt,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src)
    return (
      <EmptyState
        title="Нет картинки :("
        description="Превью сейва ещё не было загружено, либо его просто нет"
        icon={<IconImage />}
      />
    );

  return (
    <Image src={src} alt={alt} {...props} onError={() => setFailedSrc(src)} />
  );
};
