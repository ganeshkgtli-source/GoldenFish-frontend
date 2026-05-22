import DateRangeFilter from "./filters/DateRangeFilter";
import ResetFilter from "./filters/ResetFilter";
import SearchFilter from "./filters/SearchFilter";
import SelectFilter from "./filters/SelectFilter";

import SortFilter from "./filters/SortFilter";

import type { FilterConfig } from "./types";

type FilterValues = Record<string, string>;

type FilterBarProps = {
  filters: FilterConfig[];

  values: FilterValues;

  onChange: (key: string, value: string) => void;

  onReset?: () => void;

  onQuickRange?: (days: number) => void;
};

export default function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  onQuickRange,
}: FilterBarProps) {
  return (
    <div
      className="
        flex flex-wrap items-center gap-3
      "
    >
      {filters.map((filter) => {
        switch (filter.type) {
          case "search":
            return (
              <SearchFilter
                key={filter.key}
                value={values[filter.key] || ""}
                placeholder={filter.placeholder}
                onChange={(value) => onChange(filter.key, value)}
              />
            );

          case "select":
            return (
              <SelectFilter
                key={filter.key}
                value={values[filter.key] || ""}
                options={filter.options ?? []}
                placeholder={filter.placeholder}
                onChange={(value: string) => onChange(filter.key, value)}
              />
            );

          case "sort":
            return (
              <SortFilter
                key={filter.key}
                value={values[filter.key] || ""}
                options={filter.options || []}
                onChange={(value) => onChange(filter.key, value)}
              />
            );

          case "date-range":
            return (
              <DateRangeFilter
                key={filter.key}
                fromDate={values.fromDate || ""}
                toDate={values.toDate || ""}
                setFromDate={(value) => onChange("fromDate", value)}
                setToDate={(value) => onChange("toDate", value)}
                onQuickRange={onQuickRange}
              />
            );

          case "reset":
            return onReset ? (
              <ResetFilter key={filter.key} onReset={onReset} />
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
