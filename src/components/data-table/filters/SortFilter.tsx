import { ArrowUpDown } from "lucide-react";

import type { FilterOption } from "../types";

type SortFilterProps = {
  value: string;

  onChange: (value: string) => void;

  options: FilterOption[];
};

export default function SortFilter({
  value,
  onChange,
  options,
}: SortFilterProps) {
  return (
    <div className="relative">
      <ArrowUpDown
        size={15}
        className="
          pointer-events-none

          absolute left-3 top-1/2
          -translate-y-1/2

          text-muted-foreground
        "
      />

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-10 min-w-[180px]

          appearance-none

          rounded-xl
          border border-border
          bg-[var(--input-background)]

          pl-9 pr-8

          text-sm text-foreground

          outline-none
          transition-colors

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}