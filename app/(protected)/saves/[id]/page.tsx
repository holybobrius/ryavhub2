import { getSaveById } from "@/features/saves/getSaveById";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { notFound } from "next/navigation";
import { Divider } from "@/shared/ui/Divider";
import { IconDownload, IconEdit02 } from "@/shared/ui/icons";
import { Carousel } from "@/shared/ui/Carousel/Carousel";

export default async function SavePage({ params }: PageProps<"/saves/[id]">) {
  const { id } = await params;
  const save = await getSaveById(id);

  if (!save) {
    return notFound();
  }

  return (
    <div>
      <section className="bg-surface-bg-surface -mx-page-margin px-page-margin flex flex-col justify-center text-center gap-space-md pb-[92px] mb-[92px]">
        <Typography.Display size="lg" as="h1" className="w-full my-space-xl">
          {save.name}
        </Typography.Display>
        <div
          className="aspect-3/1 relative rounded-xs w-full bg-cover bg-center bg-no-repeat p-inset-md flex justify-center items-end"
          style={{ backgroundImage: `url(${save.images[0]})` }}
          role="img"
          aria-label={save.name}
        >
          <div className="py-inset-sm px-inset-md bg-stat-card-bg flex gap-space-md w-[740px] rounded-sm">
            <div className="flex flex-col w-full">
              <Typography.Body size="sm" className="text-stat-card-label-color">
                Год
              </Typography.Body>
              <Typography.Heading size="sm">{save.year}</Typography.Heading>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col w-full">
              <Typography.Body size="sm" className="text-stat-card-label-color">
                Версия
              </Typography.Body>
              <Typography.Heading size="sm">{save.version}</Typography.Heading>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col w-full">
              <Typography.Body size="sm" className="text-stat-card-label-color">
                Размер
              </Typography.Body>
              <Typography.Heading size="sm">{save.size}</Typography.Heading>
            </div>
            <Divider orientation="vertical" />
            <div className="flex gap-space-md">
              <Button
                leftIcon={<IconDownload />}
                size="lg"
                tone="tertiary"
                variant="soft"
                disabled={!save?.downloadUrl}
              >
                Скачать
              </Button>
              <Button
                leftIcon={<IconEdit02 />}
                size="lg"
                tone="tertiary"
                variant="soft"
              ></Button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex justify-between mb-space-3xl">
          <Typography.Heading size="xl" as="h2">
            Скриншоты
          </Typography.Heading>
          <Button variant="outlined" tone="tertiary" leftIcon={<IconEdit02 />}>
            Редактировать
          </Button>
        </div>
        {save.images.length > 0 && (
          <Carousel items={save.images.map((image) => ({ src: image }))} />
        )}
      </section>
    </div>
  );
}
