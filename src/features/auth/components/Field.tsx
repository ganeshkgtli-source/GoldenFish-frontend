import { Eye, EyeOff } from "lucide-react";
import {
  memo,
  useState,
  type InputHTMLAttributes,
} from "react";

 

type FieldProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    enableToggle?: boolean;
  };

function FieldComponent({
  label,
  type = "text",
  enableToggle = false,
  className = "",
  ...props
}: FieldProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [isFocused, setIsFocused] =
    useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      {/* LABEL */}
      <label
        className="
          block
          text-sm
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {label}
      </label>

      {/* INPUT WRAPPER */}
      <div className="relative">
        <input
          {...props}
          value={props.value ?? ""}
          type={
            isPassword && showPassword
              ? "text"
              : type
          }
          onFocus={(e) => {
            setIsFocused(true);

            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);

            props.onBlur?.(e);
          }}
          className={`
            w-full
            h-[52px]
            px-4
            ${
              enableToggle
                ? "pr-12 hide-browser-eye"
                : ""
            }

            rounded-xl
            border
            border-gray-300
            dark:border-gray-700

            bg-white
            dark:bg-gray-800

            outline-none

            text-[15px]
            font-medium

            text-gray-900
            dark:text-white

            placeholder:text-gray-500
            dark:placeholder:text-gray-400

            transition-all
            duration-200

            focus:ring-4
            focus:ring-red-500/15
            focus:border-red-500

            disabled:opacity-50
            disabled:cursor-not-allowed

            ${className}
          `}
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && enableToggle && (
          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            onMouseDown={(e) =>
              e.preventDefault()
            }
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className={`
              absolute
              right-3
              top-1/2
              -translate-y-1/2

              flex
              items-center
              justify-center

              transition-all
              duration-200

              ${
                Boolean(props.value) &&
                (isFocused || showPassword)
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }

              text-slate-500
              dark:text-slate-300

              hover:text-red-500
            `}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const Field = memo(FieldComponent);

export default Field;