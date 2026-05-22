import { memo } from "react";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function SearchInputComponent({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative w-full lg:w-[300px]">
      <Search
        size={14}
        className="
          absolute left-3 top-1/2
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          wizard-input
          h-10 w-full
          rounded-xl
          border border-border
          bg-background
          pl-9 pr-4
          text-sm
          outline-none
          focus:ring-2
          focus:ring-primary/20
        "
      />
    </div>
  );
}

const SearchInput = memo(
  SearchInputComponent,
);

export default SearchInput;