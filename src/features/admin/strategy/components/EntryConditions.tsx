import { memo } from "react";

import CondBlock from "./strategy/CondBlock";

import type { Group, ActiveInd, Side, OField, OpType } from "./strategy/types";

type Props = {
  groups: Group[];

  activeIndicators: ActiveInd[];

  availableOhlcv: (group: Group, rowId: string, extras: OField[]) => OField[];

  onAddGroup: () => void;

  onRemoveGroup: (gid: string) => void;

  onAddRow: (gid: string) => void;

  onRemoveRow: (gid: string, rid: string) => void;

  onUpdateSide: (gid: string, rid: string, patch: Partial<Side>) => void;

  onUpdateOperator: (gid: string, rid: string, op: string) => void;

  onUpdateOperatorType: (gid: string, rid: string, opType: OpType) => void;

  onUpdateValue: (gid: string, rid: string, value: string) => void;

  onUpdateRange: (
    gid: string,
    rid: string,
    which: "rangeLow" | "rangeHigh",
    value: string,
  ) => void;

  onUpdateJoiner: (gid: string, rid: string, joiner: "AND" | "OR") => void;
};

function EntryConditions({
  groups,
  activeIndicators,
  availableOhlcv,

  onAddGroup,
  onRemoveGroup,
  onAddRow,
  onRemoveRow,

  onUpdateSide,
  onUpdateOperator,
  onUpdateOperatorType,
  onUpdateValue,
  onUpdateRange,
  onUpdateJoiner,
}: Props) {
  return (
    <CondBlock
      title="ENTRY CONDITIONS"
      subtitle="Define conditions for entering a position"
      titleColor="#22d3ee"
      groups={groups}
      kind="entry"
      activeInds={activeIndicators}
      extras={[]}
      onAddGrp={onAddGroup}
      onRemGrp={onRemoveGroup}
      onAddRow={onAddRow}
      onRemRow={onRemoveRow}
      onUpdSide={onUpdateSide}
      onUpdOp={onUpdateOperator}
      onUpdOpType={onUpdateOperatorType}
      onUpdValue={onUpdateValue}
      onUpdRange={onUpdateRange}
      onUpdJoiner={onUpdateJoiner}
      availOhlcv={availableOhlcv}
    />
  );
}

export default memo(EntryConditions);
