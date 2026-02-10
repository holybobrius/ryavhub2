export const TimelineSkeleton = () => {
  return (
    <section className="px-15 mb-38 mt-38">
      <div className="flex flex-col gap-19 relative">
        <div className="absolute w-0.5 bg-black-500 pointer-events-none left-[20%] top-0 h-full" />
        {[1, 2, 3].map((group) => (
          <div key={group} className="flex">
            <div className="w-1/5 shrink-0 flex flex-col items-start relative">
              <div
                className="sticky"
                style={{ top: "50vh", transform: "translateY(-50%)" }}
              >
                <div className="h-16 w-32 bg-gray-800/50 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex-1" />

            <div className="shrink-0 w-3/5 flex flex-col gap-5">
              {[1, 2].map((item) => (
                <div key={item} className="flex flex-col gap-6 relative">
                  <div className="absolute w-3 h-3 rounded-full bg-black-500 animate-pulse left-[-1.4375rem] top-1/2 -translate-y-1/2" />
                  <div className="flex gap-5 animate-pulse">
                    <div className="flex flex-col gap-6 w-1/2 overflow-hidden">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-24 bg-gray-800/50 rounded-full" />
                          <div className="h-5 w-40 bg-gray-800/50 rounded" />
                        </div>
                        <div className="h-8 w-3/4 bg-gray-800/50 rounded" />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="h-8 w-20 bg-gray-800/50 rounded-full" />
                        <div className="h-8 w-24 bg-gray-800/50 rounded-full" />
                        <div className="h-8 w-28 bg-gray-800/50 rounded-full" />
                      </div>
                    </div>
                    <div className="w-1/2 space-y-3">
                      <div className="h-5 w-full bg-gray-800/50 rounded" />
                      <div className="h-5 w-11/12 bg-gray-800/50 rounded" />
                      <div className="h-5 w-full bg-gray-800/50 rounded" />
                      <div className="h-5 w-4/5 bg-gray-800/50 rounded" />
                    </div>
                  </div>
                  <div className="h-0.25 w-full bg-black-850 my-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
