import { useMemo, useState } from "react";

import { Shield } from "lucide-react";

import { toast } from "react-toastify";

import OtpTimer from "@/features/user/components/profile/OtpTimer";
import type {
  useChangePassword,
  useSendOtp,
  useVerifyOtpPassword,
} from "@/features/user/hooks/useProfile";
import SectionCard from "@/features/user/components/profile/SectionCard";
import PasswordField from "@/features/user/components/profile/PasswordField";
import StrengthBars from "@/features/user/components/profile/StrengthBars";

type Props = {
  changePasswordMutation: ReturnType<typeof useChangePassword>;

  sendOtpMutation: ReturnType<typeof useSendOtp>;

  verifyOtpMutation: ReturnType<typeof useVerifyOtpPassword>;
};
type ApiResponse = {
  force_logout?: boolean;
};

export default function SecuritySection({
  changePasswordMutation,

  sendOtpMutation,

  verifyOtpMutation,
}: Props) {
  /* ───────────────── STATE ───────────────── */

  const [step, setStep] = useState<"password" | "otp">("password");

  const [otp, setOtp] = useState("");

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  /* ───────── PASSWORD STRENGTH ───────── */

  const { isStrong, exactMatch, partialMatch, matchPct } = useMemo(() => {
    const isStrong =
      newPassword.length >= 8 &&
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword);

    const exactMatch = newPassword === confirmPassword;

    const partialMatch =
      confirmPassword.length < newPassword.length &&
      newPassword.startsWith(confirmPassword);

    const matchPct = partialMatch
      ? Math.round((confirmPassword.length / newPassword.length) * 100)
      : 0;

    return {
      isStrong,
      exactMatch,
      partialMatch,
      matchPct,
    };
  }, [newPassword, confirmPassword]);

  /* ───────── HELPERS ───────── */

  const doForceLogout = (res: ApiResponse) => {
    if (res?.force_logout) {
      setTimeout(() => {
        localStorage.clear();

        window.location.href = "/signin";
      }, 2500);
    }
  };

  /* ───────── HANDLERS ───────── */

  const handleSendOtp = () => {
    sendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("OTP sent to your email 📩");

        setStep("otp");
      },

      onError: (err: Error) => {
        toast.error(err.message || "Failed to send OTP");
      },
    });
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required ❌");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");

      return;
    }

    changePasswordMutation.mutate(
      {
        old_password: oldPassword,

        new_password: newPassword,

        confirm_password: confirmPassword,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password updated ✅ Logging you out…");

          doForceLogout(res);

          setOldPassword("");

          setNewPassword("");

          setConfirmPassword("");
        },

        onError: (err: Error) => {
          toast.error(err.message || "Failed to update password ❌");
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      toast.error("Enter a valid 6-digit OTP ❌");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");

      return;
    }

    verifyOtpMutation.mutate(
      {
        otp: otp.trim(),

        new_password: newPassword,

        confirm_password: confirmPassword,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password changed ✅ Logging you out…");

          doForceLogout(res);

          setOtp("");

          setNewPassword("");

          setConfirmPassword("");
        },

        onError: (err: Error) => {
          toast.error(err.message || "Invalid OTP ❌");
        },
      },
    );
  };

  /* ───────── UI ───────── */

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <SectionCard title="Change Password" icon={<Shield size={16} />}>
        {/* PASSWORD STEP */}
        {step === "password" && (
          <div className="space-y-3">
            <PasswordField
              value={oldPassword}
              onChange={setOldPassword}
              placeholder="Current Password"
              show={showOld}
              setShow={setShowOld}
              label="Current Password"
            />

            <PasswordField
              value={newPassword}
              onChange={setNewPassword}
              placeholder="New Password"
              show={showNew}
              setShow={setShowNew}
              label="New Password"
            />

            <PasswordField
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              show={showConfirm}
              setShow={setShowConfirm}
              label="Confirm Password"
            />

            <StrengthBars
              isStrong={isStrong}
              exactMatch={exactMatch}
              partialMatch={partialMatch}
              matchPct={matchPct}
              confirmPassword={confirmPassword}
              newPassword={newPassword}
            />

            <button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
            >
              {changePasswordMutation.isPending
                ? "Updating…"
                : "Update Password"}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={sendOtpMutation.isPending}
              className="w-full py-2.5 rounded-xl border border-border text-sm hover:bg-muted disabled:opacity-50 transition"
            >
              {sendOtpMutation.isPending
                ? "Sending OTP…"
                : "Change via OTP instead"}
            </button>
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
              OTP sent to your registered email.
            </div>

            <input
              className="wizard-input"
              placeholder="• • • • • •"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <PasswordField
              value={newPassword}
              onChange={setNewPassword}
              placeholder="New Password"
              show={showNew}
              setShow={setShowNew}
              label="New Password"
            />

            <PasswordField
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              show={showConfirm}
              setShow={setShowConfirm}
              label="Confirm Password"
            />

            <StrengthBars
              isStrong={isStrong}
              exactMatch={exactMatch}
              partialMatch={partialMatch}
              matchPct={matchPct}
              confirmPassword={confirmPassword}
              newPassword={newPassword}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={!otp || otp.length < 6 || verifyOtpMutation.isPending}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
            >
              {verifyOtpMutation.isPending
                ? "Verifying…"
                : "Verify & Change Password"}
            </button>

            <OtpTimer
              onResend={handleSendOtp}
              isPending={sendOtpMutation.isPending}
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
