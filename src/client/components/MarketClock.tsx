import { useEffect, useState } from "react";

/* ================= CONFIG ================= */

// NSE Holidays (example — extend or fetch from API)
const NSE_HOLIDAYS = [
  "2026-01-26",
  "2026-03-07",
  "2026-08-15",
  "2026-10-24",
];

// Force IST timezone
const getISTDate = () => {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
};

export default function MarketClock() {
  const [time, setTime] = useState(getISTDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getISTDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= DAY CHECK ================= */

  const now = time;
  const todayStr = now.toISOString().split("T")[0];

  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isHoliday = NSE_HOLIDAYS.includes(todayStr);

  const isClosedDay = isWeekend || isHoliday;

  /* ================= MARKET TIME ================= */

  const openTime = new Date(now);
  openTime.setHours(9, 15, 0, 0);

  const closeTime = new Date(now);
  closeTime.setHours(15, 30, 0, 0);

  const isBeforeOpen = !isClosedDay && now < openTime;
  const isAfterClose = isClosedDay || now >= closeTime;
  const isLive = !isClosedDay && now >= openTime && now < closeTime;

  /* ================= COUNTDOWN ================= */

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  let countdown = "";

  if (isBeforeOpen) {
    countdown = `Opens in ${formatTime(openTime.getTime() - now.getTime())}`;
  } else if (isLive) {
    countdown = `Closes in ${formatTime(closeTime.getTime() - now.getTime())}`;
  }

  /* ================= STATUS ================= */

  let status = "";

  if (isWeekend) {
    status = "Market closed (Weekend)";
  } else if (isHoliday) {
    status = "Market closed (Holiday)";
  } else if (isBeforeOpen) {
    status = "Pre-market";
  } else if (isAfterClose) {
    status = "Market closed";
  } else {
    status = "Market is live";
  }

  /* ================= COLORS ================= */

  const dotColor = isClosedDay
    ? "bg-red-500"
    : isBeforeOpen
    ? "bg-yellow-400"
    : isAfterClose
    ? "bg-red-500"
    : "bg-emerald-500";

  /* ================= PROGRESS ================= */

  const totalDuration = closeTime.getTime() - openTime.getTime();
  const elapsed = now.getTime() - openTime.getTime();

  const progress = isLive
    ? (elapsed / totalDuration) * 100
    : isAfterClose
    ? 100
    : 0;

  /* ================= UI ================= */

  return (
    <div className="w-full rounded-2xl shadow-sm p-4 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wider text-muted-foreground uppercase">
          Indian Market Time
        </span>

        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-emerald-500 font-medium">
          IST
        </span>
      </div>

      {/* TIME + STATUS */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold tracking-wide text-foreground">
          {time.toLocaleTimeString()}
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted border border-border">
          <span
            className={`w-2 h-2 rounded-full ${dotColor} ${
              isLive ? "animate-pulse" : ""
            }`}
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {status}
          </span>
        </div>
      </div>

      {/* COUNTDOWN */}
      {(isBeforeOpen || isLive) && (
        <div className="text-xs text-foreground font-medium">
          {countdown}
        </div>
      )}

      {/* TIMINGS */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Open 09:15</span>
        <span className="opacity-40">|</span>
        <span>Close 03:30</span>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="h-[3px] w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>09:15 AM</span>
          <span>03:30 PM</span>
        </div>
      </div>
    </div>
  );
}