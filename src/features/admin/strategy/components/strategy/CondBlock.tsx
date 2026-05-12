import { Plus, Trash2, X, GripVertical } from "lucide-react";

import SideSel from "./SideSel";

import { IS, COMPARE_OPS } from "./constants";

import { SBtn, LgSel } from "./ui";

import type { Group, OpType, Side, OField, ActiveInd } from "./types";
interface ConditionRow {
  id: string;

  joiner?: "AND" | "OR";

  left: Side;

  opType: OpType;

  op?: string;

  value?: string;

  rangeLow?: string;

  rangeHigh?: string;
}

interface CondBlockProps {
    kind: "entry" | "exit";

  title: string;
  subtitle: string;
  titleColor: string;

  groups: Group[];

  activeInds: ActiveInd[];

  extras: OField[];
  onAddGrp: () => void;

  onRemGrp: (groupId: string) => void;

  onAddRow: (groupId: string) => void;

  onRemRow: (groupId: string, rowId: string) => void;

  onUpdSide: (groupId: string, rowId: string, payload: Partial<Side>) => void;
  onUpdOp: (groupId: string, rowId: string, op: string) => void;

  onUpdOpType: (groupId: string, rowId: string, opType: OpType) => void;

  onUpdValue: (groupId: string, rowId: string, value: string) => void;

  onUpdRange: (
    groupId: string,
    rowId: string,
    field: "rangeLow" | "rangeHigh",
    value: string,
  ) => void;

  onUpdJoiner: (groupId: string, rowId: string, joiner: "AND" | "OR") => void;
  availOhlcv: (grp: Group, rowId: string, extras: OField[]) => OField[];
}

export default function CondBlock({
  title,
  subtitle,
  titleColor,
  groups,
  activeInds,
  extras,
  onAddGrp,
  onRemGrp,
  onAddRow,
  onRemRow,
  onUpdSide,
  onUpdOp,
  onUpdOpType,
  onUpdValue,
  onUpdRange,
  onUpdJoiner,
  availOhlcv,
}: CondBlockProps) {
  return (
    <section
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <div>
          <h2
            className="text-[13px] font-black tracking-[0.18em]"
            style={{
              color: titleColor,
            }}
          >
            {title}
          </h2>

          <p
            className="text-[11px] mt-1"
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SBtn
            icon={<Plus size={11} />}
            label="Add Group"
            onClick={onAddGrp}
          />

          <SBtn
            icon={<Plus size={11} />}
            label="Add Condition"
            onClick={() => {
              if (groups.length === 0) return;

              onAddRow(groups[groups.length - 1].id);
            }}
          />
        </div>
      </div>

      {/* GROUPS */}
      <div className="p-4 space-y-4">
        {groups.map((grp: Group, gi: number) => {
          const rows = grp.rows || [];

          return (
            <div key={grp.id}>
              {/* GROUP OR */}
              {gi > 0 && (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: "var(--border)",
                    }}
                  />

                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-black border"
                    style={{
                      background: "#0ea5e910",

                      borderColor: "#0ea5e940",

                      color: "#0ea5e9",
                    }}
                  >
                    OR GROUP
                  </span>

                  <div
                    className="flex-1 h-px"
                    style={{
                      background: "var(--border)",
                    }}
                  />
                </div>
              )}

              {/* GROUP BOX */}
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  borderColor: "var(--border)",

                  background: "var(--background)",
                }}
              >
                {/* GROUP HEADER */}
                <div
                  className="flex items-center px-4 py-3 border-b"
                  style={{
                    borderColor: "var(--border)",

                    background: "var(--muted)",
                  }}
                >
                  <span
                    className="text-[10px] font-black tracking-wide"
                    style={{
                      color: "var(--muted-foreground)",
                    }}
                  >
                    GROUP {gi + 1}
                  </span>

                  <button
                    onClick={() => onRemGrp(grp.id)}
                    className="ml-auto p-1 rounded hover:opacity-60 transition-all"
                    style={{
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* ROWS */}
                <div className="p-3 space-y-3">
                  {rows.map((row: ConditionRow, rowIndex: number) => {
                    const avL = availOhlcv(grp, row.id, extras);

                    return (
                      <div key={row.id}>
                        {/* JOINER */}
                        {rowIndex > 0 && (
                          <div className="flex justify-center py-1">
                            <LgSel
                              v={row.joiner || "AND"}
                              onChange={(v) => onUpdJoiner(grp.id, row.id, v)}
                            />
                          </div>
                        )}

                        {/* CONDITION ROW */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* DRAG */}
                          <GripVertical
                            size={14}
                            style={{
                              color: "var(--muted-foreground)",

                              flexShrink: 0,
                            }}
                          />

                          {/* LEFT */}
                          <SideSel
                            side={row.left}
                            avOhlcv={avL}
                            activeInds={activeInds}
                            onChange={(p) => onUpdSide(grp.id, row.id, p)}
                          />

                          {/* OP TYPE */}
                          <div
                            className="flex rounded-lg overflow-hidden border"
                            style={{
                              borderColor: "var(--border)",
                            }}
                          >
                            {(["compare", "range"] as OpType[]).map((ot) => (
                              <button
                                key={ot}
                                onClick={() => onUpdOpType(grp.id, row.id, ot)}
                                className="px-3 py-1 text-[10px] font-bold capitalize transition-all"
                                style={{
                                  background:
                                    row.opType === ot
                                      ? "#7c3aed"
                                      : "transparent",

                                  color:
                                    row.opType === ot
                                      ? "#fff"
                                      : "var(--muted-foreground)",
                                }}
                              >
                                {ot}
                              </button>
                            ))}
                          </div>

                          {/* COMPARE */}
                          {row.opType === "compare" && (
                            <>
                              <select
                                value={row.op}
                                onChange={(e) =>
                                  onUpdOp(grp.id, row.id, e.target.value)
                                }
                                style={{
                                  ...IS,
                                  width: 110,
                                }}
                              >
                                {COMPARE_OPS.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>

                              <input
                                value={row.value}
                                onChange={(e) =>
                                  onUpdValue(grp.id, row.id, e.target.value)
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
                          {row.opType === "range" && (
                            <div className="flex items-center gap-1">
                              <span
                                className="px-2 py-1 rounded text-[10px] font-bold"
                                style={{
                                  background: "#7c3aed18",

                                  color: "#a78bfa",

                                  border: "1px solid #7c3aed40",
                                }}
                              >
                                between
                              </span>

                              <input
                                value={row.rangeLow}
                                onChange={(e) =>
                                  onUpdRange(
                                    grp.id,
                                    row.id,
                                    "rangeLow",
                                    e.target.value,
                                  )
                                }
                                placeholder="Low"
                                style={{
                                  ...IS,
                                  width: 72,
                                }}
                              />

                              <span
                                className="text-[10px]"
                                style={{
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                and
                              </span>

                              <input
                                value={row.rangeHigh}
                                onChange={(e) =>
                                  onUpdRange(
                                    grp.id,
                                    row.id,
                                    "rangeHigh",
                                    e.target.value,
                                  )
                                }
                                placeholder="High"
                                style={{
                                  ...IS,
                                  width: 72,
                                }}
                              />
                            </div>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() => onRemRow(grp.id, row.id)}
                            className="p-2 rounded-lg border hover:opacity-80 transition-all"
                            style={{
                              background: "#ef444410",

                              borderColor: "#ef444430",

                              color: "#ef4444",
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* ADD CONDITION */}
                  <button
                    onClick={() => onAddRow(grp.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border border-dashed hover:opacity-80 transition-all"
                    style={{
                      borderColor: "#0ea5e940",

                      color: "#0ea5e9",

                      background: "#0ea5e908",
                    }}
                  >
                    <Plus size={11} />
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ADD GROUP */}
        <button
          onClick={onAddGrp}
          className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border border-dashed hover:opacity-80 transition-all"
          style={{
            borderColor: "var(--border)",

            color: "var(--muted-foreground)",
          }}
        >
          <Plus size={11} />
          Add Group
        </button>
      </div>
    </section>
  );
}
