import { memo } from "react";

import {
  ShieldCheck,
} from "lucide-react";

import {
  
  Panel,
  SR,
  CS,
  Tog,
} from "./strategy/ui";
import {
  IS,
} from "./strategy/constants";
type RiskState = {
  pos_size: string;
  pos_type: string;

  sl_type: string;
  sl_period: string;
  sl_mult: string;
  sl_val: string;

  tp_type: string;
  tp_val: string;

  max_loss: string;

  trailing: boolean;
};

type Props = {
  strategy: RiskState;

  onChange: (
    key: keyof RiskState,
    value: string | boolean
  ) => void;
};

function RiskManagementPanel({
  strategy,
  onChange,
}: Props) {

  return (
    <Panel
      title="RISK MANAGEMENT"
      accent="#34d399"
      icon={
        <ShieldCheck
          size={13}
          style={{
            color: "#34d399",
          }}
        />
      }
    >

      {/* POSITION SIZE */}

      <SR label="Position Size">

        <div className="flex gap-1">

          <input
            value={strategy.pos_size}
            onChange={(e) =>
              onChange(
                "pos_size",
                e.target.value
              )
            }
            style={{
              ...IS,
              width: 60,
            }}
          />

          <span
            style={{
              ...IS,
              padding: "0 8px",
              fontSize: 10,
              color:
                "var(--muted-foreground)",
            }}
          >
            %
          </span>

          <CS
            label=""
            v={strategy.pos_type}
            onChange={(v) =>
              onChange(
                "pos_type",
                v
              )
            }
            opts={[
              "% of Equity",
              "Fixed Lot",
              "Fixed Amount",
            ]}
            w="120px"
            nolabel
          />
        </div>
      </SR>

      {/* STOP LOSS */}

      <SR label="Stop Loss">

        <div className="flex gap-1 items-center flex-wrap">

          <CS
            label=""
            v={strategy.sl_type}
            onChange={(v) =>
              onChange(
                "sl_type",
                v
              )
            }
            opts={[
              "ATR",
              "Fixed %",
              "Points",
            ]}
            w="80px"
            nolabel
          />

          {strategy.sl_type === "ATR" ? (
            <>
              <span
                style={{
                  ...IS,
                  padding: "0 8px",
                  fontSize: 11,
                  color:
                    "var(--muted-foreground)",
                }}
              >
                {strategy.sl_period}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color:
                    "var(--muted-foreground)",
                }}
              >
                ×
              </span>

              <input
                value={strategy.sl_mult}
                onChange={(e) =>
                  onChange(
                    "sl_mult",
                    e.target.value
                  )
                }
                style={{
                  ...IS,
                  width: 40,
                }}
              />
            </>
          ) : (
            <input
              value={strategy.sl_val}
              onChange={(e) =>
                onChange(
                  "sl_val",
                  e.target.value
                )
              }
              style={{
                ...IS,
                flex: 1,
              }}
              placeholder="1.5"
            />
          )}
        </div>
      </SR>

      {/* TAKE PROFIT */}

      <SR label="Take Profit">

        <div className="flex gap-1">

          <CS
            label=""
            v={strategy.tp_type}
            onChange={(v) =>
              onChange(
                "tp_type",
                v
              )
            }
            opts={[
              "RR Ratio",
              "Fixed %",
              "Points",
            ]}
            w="100px"
            nolabel
          />

          <input
            value={strategy.tp_val}
            onChange={(e) =>
              onChange(
                "tp_val",
                e.target.value
              )
            }
            style={{
              ...IS,
              width: 60,
            }}
          />
        </div>
      </SR>

      {/* MAX LOSS */}

      <SR label="Max Daily Loss">

        <div className="flex gap-1 items-center">

          <input
            value={strategy.max_loss}
            onChange={(e) =>
              onChange(
                "max_loss",
                e.target.value
              )
            }
            style={{
              ...IS,
              flex: 1,
            }}
          />

          <span
            style={{
              fontSize: 10,
              color:
                "var(--muted-foreground)",
            }}
          >
            %
          </span>
        </div>
      </SR>

      {/* TRAILING */}

      <SR label="Trailing Stop">

        <Tog
          v={strategy.trailing}
          onChange={(v) =>
            onChange(
              "trailing",
              v
            )
          }
        />
      </SR>
    </Panel>
  );
}

export default memo(
  RiskManagementPanel
);