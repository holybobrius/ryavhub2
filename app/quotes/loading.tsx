import { Typography } from "@/shared/ui/Typography";

export default function Loading() {
  return (
    <div>
      <section
        className="py-38.25 px-15 h-[calc(100vh-4rem)]"
        style={{
          backgroundImage: "url(/quotes-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-19">
          <Typography.Display className="max-w-175" level={1}>
            КОЛЛЕКЦИЯ ЦИТАТ
          </Typography.Display>
          <Typography.Title level={2} className="max-w-220">
            Здесь собираются различные фразы и шутки друзей. Можно добавлять
            новые и редактировать существующие
          </Typography.Title>
        </div>
        <div className="flex justify-between items-end">
          <div className="h-12 w-48 bg-black-850 rounded-lg animate-pulse" />
          <Typography.Text size={24} className="max-w-145">
            В редизайне мы уделили этому разделу особое внимание и решили
            добавить небольшой интерактив: теперь, как и в Блядких мемах, можно
            оценивать цитаты!
          </Typography.Text>
        </div>
      </section>
      <section className="px-15 mb-38">
        <div className="flex flex-col gap-19">
          <Typography.Display level={3}>Все цитаты</Typography.Display>
          <div className="flex flex-col gap-5">
            {[...Array(6)].map((_, i) => (
              <div className="flex gap-5" key={i}>
                {[...Array(i % 2 === 0 ? 2 : 1)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-black-950 rounded-lg flex flex-col w-full h-64 animate-pulse"
                  >
                    <div className="px-8 py-13 h-full">
                      <div className="h-8 bg-black-850 rounded mb-4" />
                      <div className="h-8 bg-black-850 rounded w-3/4" />
                    </div>
                    <div className="h-0.25 w-full bg-black-850" />
                    <div className="px-8 py-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black-850 rounded-full" />
                        <div className="h-4 w-24 bg-black-850 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-12 bg-black-850 rounded" />
                        <div className="h-8 w-12 bg-black-850 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

