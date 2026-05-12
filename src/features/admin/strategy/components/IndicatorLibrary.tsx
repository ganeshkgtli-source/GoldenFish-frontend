import { memo } from "react";

import { Activity, CheckCircle2, Plus, Search, X } from "lucide-react";

type Category = "trend" | "momentum" | "volume" | "volatility";

type Indicator = {
  name: string;
  label: string;
  color: string;
  category: Category;
};

type ActiveIndicator = {
  uid: string;
  name: string;
  color: string;
};

type Props = {
  libQ: string;

  setLibQ: (value: string) => void;

  libCat: string;

  setLibCat: (value: string) => void;

  activeInds: ActiveIndicator[];

  filteredLib: Indicator[];

  addInd: (name: string) => void;

  remInd: (uid: string) => void;

  catStyle: Record<Category, string>;
};

function IndicatorLibrary({
  libQ,
  setLibQ,

  libCat,
  setLibCat,

  activeInds,
  filteredLib,

  addInd,
  remInd,

  catStyle,
}: Props) {
  return (
    <div
      className="p-3 border-b"
      style={{
        borderColor: "var(--border)",
      }}
    >
      {/* HEADER */}

      <div className="flex items-center gap-2 mb-2">
        <Activity
          size={12}
          style={{
            color: "#22d3ee",
          }}
        />

        <span
          className="text-[10px] font-bold tracking-widest"
          style={{
            color: "var(--muted-foreground)",
          }}
        >
          INDICATORS
        </span>
      </div>

      {/* SEARCH */}

      <div className="relative mb-2">
        <Search
          size={11}
          className="absolute left-2.5 top-1/2 -translate-y-1/2"
          style={{
            color: "var(--muted-foreground)",
          }}
        />

        <input
          value={libQ}
          onChange={(e) => setLibQ(e.target.value)}
          placeholder="Search indicators…"
          className="w-full pl-7 pr-3 py-1.5 rounded-lg text-[11px] outline-none"
          style={{
            background: "var(--muted)",

            border: "1px solid var(--border)",

            color: "var(--foreground)",
          }}
        />
      </div>

      {/* CATEGORY */}

      <div className="flex flex-wrap gap-1 mb-2">
        {["all", "trend", "momentum", "volume", "volatility"].map((c) => (
          <button
            key={c}
            onClick={() => setLibCat(c)}
            className="px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize transition-all"
            style={{
              background: libCat === c ? "#0ea5e9" : "var(--muted)",

              color: libCat === c ? "#fff" : "var(--muted-foreground)",

              borderColor: libCat === c ? "#0ea5e9" : "var(--border)",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ACTIVE */}

      <div
        className="rounded-lg border p-1.5 min-h-[40px] mb-2"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {activeInds.length === 0 ? (
          <p
            className="text-center text-[10px] py-1"
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            Click + to add indicators
          </p>
        ) : (
          <div className="space-y-1">
            {activeInds.map((i) => (
              <div
                key={i.uid}
                className="flex items-center gap-2 px-2 py-1 rounded-lg border"
                style={{
                  background: i.color + "14",

                  borderColor: i.color + "30",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i.color,
                  }}
                />

                <span
                  className="text-[11px] font-bold flex-1"
                  style={{
                    color: i.color,
                  }}
                >
                  {i.name}
                </span>

                <button onClick={() => remInd(i.uid)}>
                  <X
                    size={10}
                    style={{
                      color: "var(--muted-foreground)",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIBRARY */}

      <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-hide">
        {filteredLib.map((ind) => {
          const added = !!activeInds.find((a) => a.name === ind.name);

          return (
            <div
              key={ind.name}
              onClick={() => !added && addInd(ind.name)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs transition-all select-none"
              style={{
                border: "1px solid var(--border)",

                opacity: added ? 0.4 : 1,

                cursor: added ? "default" : "pointer",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: ind.color,
                }}
              />

              <span
                className="font-bold w-10 text-[11px]"
                style={{
                  color: ind.color,
                }}
              >
                {ind.name}
              </span>

              <span
                className="flex-1 truncate text-[10px]"
                style={{
                  color: "var(--muted-foreground)",
                }}
              >
                {ind.label}
              </span>

              <span
                className={`text-[9px] px-1 py-0.5 rounded border ${catStyle[ind.category]}`}
              >
                {ind.category.slice(0, 3)}
              </span>

              {added ? (
                <CheckCircle2 size={11} className="text-green-500" />
              ) : (
                <Plus
                  size={11}
                  style={{
                    color: "var(--muted-foreground)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(IndicatorLibrary);
