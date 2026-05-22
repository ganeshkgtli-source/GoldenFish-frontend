import { memo, type Dispatch, type SetStateAction } from "react";

import Field from "../Field";
import type { FormState } from "../RegisterWizard";

interface Props {
  form: FormState;

 setForm: Dispatch<
  SetStateAction<FormState>
>;

  error: string;

  setError: Dispatch<SetStateAction<string>>;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

function StepPersonalComponent({
  form,
  setForm,
  error,
  setError,
  handleChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Let&apos;s start with your basic details
        </p>
      </div>

      <Field
        label="Username"
        name="username"
        placeholder="Choose a unique username"
        value={form.username}
        onChange={handleChange}
      />

      <Field
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            +91
          </span>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="9876543210"
            value={form.phone.replace("+91", "")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              setForm((prev) => ({
                ...prev,
                phone: `+91${value}`,
              }));

              const isValid = value
                ? /^[6-9]\d{0,9}$/.test(value)
                : true;

              if (!isValid) {
                setError(
                  "Only valid Indian mobile numbers are accepted",
                );
              } else if (
                error ===
                "Only valid Indian mobile numbers are accepted"
              ) {
                setError("");
              }
            }}
            className="
              h-[52px]
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              pl-14
              pr-4
              text-gray-900
              outline-none
              focus:border-red-500
              focus:ring-4
              focus:ring-red-500/15
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
            "
          />
        </div>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Only Indian mobile numbers are accepted
        </p>
      </div>
    </div>
  );
}

const StepPersonal = memo(StepPersonalComponent);

export default StepPersonal;