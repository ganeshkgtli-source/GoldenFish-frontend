import React from "react";

import {
  IS,
} from "./constants";

import type {
  Side,
  OField,
  ActiveInd,
} from "./types";

export default function SideSel({
  side,
  avOhlcv,
  activeInds,
  onChange,
}: {
  side: Side;

  avOhlcv: OField[];

  activeInds: ActiveInd[];

  onChange: (
    p: Partial<Side>
  ) => void;
}) {

  const currentFields =
    avOhlcv.filter(
      (f) =>
        f.group === "current"
    );

  const prevFields =
    avOhlcv.filter(
      (f) =>
        f.group === "prev"
    );

  return (
    <div className="flex items-center gap-1 flex-wrap">

      <select
        value={side.type}
        onChange={(e) => {

          const type =
            e.target.value as
              | "ohlc"
              | "indicator";

          if (type === "ohlc") {
            onChange({
              type: "ohlc",

              field: "CLOSE",
            });
          }

          if (
            type === "indicator"
          ) {

            const firstInd =
              activeInds[0];

            if (!firstInd)
              return;

            onChange({
              type: "indicator",

              indicator:
                firstInd.name,

              field: "CLOSE",

              params:
                firstInd.editParams,
            });
          }
        }}
        style={{
          ...IS,
          width: 100,
        }}
      >
        <option value="ohlc">
          OHLC
        </option>

        <option value="indicator">
          Indicator
        </option>
      </select>

      {side.type ===
        "ohlc" && (
        <select
          value={side.field}
          onChange={(e) =>
            onChange({
              field:
                e.target.value,
            })
          }
          style={{
            ...IS,
            width: 120,
          }}
        >
          <optgroup label="Current Candle">
            {currentFields.map(
              (f) => (
                <option
                  key={f.name}
                  value={f.name}
                >
                  {f.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Previous Candle">
            {prevFields.map(
              (f) => (
                <option
                  key={f.name}
                  value={f.name}
                >
                  {f.label}
                </option>
              )
            )}
          </optgroup>
        </select>
      )}

      {side.type ===
        "indicator" && (
        <div className="flex items-center gap-1 flex-wrap">

          <select
            value={
              side.indicator || ""
            }
            onChange={(e) => {

              const indName =
                e.target.value;

              const ind =
                activeInds.find(
                  (i) =>
                    i.name ===
                    indName
                );

              onChange({
                indicator:
                  indName,

                params: ind
                  ? ind.editParams
                  : {},
              });
            }}
            style={{
              ...IS,
              width: 90,
            }}
          >
            {activeInds.map(
              (ind) => (
                <option
                  key={ind.uid}
                  value={ind.name}
                >
                  {ind.name}
                </option>
              )
            )}
          </select>

          {side.params && (
            <div className="flex items-center gap-1">

              {Object.entries(
                side.params
              ).map(
                ([k, v]) => (
                  <input
                    key={k}
                    value={v}
                    onChange={(
                      e
                    ) =>
                      onChange({
                        params: {
                          ...side.params,

                          [k]:
                            e.target
                              .value,
                        },
                      })
                    }
                    style={{
                      ...IS,

                      width: 44,

                      height: 28,

                      padding:
                        "0 4px",
                    }}
                  />
                )
              )}
            </div>
          )}

          <select
            value={side.field}
            onChange={(e) =>
              onChange({
                field:
                  e.target.value,
              })
            }
            style={{
              ...IS,
              width: 120,
            }}
          >
            {avOhlcv.map(
              (f) => (
                <option
                  key={f.name}
                  value={f.name}
                >
                  {f.label}
                </option>
              )
            )}
          </select>
        </div>
      )}
    </div>
  );
}