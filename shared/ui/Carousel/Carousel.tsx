"use client";

import { Tooltip } from "@ariakit/react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { IconChevronLeft, IconChevronRight, IconEdit02 } from "../icons";

type CarouselItem = {
  src: string;
  description?: string;
};

interface CarouselProps {
  items: CarouselItem[];
}

export const Carousel = ({ items }: CarouselProps) => {
  const [viewportRef, api] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const current = items[index];
  const total = items.length;

  return (
    <div className="relative">
      <div ref={viewportRef} className="overflow-hidden">
        <div className="flex">
          {items.map((item) => (
            <div
              key={item.src}
              className="relative aspect-1800/977 min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                src={item.src}
                alt={item.description || ""}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => api?.scrollPrev()}
        leftIcon={<IconChevronLeft />}
        variant="ghost"
        tone="secondary"
        className="absolute left-space-xl top-1/2 -translate-y-1/2"
      ></Button>
      <Button
        onClick={() => api?.scrollNext()}
        leftIcon={<IconChevronRight />}
        variant="ghost"
        tone="secondary"
        className="absolute right-space-xl top-1/2 -translate-y-1/2"
      ></Button>

      <span className="absolute bottom-space-xl right-space-xl text-body-sm text-secondary">
        {pad(index + 1)} / {pad(total)}
      </span>

      <div
        className="absolute bottom-0 left-0 h-2 transition-[width]"
        style={{ width: `${((index + 1) / total) * 100}%` }}
      />

      {current.description && (
        <Tooltip content={current.description}>
          <Button leftIcon={<IconEdit02 />} />
        </Tooltip>
      )}
    </div>
  );
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
