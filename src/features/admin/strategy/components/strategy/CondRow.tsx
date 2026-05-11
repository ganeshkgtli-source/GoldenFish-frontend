import React from "react";

import {
  GripVertical,
  Trash2,
} from "lucide-react";

import SideSel from "./SideSel";

import {
  IS,
  COMPARE_OPS,
} from "./constants";

import type {
  Row,
  Side,
  OField,
  ActiveInd,
  OpType,
} from "./types";

type CondRowProps = {
  row: Row;

  allOhlcv: OField[];

  activeInds: ActiveInd[];

  onUpdLeft: (
    p: Partial<Side>
  ) => void;

  onUpdRight: (
    p: Partial<Side>
  ) => void;

  onUpdOp: (
    op: string
  ) => void;

  onUpdOpType: (
    ot: OpType
  ) => void;

  onUpdRange: (
    w:
      | "rangeLow"
      | "rangeHigh",
    v: string
  ) => void;

  onUpdValue?: (
    v: string
  ) => void;

  onRemRow: () => void;
};

export default function CondRow({
  row,
  allOhlcv,
  activeInds,

  onUpdLeft,
  onUpdRight,

  onUpdOp,
  onUpdOpType,
  onUpdRange,
  onUpdValue,

  onRemRow,
}: CondRowProps) {

  return (
    <div className="flex items-start gap-1.5 flex-wrap">

      {/* DRAG */}
      <GripVertical
        size={13}
        className="mt-2.5"
        style={{
          color:
            "var(--muted-foreground)",

          cursor: "grab",

          flexShrink: 0,
        }}
      />

      {/* LEFT */}
      <SideSel
        side={row.left}
        avOhlcv={allOhlcv}
        activeInds={activeInds}
        onChange={onUpdLeft}
      />

      {/* OP AREA */}
      <div className="flex items-center gap-1 flex-wrap">

        {/* OP TYPE */}
        <div
          className="flex rounded overflow-hidden border"
          style={{
            borderColor:
              "var(--border)",
          }}
        >

          {(
            [
              "compare",
              "range",
            ] as OpType[]
          ).map((ot) => (
            <button
              key={ot}
              onClick={() =>
                onUpdOpType(ot)
              }
              className="px-2 py-1 text-[9px] font-bold capitalize transition-all"
              style={{
                background:
                  row.opType ===
                  ot
                    ? "#7c3aed"
                    : "var(--muted)",

                color:
                  row.opType ===
                  ot
                    ? "#fff"
                    : "var(--muted-foreground)",
              }}
            >
              {ot}
            </button>
          ))}
        </div>

        {/* COMPARE */}
        {row.opType ===
          "compare" && (
          <>
            <select
              value={row.op}
              onChange={(e) =>
                onUpdOp(
                  e.target.value
                )
              }
              style={{
                ...IS,
                width: 120,
              }}
            >

              {COMPARE_OPS.map(
                (o) => (
                  <option
                    key={o}
                    value={o}
                  >
                    {o}
                  </option>
                )
              )}

            </select>

            <input
              value={row.value}
              onChange={(e) =>
                onUpdValue?.(
                  e.target.value
                )
              }
              placeholder="Value"
              style={{
                ...IS,
                width: 90,
              }}
            />
          </>
        )}

        {/* RANGE */}
        {row.opType ===
          "range" && (
          <div className="flex items-center gap-1">

            <input
              value={
                row.rangeLow
              }
              onChange={(e) =>
                onUpdRange(
                  "rangeLow",
                  e.target.value
                )
              }
              placeholder="Low"
              style={{
                ...IS,
                width: 70,
              }}
            />

            <span
              style={{
                color:
                  "var(--muted-foreground)",

                fontSize: 11,
              }}
            >
              to
            </span>

            <input
              value={
                row.rangeHigh
              }
              onChange={(e) =>
                onUpdRange(
                  "rangeHigh",
                  e.target.value
                )
              }
              placeholder="High"
              style={{
                ...IS,
                width: 70,
              }}
            />
          </div>
        )}
      </div>

      {/* DELETE */}
      <button
        onClick={onRemRow}
        className="p-1.5 mt-0.5 rounded border flex-shrink-0"
        style={{
          background:
            "#ef444410",

          borderColor:
            "#ef444430",

          color:
            "#ef4444",
        }}
      >
        <Trash2 size={12} />
      </button>

    </div>
  );
}