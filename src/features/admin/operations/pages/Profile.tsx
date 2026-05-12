import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useProfile,
  useChangePassword,
  useSendOtp,
  useVerifyOtpPassword,
} from "@/features/admin/operations/hooks/useOperations";
import { User, Mail, Eye, EyeOff, ShieldCheck, Phone } from "lucide-react";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import type { ApiResponse } from "@/features/admin/operations/api/operationsApi";

/* ─── TYPES ──────────────────────────────────────────────── */

type PasswordFieldProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  setShow: (v: boolean) => void;
};

/* ─── PAGE ───────────────────────────────────────────────── */

export default function Profile() {
  const { data, isLoading: loading } = useProfile();

  const [step, setStep] = useState<"password" | "otp">("password");
  const [oldPassword,     setOldPassword]     = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp]             = useState("");
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
const canResend = resendTimer <= 0;

  /* password strength */
  const isStrong =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  const isPrefixMatch = !!confirmPassword && newPassword.startsWith(confirmPassword);

  /* countdown */
 useEffect(() => {
  if (resendTimer <= 0) return;

  const t = setTimeout(() => {
    setResendTimer((n) => n - 1);
  }, 1000);

  return () => clearTimeout(t);
}, [resendTimer]);

  /* ─── MUTATIONS ──────────────────────────────────────── */

  const changePasswordMutation = useChangePassword();
  const sendOtpMutation        = useSendOtp();
  const verifyOtpMutation      = useVerifyOtpPassword();

  const doForceLogout = (res: ApiResponse) => {
    if (res?.force_logout) {
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/signin";
      }, 3000);
    }
  };

  /* ─── HANDLERS ───────────────────────────────────────── */

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    // FIX: was typed as any in onSuccess/onError — now uses proper types
    changePasswordMutation.mutate(
      { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password updated successfully. Kindly log in again.");
          doForceLogout(res);
          setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update password ❌");
        },
      }
    );
  };

  const sendOtp = () => {
    sendOtpMutation.mutate(undefined, {
      onSuccess: () => { toast.success("OTP sent 📩"); setStep("otp"); },
      onError:   () => { toast.error("Failed to send OTP"); },
    });
  };

  const verifyOtp = () => {
    if (!otp || otp.length < 6) { toast.error("Enter valid OTP ❌"); return; }
    if (!newPassword || !confirmPassword) { toast.error("Password fields are required ❌"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match ❌"); return; }

    // FIX: was typed as any in onSuccess/onError
    verifyOtpMutation.mutate(
      { otp: otp.trim(), new_password: newPassword, confirm_password: confirmPassword },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password updated successfully. Kindly log in again.");
          doForceLogout(res);
          setOtp(""); setNewPassword(""); setConfirmPassword("");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Invalid OTP ❌");
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    sendOtpMutation.mutate(undefined, {
onSuccess: () => {
  toast.success("OTP resent successfully 📩");
  setResendTimer(60);
},      onError: () => { toast.error("Failed to resend OTP ❌"); },
    });
  };

  /* ─── RENDER ─────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-6 space-y-6 flex-1">

        {/* HERO */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-green-500/10 to-green-400/5 border border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
              <User />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your account and security settings</p>
            </div>
          </div>
          <ShieldCheck className="text-green-500" size={48} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-4 h-4 border-2 border-border border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {/* PROFILE INFO */}
            <div className="relative rounded-2xl p-6 overflow-hidden bg-background border border-border transition duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-gradient-to-r from-primary/10 via-blue-500/10 to-green-500/10 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>

                {[
                  { label: "Username", value: data?.username, icon: <User className="text-purple-500" />, color: "bg-purple-500/10 border-primary/20", dot: "bg-purple-500" },
                  { label: "Email",    value: data?.email,    icon: <Mail className="text-blue-400" />,   color: "bg-blue-500/10 border-blue-500/20",   dot: "bg-blue-400"   },
                  { label: "Phone",    value: data?.phone,    icon: <Phone className="text-green-400" />, color: "bg-green-500/10 border-green-500/20", dot: "bg-green-400"  },
                ].map(({ label, value, icon, color, dot }) => (
                  <div key={label} className="group relative flex items-center gap-5 p-5 rounded-xl bg-muted border border-border transition duration-300 hover:border-primary/40 hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${color} transition group-hover:scale-105`}>
                      {icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-lg font-semibold">{value || "—"}</span>
                    </div>
                    <div className="absolute right-5 grid grid-cols-4 gap-1 opacity-30">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`w-1 h-1 ${dot} rounded-full`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">Change Password</h3>

              {step === "password" && (
                <>
                  <PasswordField value={oldPassword}     onChange={setOldPassword}     placeholder="Old Password"     show={showOld}     setShow={setShowOld}     />
                  <PasswordField value={newPassword}     onChange={setNewPassword}     placeholder="New Password"     show={showNew}     setShow={setShowNew}     />
                  <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password" show={showConfirm} setShow={setShowConfirm} />

                  <StrengthBars isStrong={isStrong} isPrefixMatch={isPrefixMatch} confirmPassword={confirmPassword} newPassword={newPassword} />

                  <button onClick={changePassword} disabled={changePasswordMutation.isPending}
                    className="w-full py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </button>
                  <button onClick={sendOtp} disabled={sendOtpMutation.isPending}
                    className="w-full py-2 rounded-lg font-medium border border-border bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {sendOtpMutation.isPending ? "Sending..." : "Change via OTP instead"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-[var(--input-background)] focus:ring-2 focus:ring-primary" />
                  <PasswordField value={newPassword}     onChange={setNewPassword}     placeholder="New Password"     show={showNew}     setShow={setShowNew}     />
                  <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password" show={showConfirm} setShow={setShowConfirm} />

                  <StrengthBars isStrong={isStrong} isPrefixMatch={isPrefixMatch} confirmPassword={confirmPassword} newPassword={newPassword} />

                  <button onClick={verifyOtp} disabled={!otp || otp.length < 6 || verifyOtpMutation.isPending}
                    className="w-full py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Change Password"}
                  </button>

                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-muted-foreground">Didn't receive OTP?</span>
                    <button onClick={handleResendOtp} disabled={!canResend || sendOtpMutation.isPending}
                      className={`font-medium transition ${canResend ? "text-primary hover:underline" : "text-muted-foreground cursor-not-allowed"}`}>
                      {sendOtpMutation.isPending ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </div>
  );
}

/* ─── PASSWORD FIELD ─────────────────────────────────────── */

// FIX: was typed as any
function PasswordField({ value, onChange, placeholder, show, setShow }: PasswordFieldProps) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border bg-[var(--input-background)] focus:ring-2 focus:ring-primary"
      />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

/* ─── STRENGTH BARS ──────────────────────────────────────── */

function StrengthBars({ isStrong, isPrefixMatch, confirmPassword, newPassword }: {
  isStrong: boolean;
  isPrefixMatch: boolean;
  confirmPassword: string;
  newPassword: string;
}) {
  const matchPct = newPassword.length
    ? Math.min((confirmPassword.length / newPassword.length) * 100, 100)
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className={`h-1 flex-1 rounded ${isStrong ? "bg-green-500" : "bg-gray-300"}`} />
        <div className="h-1 flex-1 bg-gray-300 rounded overflow-hidden">
          <div
            className={`h-full ${isPrefixMatch ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${matchPct}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span>Password Strength</span>
        <span className={isPrefixMatch ? "text-green-500" : "text-red-500"}>
          {isPrefixMatch ? "Matching" : "Not Matching"}
        </span>
      </div>
    </div>
  );
}
