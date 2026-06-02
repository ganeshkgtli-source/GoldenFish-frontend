import { useRef } from "react";

interface Props {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
}: Props) {
  const refs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  const digits = Array.from(
    { length: 6 },
    (_, i) => value[i] || ""
  );

  const updateOtp = (
    index: number,
    digit: string
  ) => {
    const next = [...digits];

    next[index] = digit;

    onChange(next.join(""));
  };

  const handleChange = (
    index: number,
    val: string
  ) => {
    if (!/^\d?$/.test(val)) return;

    updateOtp(index, val);

    if (
      val &&
      index < 5
    ) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      refs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      refs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    onChange(pasted);

    const lastIndex =
      pasted.length - 1;

    if (lastIndex >= 0) {
      refs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[index]}
          onPaste={
            index === 0
              ? handlePaste
              : undefined
          }
          onKeyDown={(e) =>
            handleKeyDown(
              index,
              e
            )
          }
          onChange={(e) =>
            handleChange(
              index,
              e.target.value
            )
          }
          className={`
            w-11
            h-11

            rounded-xl

            border

            ${
              error
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-slate-300 dark:border-slate-700"
            }

            bg-white
            dark:bg-slate-800

            text-center
            text-base
            font-semibold

            text-slate-900
            dark:text-white

            outline-none

            transition-all
            duration-200

            focus:border-red-500
            focus:ring-4
            focus:ring-red-500/15
            focus:scale-105

            disabled:opacity-50
            disabled:cursor-not-allowed
          `}
        />
      ))}
    </div>
  );
}