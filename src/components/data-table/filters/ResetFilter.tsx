import { RotateCcw } from "lucide-react";

type ResetFilterProps = {
  onReset: () => void;
};

export default function ResetFilter({
  onReset,
}: ResetFilterProps) {
  return (
    <button
      onClick={onReset}
      className="
        ml-auto flex h-10
        items-center gap-2

        rounded-xl
        border border-red-500

        px-4

        text-sm text-red-500

        transition-all duration-200

        hover:bg-red-500
        hover:text-white
      "
    >
      <RotateCcw size={15} />

      Reset
    </button>
  );
}