import { memo } from "react";
import {
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

type Props = {
  label: string;
  value?: string;
  show: boolean;
  onToggle: () => void;
  onCopy: () => void;
};

const SecretRow = memo(function SecretRow({
  label,
  value,
  show,
  onToggle,
  onCopy,
}: Props) {
  return (
    <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-xl border border-border gap-3">

      <span className="text-sm text-muted-foreground flex-shrink-0">
        {label}
      </span>

      <span className="text-sm font-mono flex-1 truncate text-center">
        {show
          ? value ?? "—"
          : "••••••••••••••••"}
      </span>

      <div className="flex items-center gap-2 flex-shrink-0">

        <button
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground transition"
        >
          <Copy size={14} />
        </button>

        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground transition"
        >
          {show
            ? <EyeOff size={14} />
            : <Eye size={14} />}
        </button>

      </div>
    </div>
  );
});

export default SecretRow;