import { memo } from "react";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  label: string;
  value?: string;
  copy?: boolean;
};

const copyText = (val?: string) => {
  if (!val) return;

  navigator.clipboard.writeText(val);

  toast.success("Copied!", {
    autoClose: 1200,
  });
};

const Field = memo(function Field({
  label,
  value,
  copy,
}: Props) {
  return (
    <div className="space-y-1">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="flex items-center gap-2">

        <span className="font-medium text-sm">
          {value || "—"}
        </span>

        {copy && value && (
          <button
            onClick={() => copyText(value)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Copy size={12} />
          </button>
        )}

      </div>
    </div>
  );
});

export default Field;