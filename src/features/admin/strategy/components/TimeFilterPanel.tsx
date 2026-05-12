import { memo } from "react";

import { Clock3 } from "lucide-react";

import {   Panel, SR, CS, Tog } from "./strategy/ui";
import {
  IS,
} from "./strategy/constants";
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type TimeState = {
  use_time: boolean;

  t_start: string;
  t_end: string;

  timezone: string;

  days: string[];
};

type Props = {
  strategy: TimeState;

  onChange: (key: keyof TimeState, value: string | boolean | string[]) => void;
};

function TimeFilterPanel({ strategy, onChange }: Props) {
  return (
    <Panel
      title="TIME FILTER"
      accent="#f59e0b"
      icon={
        <Clock3
          size={13}
          style={{
            color: "#f59e0b",
          }}
        />
      }
    >
      {/* ENABLE */}

      <SR label="Enable">
        <Tog v={strategy.use_time} onChange={(v) => onChange("use_time", v)} />
      </SR>

      {/* START */}

      <SR label="Start">
        <input
          type="time"
          value={strategy.t_start}
          onChange={(e) => onChange("t_start", e.target.value)}
          style={{
            ...IS,
            width: "100%",
            opacity: strategy.use_time ? 1 : 0.35,
          }}
          disabled={!strategy.use_time}
        />
      </SR>

      {/* END */}

      <SR label="End">
        <input
          type="time"
          value={strategy.t_end}
          onChange={(e) => onChange("t_end", e.target.value)}
          style={{
            ...IS,
            width: "100%",
            opacity: strategy.use_time ? 1 : 0.35,
          }}
          disabled={!strategy.use_time}
        />
      </SR>

      {/* TIMEZONE */}

      <SR label="Timezone">
        <CS
          label=""
          v={strategy.timezone}
          onChange={(v) => onChange("timezone", v)}
          opts={["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"]}
          w="100%"
          nolabel
        />
      </SR>

      {/* DAYS */}

      <SR label="Days">
        <div className="flex flex-wrap gap-1 mt-0.5">
          {WEEKDAYS.map((d) => {
            const active = strategy.days.includes(d);

            return (
              <button
                key={d}
                onClick={() =>
                  onChange(
                    "days",

                    active
                      ? strategy.days.filter((x) => x !== d)
                      : [...strategy.days, d],
                  )
                }
                className="px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all"
                style={{
                  background: active ? "#0ea5e9" : "var(--muted)",

                  color: active ? "#fff" : "var(--muted-foreground)",

                  borderColor: active ? "#0ea5e9" : "var(--border)",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </SR>
    </Panel>
  );
}

export default memo(TimeFilterPanel);
