import { memo } from "react";

import { X, ShieldAlert } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

type Props = {
  open: boolean;

  onClose: () => void;
};

function KycPopup({
  open,
  onClose,
}: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-md rounded-3xl border border-red-200 dark:border-red-500/20 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-500/10 flex items-center justify-center transition-all"
        >
          <X size={16} />
        </button>

        {/* CONTENT */}
        <div className="p-8">

          {/* ICON */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-5 shadow-lg shadow-red-500/30">

            <ShieldAlert
              className="text-white"
              size={30}
            />

          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Verify Your KYC
          </h2>

          {/* DESCRIPTION */}
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
            Complete your KYC verification to unlock secure trading,
            deposits, withdrawals, and API access.
          </p>

          {/* WARNING */}
          <div className="rounded-2xl border border-red-200/60 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3 mb-6">

            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              Your account verification is still pending.
              Please complete KYC to continue using all platform features.
            </p>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              navigate({
                to: "/kyc_verification",
              });
            }}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/20 transition-all"
          >
            Verify KYC
          </button>

        </div>
      </div>
    </div>
  );
}

export default memo(KycPopup);