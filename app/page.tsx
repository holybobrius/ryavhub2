import { Typography } from "@/shared/ui/Typography";

export default function Home() {
  return (
    <section
      className="py-38.25 px-15 h-[calc(100vh-4rem)] flex flex-col justify-end"
      style={{
        backgroundImage: "url(/home-hero.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <Typography.Display className="max-w-300" level={1}>
          Пространство нашего игрового комьюнити.
        </Typography.Display>
        <div className="flex flex-col gap-14">
          <Typography.Text size={24} className="max-w-150">
            Сейвы, события и цитаты – всё, что создаёт и сохраняет жизнь
            комьюнити в одном месте.
          </Typography.Text>
        </div>
      </div>
    </section>
  );
}
