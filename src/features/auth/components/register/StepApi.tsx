import { Check, Copy } from "lucide-react";
import { memo, useState } from "react";

import Field from "../Field";

type FormState = {
  client_id: string;
  api_key: string;
  api_secret: string;
  account_type: "AP" | "INDIVIDUAL" | null;
  terms_accepted: boolean;
};

interface Props {
  form: FormState;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

function StepApiComponent({ form, handleChange }: Props) {
  const [copied, setCopied] = useState(false);
  const callbackUrl = import.meta.env.VITE_DHAN_CALLBACK_URL;
  const handleCopyCallback = async () => {
    try {
      await navigator.clipboard.writeText(callbackUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {form.account_type === "AP" ? "Client ID Setup" : "API Configuration"}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect your Dhan trading account
        </p>
      </div>

      <Field
        label="Client ID"
        name="client_id"
        placeholder="Enter your Dhan Client ID"
        value={form.client_id}
        onChange={handleChange}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Dhan Redirect URL
          </label>

          <span className="rounded-full border border-red-200 bg-red-100 px-2 py-1 text-[10px] font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            REQUIRED
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-white to-red-50/80 shadow-lg shadow-red-500/5 dark:border-red-500/20 dark:from-gray-900 dark:to-red-950/10">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            <div className="flex h-[42px] flex-1 items-center overflow-x-auto rounded-xl border border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
              <span className="whitespace-nowrap text-[13px] font-medium text-gray-700 dark:text-gray-300">
                {callbackUrl}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCallback}
              className="flex h-[42px] min-w-[110px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 font-medium text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-red-700 hover:to-red-800 active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check size={15} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200/60 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
          <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-300">
            Create a new{" "}
            <span className="font-semibold">Dhan API Credential</span> and paste
            this redirect URL inside your{" "}
            <span className="font-semibold">Dhan Developer App Settings</span>{" "}
            to enable secure authentication and callback verification.
          </p>
        </div>
      </div>

      {form.account_type === "INDIVIDUAL" && (
        <>
          <Field
            label="API Key"
            name="api_key"
            placeholder="Enter your API Key"
            value={form.api_key}
            onChange={handleChange}
          />

          <Field
            label="API Secret"
            name="api_secret"
            type="password"
            placeholder="Enter your API Secret"
            value={form.api_secret}
            onChange={handleChange}
          />
        </>
      )}

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="terms_accepted"
          checked={form.terms_accepted}
          onChange={handleChange}
          className="mt-1"
        />

        <span className="text-sm text-gray-600 dark:text-gray-400">
          I agree to the{" "}
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-red-600 underline hover:text-red-700"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-red-600 underline hover:text-red-700"
          >
            Privacy Policy
          </a>
        </span>
      </label>
    </div>
  );
}

const StepApi = memo(StepApiComponent);

export default StepApi;
