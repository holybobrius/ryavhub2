const TimelineLoading = () => {
  return (
    <div>
      <section
        className="py-38.25 px-15 h-[calc(100vh-4rem)] flex flex-col justify-end animate-pulse"
        style={{
          backgroundImage: "url(/timeline-hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-25">
          <div className="h-20 max-w-175 bg-gray-800/50 rounded" />
          <div className="flex flex-col gap-14">
            <div className="h-16 max-w-220 bg-gray-800/50 rounded" />
            <div className="h-12 w-fit bg-gray-800/50 rounded" />
          </div>
        </div>
      </section>
      <div className="p-15 space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-gray-800/50 rounded" />
            <div className="h-4 w-full bg-gray-800/50 rounded" />
            <div className="h-4 w-3/4 bg-gray-800/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineLoading;
