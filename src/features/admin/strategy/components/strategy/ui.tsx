import React from "react";

import {
  ChevronRight,
} from "lucide-react";

import {
  IS,
} from "./constants";

/* ───────────────────────────────────────────── */
/* SMALL BUTTON */
/* ───────────────────────────────────────────── */

export function SBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;

  label: string;

  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border hover:opacity-80 transition-all"
      style={{
        borderColor: "var(--border)",
        color: "var(--foreground)",
        background: "var(--muted)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ───────────────────────────────────────────── */
/* LOGIC SELECT */
/* ───────────────────────────────────────────── */

export function LgSel({
  v,
  onChange,
}: {
  v: "AND" | "OR";

  onChange: (
    l: "AND" | "OR"
  ) => void;
}) {
  return (
    <div
      className="flex rounded overflow-hidden border"
      style={{
        borderColor: "var(--border)",
      }}
    >
      {(["AND", "OR"] as const).map(
        (l) => (
          <button
            key={l}
            onClick={() =>
              onChange(l)
            }
            className="px-2 py-0.5 text-[10px] font-bold transition-all"
            style={{
              background:
                v === l
                  ? "#0ea5e9"
                  : "var(--muted)",

              color:
                v === l
                  ? "#fff"
                  : "var(--muted-foreground)",
            }}
          >
            {l}
          </button>
        )
      )}
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* PANEL */
/* ───────────────────────────────────────────── */

export function Panel({
  title,
  accent,
  icon,
  children,
}: {
  title: string;

  accent: string;

  icon?: React.ReactNode;

  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {icon}

        <span
          className="text-[11px] font-bold tracking-widest"
          style={{
            color: accent,
          }}
        >
          {title}
        </span>
      </div>

      <div className="p-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* SETTING ROW */
/* ───────────────────────────────────────────── */

export function SR({
  label,
  children,
}: {
  label: string;

  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div
        className="text-[10px] font-semibold"
        style={{
          color: "var(--muted-foreground)",
        }}
      >
        {label}
      </div>

      {children}
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* FIELD */
/* ───────────────────────────────────────────── */

export function CF({
  label,
  v,
  onChange,
  placeholder,
  w = "100%",
}: {
  label: string;

  v: string;

  onChange: (
    v: string
  ) => void;

  placeholder?: string;

  w?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        width: w,
      }}
    >
      <span
        className="text-[10px] font-semibold"
        style={{
          color: "var(--muted-foreground)",
        }}
      >
        {label}
      </span>

      <input
        value={v}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={IS}
      />
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* SELECT */
/* ───────────────────────────────────────────── */

export function CS({
  label,
  v,
  onChange,
  opts,
  w = "100%",
  nolabel = false,
}: {
  label: string;

  v: string;

  onChange: (
    v: string
  ) => void;

  opts: string[];

  w?: string;

  nolabel?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        width: w,
      }}
    >
      {!nolabel && (
        <span
          className="text-[10px] font-semibold"
          style={{
            color:
              "var(--muted-foreground)",
          }}
        >
          {label}
        </span>
      )}

      <select
        value={v}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={IS}
      >
        {opts.map((o) => (
          <option
            key={o}
            value={o}
          >
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* TOGGLE */
/* ───────────────────────────────────────────── */

export function Tog({
  v,
  onChange,
}: {
  v: boolean;

  onChange: (
    v: boolean
  ) => void;
}) {
  return (
    <button
      onClick={() =>
        onChange(!v)
      }
      className="w-10 h-5 rounded-full relative transition-all"
      style={{
        background: v
          ? "#0ea5e9"
          : "var(--muted)",
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{
          left: v
            ? "20px"
            : "2px",
        }}
      />
    </button>
  );
}

/* ───────────────────────────────────────────── */
/* MODE SWITCH */
/* ───────────────────────────────────────────── */

export function ModeSwitch({
  v,
  onChange,
}: {
  v: string;

  onChange: (
    v: string
  ) => void;
}) {
  const opts = [
    "Long & Short",
    "Long Only",
    "Short Only",
  ];

  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[10px] font-semibold"
        style={{
          color: "var(--muted-foreground)",
        }}
      >
        Mode
      </span>

      <div
        className="flex rounded-lg overflow-hidden border"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {opts.map((o) => (
          <button
            key={o}
            onClick={() =>
              onChange(o)
            }
            className="px-3 py-1 text-[10px] font-bold"
            style={{
              background:
                v === o
                  ? "#0ea5e9"
                  : "transparent",

              color:
                v === o
                  ? "#fff"
                  : "var(--muted-foreground)",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* TOP BUTTON */
/* ───────────────────────────────────────────── */

export function TBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;

  label: string;
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:opacity-80"
      style={{
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ───────────────────────────────────────────── */
/* JSON HIGHLIGHT */
/* ───────────────────────────────────────────── */

export function JHL({
  json,
}: {
  json: string;
}) {
  return (
<pre
  className="overflow-auto text-[11px] leading-5 p-4 rounded-xl border"
  style={{
    background: "var(--card)",
    color: "var(--foreground)",
    borderColor: "var(--border)",
  }}
>
  <code
    dangerouslySetInnerHTML={{
      __html: json

        // keys
        .replace(
          /"([^"]+)":/g,
          '<span style="color:#38bdf8;">"$1"</span>:'
        )

        // string values
        .replace(
          /: "([^"]*)"/g,
          ': <span style="color:#22c55e;">"$1"</span>'
        )

        // numbers
        .replace(
          /: (\d+)/g,
          ': <span style="color:#f59e0b;">$1</span>'
        )

        // booleans
        .replace(
          /: (true|false)/g,
          ': <span style="color:#a78bfa;">$1</span>'
        ),
    }}
  />
</pre>
  );
}

/* ───────────────────────────────────────────── */
/* TABLE OF CONTENTS */
/* ───────────────────────────────────────────── */

export function TableOfContents({
  items,
}: {
  items: {
    id: string;
    label: string;
  }[];
}) {
  return (
    <div
      className="rounded-xl border p-3 space-y-2"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
      }}
    >
      <div
        className="text-[11px] font-bold"
        style={{
          color: "var(--muted-foreground)",
        }}
      >
        SECTIONS
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            document
              .getElementById(
                item.id
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              });
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] hover:opacity-80"
          style={{
            background:
              "var(--muted)",
          }}
        >
          <span>
            {item.label}
          </span>

          <ChevronRight size={12} />
        </button>
      ))}
    </div>
  );
}