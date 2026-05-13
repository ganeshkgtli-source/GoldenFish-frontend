export default function SectorPerformance() {
  const sectors = [
    { name: "Nifty IT", value: 1.45 },
    { name: "Nifty Bank", value: 1.24 },
    { name: "Nifty Auto", value: 0.72 },
    { name: "Nifty Pharma", value: -0.18 },
    { name: "Nifty FMCG", value: -0.45 },
  ];

  return (
    <div className="bg-card   p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-foreground font-medium">
          Sector Performance
        </h3>

        {/* future dropdown */}
        {/* <select className="bg-secondary text-foreground text-xs px-3 py-1 rounded-md border border-border">
          <option>NSE</option>
          <option>BSE</option>
        </select> */}
      </div>

      {/* LIST */}
      <div className="space-y-4 text-sm">
        {sectors.map((sector, i) => {
          const isPositive = sector.value >= 0;

          return (
            <div key={i}>

              {/* TOP */}
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">
                  {sector.name}
                </span>

                <span
                  className={
                    isPositive
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {isPositive ? "+" : ""}
                  {sector.value}%
                </span>
              </div>

              {/* BAR */}
              <div className="h-[6px] bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(sector.value) * 40, 100)}%`,
                  }}
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      {/* <div className="mt-4 text-xs text-muted-foreground text-right hover:text-foreground cursor-pointer">
        View all sectors →
      </div> */}
    </div>
  );
}