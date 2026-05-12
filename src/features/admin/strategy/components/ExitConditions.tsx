import { memo } from "react";

import CondBlock from "./strategy/CondBlock";

import type { Group, ActiveInd, Side, OField, OpType } from "./strategy/types";

type Props = {
  groups: Group[];

  extras: OField[];

  activeInds: ActiveInd[];

  availOhlcv: (g: Group, rid: string, extras: OField[]) => OField[];

  onAddGrp: () => void;

  onRemGrp: (gid: string) => void;

  onAddRow: (gid: string) => void;

  onRemRow: (gid: string, rid: string) => void;

  onUpdSide: (gid: string, rid: string, patch: Partial<Side>) => void;

  onUpdOp: (gid: string, rid: string, op: string) => void;

  onUpdOpType: (gid: string, rid: string, ot: OpType) => void;

  onUpdValue: (gid: string, rid: string, value: string) => void;

  onUpdRange: (
    gid: string,
    rid: string,
    which: "rangeLow" | "rangeHigh",
    value: string,
  ) => void;

  onUpdJoiner: (gid: string, rid: string, value: "AND" | "OR") => void;
};

function ExitConditions({
  groups,
  extras,
  activeInds,
  availOhlcv,

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
}: Props) {
  return (
    <CondBlock
      title="EXIT CONDITIONS"
      subtitle="Define conditions for exiting a position"
      titleColor="#f59e0b"
      groups={groups}
      kind="exit"
      activeInds={activeInds}
      extras={extras}
      onAddGrp={onAddGrp}
      onRemGrp={onRemGrp}
      onAddRow={onAddRow}
      onRemRow={onRemRow}
      onUpdSide={onUpdSide}
      onUpdOp={onUpdOp}
      onUpdOpType={onUpdOpType}
      onUpdValue={onUpdValue}
      onUpdRange={onUpdRange}
      onUpdJoiner={onUpdJoiner}
      availOhlcv={availOhlcv}
    />
  );
}

export default memo(ExitConditions);
