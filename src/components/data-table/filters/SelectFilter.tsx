import type { FilterOption } from "../types";

import { ChevronDown } from "lucide-react";

type SelectFilterProps = {
  value: string;

  onChange: (value: string) => void;

  options?: FilterOption[];

  placeholder?: string;

  className?: string;

  disabled?: boolean;
};

export default function SelectFilter({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
  disabled = false,
}: SelectFilterProps) {
  return (
    <div
      className={`relative ${className}`}
    >
      <select
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
       className={`
  h-10

  w-auto
  min-w-[110px]

  appearance-none

  rounded-xl
  border border-border

  bg-[var(--input-background)]

  pl-3
  pr-10

  text-sm
  font-medium
  text-foreground

  outline-none

  transition-all
  duration-200

  hover:border-border/80
  hover:bg-muted/30

  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-500/20
`}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="
              bg-background
              text-foreground
            "
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="
          pointer-events-none

          absolute
          right-3
          top-1/2

          -translate-y-1/2

          text-muted-foreground
        "
      />
    </div>
  );
}