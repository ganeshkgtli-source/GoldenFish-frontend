import React from "react";

import type { OField } from "./types";

export const IS: React.CSSProperties = {
  height: 32,

  borderRadius: 8,

  border: "1px solid var(--border)",

  background: "var(--background)",

  color: "var(--foreground)",

  padding: "0 10px",

  fontSize: 12,

  outline: "none",
};

export const COMPARE_OPS = [
  ">",
  "<",
  ">=",
  "<=",
  "==",
  "!=",
  "crosses above",
  "crosses below",
];

export const OHLCV_FIELDS: OField[] = [
  {
    name: "OPEN",
    label: "Open",
    group: "current",
  },

  {
    name: "HIGH",
    label: "High",
    group: "current",
  },

  {
    name: "LOW",
    label: "Low",
    group: "current",
  },

  {
    name: "CLOSE",
    label: "Close",
    group: "current",
  },

  {
    name: "PREV_OPEN",
    label: "Prev Open",
    group: "prev",
  },

  {
    name: "PREV_HIGH",
    label: "Prev High",
    group: "prev",
  },

  {
    name: "PREV_LOW",
    label: "Prev Low",
    group: "prev",
  },

  {
    name: "PREV_CLOSE",
    label: "Prev Close",
    group: "prev",
  },
];