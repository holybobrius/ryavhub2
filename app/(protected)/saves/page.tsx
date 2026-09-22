import { Typography } from "@/shared/ui/Typography";
import { getSaveList } from "@/features/saves/getSaveList";
import { SaveBrowser } from "./components/SaveBrowser";

export default async function SavesPage() {
  const saves = await getSaveList();

  return (
    <div>
      <div className="w-full flex gap-space-md items-end mt-space-xl mb-space-md">
        <Typography.Display size="lg" as="h1" className="w-full">
          Сейвы
        </Typography.Display>
        <Typography.Body
          size="lg"
          className="w-full text-surface-text-quaternary"
        >
          Сохранения в хронологическом порядке с датой, версией
          <br />и размером. Наведите на строку, чтобы увидеть детали
          <br />и скачать, или нажмите, чтобы открыть сейв.
        </Typography.Body>
      </div>
      <SaveBrowser saves={saves} />
    </div>
  );
}
