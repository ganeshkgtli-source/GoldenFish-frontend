import { useCallback, useState } from "react";

import { AlertCircle, AlertTriangle, Key, Link2 } from "lucide-react";

import { toast } from "react-toastify";
import type { ProfileResponse } from "@/features/user/api/profileApi";
import type { useUpdateApi } from "@/features/user/hooks/useProfile";
import SectionCard from "@/features/user/components/profile/SectionCard";
import SecretRow from "@/features/user/components/profile/SecretRow";

type Props = {
  data?: ProfileResponse;

  updateApiMutation: ReturnType<typeof useUpdateApi>;

  editApi?: boolean;
};

const copyText = (val?: string) => {
  if (!val) return;

  navigator.clipboard.writeText(val);

  toast.success("Copied!", {
    autoClose: 1200,
  });
};

export default function ApiSection({
  data,

  updateApiMutation,
  editApi,
}: Props) {
  /* ───────────────── STATE ───────────────── */

  const [showApiKey, setShowApiKey] = useState(false);

  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isEditingApi, setIsEditingApi] = useState(editApi ?? false);

  const [apiKey, setApiKey] = useState("");

  const [apiSecret, setApiSecret] = useState("");

  const [apiPassword, setApiPassword] = useState("");

  const [copied, setCopied] = useState(false);

  /* ───────────────── CALLBACK URL ───────────────── */

  const callbackUrl = import.meta.env.VITE_DHAN_CALLBACK_URL;

  const handleCopyCallback = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(callbackUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, [callbackUrl]);

  /* ───────────────── UPDATE API ───────────────── */

  const handleUpdateApi = useCallback(() => {
    if (!apiKey || !apiSecret || !apiPassword) {
      toast.error("All fields required ❌");

      return;
    }

    updateApiMutation.mutate(
      {
        api_key: apiKey,

        api_secret: apiSecret,

        password: apiPassword,
      },
      {
        onSuccess: () => {
          toast.success("API credentials updated ✅");

          setIsEditingApi(false);

          setApiKey("");

          setApiSecret("");

          setApiPassword("");
        },

        onError: (err: Error) => {
          toast.error(err.message || "Failed to update API ❌");
        },
      },
    );
  }, [apiKey, apiSecret, apiPassword, updateApiMutation]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <SectionCard title="API Credentials" icon={<Key size={16} />}>
        {!isEditingApi ? (
          <div className="space-y-3">
            <SecretRow
              label="API Key"
              value={data?.user?.api_key}
              show={showApiKey}
              onToggle={() => setShowApiKey((p) => !p)}
              onCopy={() => copyText(data?.user?.api_key)}
            />

            <SecretRow
              label="API Secret"
              value={data?.user?.api_secret}
              show={showApiSecret}
              onToggle={() => setShowApiSecret((p) => !p)}
              onCopy={() => copyText(data?.user?.api_secret)}
            />

            {/* WARNING */}
            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle
                size={14}
                className="text-yellow-500 flex-shrink-0"
              />

              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Never share your API credentials. Rotate them immediately if
                compromised.
              </p>
            </div>

            {/* EXPIRY */}
            <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle
                size={14}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />

              <div className="space-y-1">
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  API Expiry Notice
                </p>

                <p className="text-xs text-red-500/90 dark:text-red-300/90 leading-relaxed">
                  Your API credentials will expire in{" "}
                  <span className="font-semibold">
                    {(data?.days_left?.months ?? 0) > 0 &&
                      `${data?.days_left?.months} months `}
                    {data?.days_left?.days ?? "_"} days
                  </span>
                  {data?.days_left?.months === 0 &&
                    data?.days_left?.days <= 30 && (
                      <>
                        . Please regenerate or renew your credentials before
                        expiry to avoid interruption in algo trading services.
                      </>
                    )}
                </p>
              </div>
            </div>

            {/* UPDATE BTN */}
            <button
              onClick={() => setIsEditingApi(true)}
              className="w-full mt-2 py-2.5 rounded-xl border border-red-500/40 text-red-500 text-sm font-medium hover:bg-red-500/10 transition"
            >
              Update API Credentials
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter your new credentials. Your account password is required to
              confirm.
            </p>

            {/* CALLBACK URL */}
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 via-background to-background p-4 space-y-3 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                    <Link2 size={15} className="text-red-500" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Dhan Callback URL
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      Required for broker authentication
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 hover:bg-red-500/20 active:scale-95 transition-all"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="group flex items-center justify-between rounded-xl border border-border/60 bg-black/20 dark:bg-white/[0.03] px-4 py-3 transition-all hover:border-red-500/30">
                <span className="text-[13px] font-medium text-gray-200 break-all tracking-wide">
                  {callbackUrl}
                </span>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] px-3 py-2.5">
                <AlertCircle
                  size={14}
                  className="text-yellow-500 mt-0.5 flex-shrink-0"
                />

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Configure this exact callback URL in your Dhan developer
                  application settings to enable secure authentication and token
                  redirection.
                </p>
              </div>
            </div>

            {/* API KEY */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                New API Key
              </label>

              <input
                className="wizard-input"
                placeholder="api_key_xxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            {/* API SECRET */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                New API Secret
              </label>

              <input
                className="wizard-input"
                placeholder="api_secret_xxxxxxxxxxxx"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Account Password
              </label>

              <input
                type="password"
                className="wizard-input"
                placeholder="Your account password"
                value={apiPassword}
                onChange={(e) => setApiPassword(e.target.value)}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleUpdateApi}
                disabled={updateApiMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
              >
                {updateApiMutation.isPending ? "Saving…" : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setIsEditingApi(false);

                  setApiKey("");

                  setApiSecret("");

                  setApiPassword("");
                }}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
