import {   useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useProfile,
  useChangePassword,
  useSendOtp,
  useVerifyOtpPassword,
} from "@/features/admin/operations/hooks/useOperations";

import {
  User,
  Mail,
  
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
} from "lucide-react";
 import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";

/* ================= COMPONENT ================= */

export default function Profile() {
  const { data, isLoading: loading } = useProfile();

  const [step, setStep] = useState<"password" | "otp">("password");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
const [canResend, setCanResend] = useState(false);

  /* ================= PASSWORD LOGIC ================= */

  const isStrong =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  const isPrefixMatch =
    confirmPassword && newPassword.startsWith(confirmPassword);

  /* ================= HANDLERS ================= */

  const changePasswordMutation = useChangePassword();
const sendOtpMutation = useSendOtp();   
  useEffect(() => {
  if (resendTimer > 0) {
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setCanResend(true);
  }
}, [resendTimer]);

  const changePassword = () => {
  // 🔴 basic validation
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
      onSuccess: (res: any) => {
toast.success("Password updated successfully. Kindly log in again.");
        // 🔥 delay logout AFTER toast
        if (res?.force_logout) {
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
          }, 3000); // match toast duration
        }

        // 🔄 reset fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },

      onError: (err: any) => {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to update password ❌";

        toast.error(msg);
      },
    }
  );
};

  

  const sendOtp = () => {
    sendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("OTP sent 📩");
        setStep("otp");
      },
      onError: () => {
        toast.error("Failed to send OTP");
      },
    });
  };

  const verifyOtpMutation = useVerifyOtpPassword();

  const verifyOtp = () => {
  // 🔴 validate email
  // if (!data?.email) {
  //   toast.error("User data not loaded ❌");
  //   return;
  // }

  // 🔴 validate fields
  if (!otp || otp.length < 6) {
    toast.error("Enter valid OTP ❌");
    return;
  }

  if (!newPassword || !confirmPassword) {
    toast.error("Password fields are required ❌");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match ❌");
    return;
  }

  // 🚀 mutation
  verifyOtpMutation.mutate(
    {
      // email: data.email,
      otp: otp.trim(),
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
    {
      onSuccess: (res: any) => {
toast.success("Password updated successfully. Kindly log in again.");
        // 🔥 delay logout AFTER toast
        if (res?.force_logout) {
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
          }, 3000);
        }

        // 🔄 reset fields
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      },

      onError: (err: any) => {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Invalid OTP ❌";

        toast.error(msg);
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
      setCanResend(false);
    },
    onError: (err: any) => {
      const wait = err?.response?.data?.remaining_time;

      if (wait) {
        toast.error(`Wait ${wait}s before retrying ⏳`);
        setResendTimer(wait);
        setCanResend(false);
      } else {
        toast.error("Failed to resend OTP ❌");
      }
    },
  });
};
  /* ================= UI ================= */

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
              <p className="text-sm text-muted-foreground">
                Manage your account and security settings
              </p>
            </div>
          </div>

          <ShieldCheck className="text-green-500" size={48} />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6"> 
            {/* PROFILE */}
            <div
              className="
    relative rounded-2xl p-6   overflow-hidden

    bg-background
    border border-border

    transition duration-300
    hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]
  "
            >
              {/* 🔥 GRADIENT GLOW OVERLAY */}
              <div
                className="
      absolute inset-0 opacity-0 hover:opacity-100 transition duration-500
      bg-gradient-to-r from-primary/10 via-blue-500/10 to-green-500/10
      pointer-events-none
    "
              />

              {/* CONTENT */}
              <div className="relative z-10 space-y-6">
                {/* HEADER */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Profile Information
                  </h3>
                </div>

                {/* ================= USERNAME ================= */}
                <div
                  className="
        group relative flex items-center gap-5 p-5 rounded-xl

        bg-muted border border-border

        transition duration-300
        hover:border-primary/40
        hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
        hover:-translate-y-1
      "
                >
                  <div
                    className="
          w-14 h-14 rounded-xl flex items-center justify-center

          bg-purple-500/10 border border-primary/20

          transition group-hover:scale-105
        "
                  >
                    <User className="text-purple-500" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Username
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {data?.username}
                    </span>
                  </div>

                  {/* DOTS */}
                  <div className="absolute right-5 grid grid-cols-4 gap-1 opacity-30">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-purple-500  rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* ================= EMAIL ================= */}
                <div
                  className="
        group relative flex items-center gap-5 p-5 rounded-xl

        bg-muted border border-border

        transition duration-300
        hover:border-primary/40
        hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]
        hover:-translate-y-1
      "
                >
                  <div
                    className="
          w-14 h-14 rounded-xl flex items-center justify-center

          bg-blue-500/10 border border-blue-500/20

          transition group-hover:scale-105
        "
                  >
                    <Mail className="text-blue-400" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-lg font-semibold text-foreground">
                      {data?.email}
                    </span>
                  </div>

                  <div className="absolute right-5 grid grid-cols-4 gap-1 opacity-30">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* ================= PHONE ================= */}
                <div
                  className="
        group relative flex items-center gap-5 p-5 rounded-xl

        bg-muted border border-border

        transition duration-300
        hover:border-primary/40
        hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]
        hover:-translate-y-1
      "
                >
                  <div
                    className="
          w-14 h-14 rounded-xl flex items-center justify-center

          bg-green-500/10 border border-green-500/20

          transition group-hover:scale-105
        "
                  >
                    <Phone className="text-green-400" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-lg font-semibold text-foreground">
                      {data?.phone}
                    </span>
                  </div>

                  <div className="absolute right-5 grid grid-cols-4 gap-1 opacity-30">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-green-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                Change Password
              </h3>

              {step === "password" && (
                <>
                  <PasswordField
                    value={oldPassword}
                    onChange={setOldPassword}
                    placeholder="Old Password"
                    show={showOld}
                    setShow={setShowOld}
                  />

                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="New Password"
                    show={showNew}
                    setShow={setShowNew}
                  />

                  <PasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                  />

                  {/* 🔥 VALIDATION BARS */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <div
                        className={`h-1 flex-1 rounded ${isStrong ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <div className="h-1 flex-1 bg-gray-300 rounded overflow-hidden">
                        <div
                          className={`h-full ${isPrefixMatch ? "bg-green-500" : "bg-red-500"}`}
                          style={{
                            width: `${(confirmPassword.length / newPassword.length) * 100 || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span>Password Strength</span>
                      <span
                        className={
                          isPrefixMatch ? "text-green-500" : "text-red-500"
                        }
                      >
                        {isPrefixMatch ? "Matching" : "Not Matching"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={changePassword}
                    disabled={changePasswordMutation.isPending}
                    className="
    w-full py-2 rounded-lg font-medium

    bg-green-500 text-white
    hover:bg-green/10

    disabled:opacity-50 disabled:cursor-not-allowed
  "
                  >
                    {changePasswordMutation.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </button>

                  <button
                    onClick={sendOtp}
                    disabled={sendOtpMutation.isPending}
                    className="
    w-full py-2 rounded-lg font-medium

    border border-border
    bg-muted text-foreground

    hover:bg-muted/80

    disabled:opacity-50 disabled:cursor-not-allowed
  "
                  >
                    {sendOtpMutation.isPending
                      ? "Sending..."
                      : "Change via OTP instead"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  {/* OTP */}
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border    bg-[var(--input-background)] focus:ring-2 focus:ring-primary"
                  />

                  {/* NEW PASSWORD */}
                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="New Password"
                    show={showNew}
                    setShow={setShowNew}
                  />

                  {/* CONFIRM PASSWORD */}
                  <PasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                  />

                  {/* VALIDATION BARS */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <div
                        className={`h-1 flex-1 rounded ${isStrong ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <div className="h-1 flex-1 bg-gray-300 rounded overflow-hidden">
                        <div
                          className={`h-full ${isPrefixMatch ? "bg-green-500" : "bg-red-500"}`}
                          style={{
                            width: `${(confirmPassword.length / newPassword.length) * 100 || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span>Password Strength</span>
                      <span
                        className={
                          isPrefixMatch ? "text-green-500" : "text-red-500"
                        }
                      >
                        {isPrefixMatch ? "Matching" : "Not Matching"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={
                      !otp || otp.length < 6 || verifyOtpMutation.isPending
                    }
                    className="
    w-full py-2 rounded-lg font-medium

    bg-green-500 text-white
    hover:bg-green/80

    disabled:opacity-50 disabled:cursor-not-allowed
  "
                  >
                    {verifyOtpMutation.isPending
                      ? "Verifying..."
                      : "Verify & Change Password"}
                  </button>
                  <div className="flex justify-between items-center text-sm mt-2">

  <span className="text-muted-foreground">
    Didn’t receive OTP?
  </span>

  <button
    onClick={handleResendOtp}
    disabled={!canResend || sendOtpMutation.isPending}
    className={`
      font-medium transition

      ${
        canResend
          ? "text-primary hover:underline"
          : "text-muted-foreground cursor-not-allowed"
      }
    `}
  >
    {sendOtpMutation.isPending
      ? "Sending..."
      : canResend
      ? "Resend OTP"
      : `Resend in ${resendTimer}s`}
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

/* ================= PASSWORD FIELD ================= */

function PasswordField({ value, onChange, placeholder, show, setShow }: any) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border    bg-[var(--input-background)] focus:ring-2 focus:ring-primary"
      />

      <button onClick={() => setShow(!show)} className="absolute right-3 top-2">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
