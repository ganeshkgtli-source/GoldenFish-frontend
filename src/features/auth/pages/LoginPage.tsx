import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TrendingUp,  } from "lucide-react";

import { useLogin } from "../hooks/useLogin";
import { useVerifyOtp, useResendOtp } from "../hooks/useRegister";
import ThemeToggle from "../components/ThemeToggle";
import OtpVerification from "../components/OtpVerification";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  /* ================= LOGIN ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginMutation.mutateAsync(form);

      // ✅ STORE TOKENS ONLY HERE
      localStorage.setItem("access", res.tokens.access);
      localStorage.setItem("refresh", res.tokens.refresh);

      // ✅ OPTIONAL REDIRECT
      if (res.dhan_login_url) {
        window.location.href = res.dhan_login_url;
        return;
      }

      navigate({ to: res.redirect_to || "/home" });

    } catch (err: any) {
      const data = err?.response?.data;

      // ✅ EMAIL NOT VERIFIED → SHOW OTP
      if (data?.email_verification_required) {
        setEmail(data.email);
        setShowOtp(true);
        setError(""); // clear login error
        return;
      }

      setError(
        data?.message ||
        data?.error ||
        data?.detail ||
        err?.message ||
        "Invalid credentials"
      );
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (otp: string) => {
    if (!email) {
      throw new Error("Email missing. Please login again.");
    }

    await verifyMutation.mutateAsync({
      email,
      otp,
    });

    // ✅ ONLY VERIFY → NOT LOGIN
    setShowOtp(false);

    // ✅ Prefill login field
    setForm((prev) => ({
      ...prev,
      identifier: email,
    }));

    setError("Email verified successfully. Please login.");
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    await resendMutation.mutateAsync(email);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#020B1F] px-4">

    <ThemeToggle variant="floating" />

    {/* MAIN CONTAINER */}
    <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">

      {/* 🔴 LEFT SIDE (REDESIGNED) */}
      <div className="hidden lg:flex w-1/2 relative p-12 items-center overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 
          bg-gradient-to-br 
          from-white via-red-50 to-white 
          dark:from-slate-900 dark:via-red-900/10 dark:to-slate-900
        " />

        {/* GLOW */}
        <div className="absolute w-[320px] h-[320px] 
          bg-red-500/20 dark:bg-red-500/10 
          blur-3xl rounded-full top-10 left-10
        " />

        {/* CONTENT */}
        <div className="relative z-10 max-w-sm text-slate-900 dark:text-white">

          {/* LOGO */}
          <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Time Line
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Investments Pvt Ltd
          </p>
        </div>

          {/* TEXT */}
          <h2 className="text-xl font-semibold mb-3">
            Trade smarter, not harder
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Automate strategies, monitor markets, and execute trades with precision.
          </p>
        </div>
      </div>

      {/* 🔵 RIGHT SIDE */}
      <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to continue
          </p>
        </div>

        {error && <div className="wizard-error mb-4">{error}</div>}

        {!showOtp ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm mb-1 block">
                Email / Phone 
                {/* / Username */}
              </label>
              <input
                className="wizard-input"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Password</label>
              <input
                type="password"
                className="wizard-input"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full wizard-primary-btn"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <OtpVerification
            email={email}
            loading={verifyMutation.isPending}
            onVerify={handleVerifyOtp}
            onResend={handleResend}
          />
        )}
      </div>
    </div>
  </div>
);
}