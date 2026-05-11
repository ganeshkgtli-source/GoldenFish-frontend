export type OpType =
  | "compare"
  | "range";

export type OField = {
  name: string;
  label: string;
  color?: string;
  group?: "current" | "prev";
};

export type Side = {
  type: "ohlc" | "indicator";

  field: string;

  indicator?: string;

  params?: Record<string, string>;
};

export type Row = {
  id: string;

  name: string;

  left: Side;

  opType: OpType;

  op: string;

  value: string;

  rangeLow: string;

  rangeHigh: string;

  joiner?: "AND" | "OR";
};

export type Group = {
  id: string;

  rows: Row[];
};

export type ActiveInd = {
  uid: string;

  name: string;

  color: string;

  editParams: Record<string, string>;
};