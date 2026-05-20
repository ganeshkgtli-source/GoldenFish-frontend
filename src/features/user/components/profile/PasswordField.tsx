import { memo } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  setShow: (v: boolean) => void;
  label?: string;
};

const PasswordField = memo(function PasswordField({
  value,
  onChange,
  placeholder,
  show,
  setShow,
  label,
}: Props) {
  return (
    <div>

      {label && (
        <label className="text-xs text-muted-foreground mb-1 block">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="wizard-input"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
        >
          {show
            ? <EyeOff size={15} />
            : <Eye size={15} />}
        </button>

      </div>
    </div>
  );
});

export default PasswordField;