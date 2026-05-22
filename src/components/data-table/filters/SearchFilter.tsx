import { Search } from "lucide-react";

type SearchFilterProps = {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;
};

export default function SearchFilter({
  value,
  onChange,
  placeholder = "Search...",
}: SearchFilterProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="
          absolute left-3 top-1/2
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-10 w-[220px]

          rounded-xl
          border border-border
          bg-[var(--input-background)]

          pl-9 pr-3

          text-sm text-foreground
          placeholder:text-muted-foreground

          outline-none
          transition-colors

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />
    </div>
  );
}