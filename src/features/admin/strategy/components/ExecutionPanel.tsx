import { memo } from "react";

import { Settings2 } from "lucide-react";

import { Panel, SR, CS, Tog } from "./strategy/ui";

import { IS } from "./strategy/constants";

type ExecutionState = {
  order_type: string;
  slippage: string;
  tif: string;
  max_pos: string;
  cooldown: string;
  reentry: boolean;
};

type Props = {
  strategy: ExecutionState;

  onChange: (key: keyof ExecutionState, value: string | boolean) => void;
};

const ORDER_TYPES = ["MARKET", "LIMIT", "SL", "SL-M"];

function ExecutionPanel({ strategy, onChange }: Props) {
  return (
    <Panel
      title="EXECUTION SETTINGS"
      accent="#22d3ee"
      icon={
        <Settings2
          size={13}
          style={{
            color: "#22d3ee",
          }}
        />
      }
    >
      <SR label="Order Type">
        <CS
          label=""
          v={strategy.order_type}
          onChange={(v) => onChange("order_type", v)}
          opts={ORDER_TYPES}
          w="100%"
          nolabel
        />
      </SR>

      <SR label="Slippage">
        <input
          value={strategy.slippage}
          onChange={(e) => onChange("slippage", e.target.value)}
          style={{
            ...IS,
            width: "100%",
          }}
        />
      </SR>

      <SR label="Time in Force">
        <CS
          label=""
          v={strategy.tif}
          onChange={(v) => onChange("tif", v)}
          opts={["DAY", "IOC", "GTC"]}
          w="100%"
          nolabel
        />
      </SR>

      <SR label="Max Position">
        <input
          value={strategy.max_pos}
          onChange={(e) => onChange("max_pos", e.target.value)}
          style={{
            ...IS,
            width: "100%",
          }}
        />
      </SR>

      <SR label="Cooldown (min)">
        <input
          value={strategy.cooldown}
          onChange={(e) => onChange("cooldown", e.target.value)}
          style={{
            ...IS,
            width: "100%",
          }}
        />
      </SR>

      <SR label="Allow Re-entry">
        <Tog v={strategy.reentry} onChange={(v) => onChange("reentry", v)} />
      </SR>
    </Panel>
  );
}

export default memo(ExecutionPanel);
