import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  TrendingUp,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  EyeOff,
  Eye,
} from "lucide-react";

import { useLogin } from "../hooks/useAuth";
import {
  useVerifyOtp,
  useResendOtp,
  useForgotPassword,
} from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import OtpVerification from "../components/OtpVerification";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const forgotMutation = useForgotPassword();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  // ✅ MODAL STATE
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // ✅ COOLDOWN TIMER
  const [cooldown, setCooldown] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  /* ================= LOGIN ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginMutation.mutateAsync(form);

      // ✅ STORE TOKENS ONLY HERE
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access", res.tokens.access);
      storage.setItem("refresh", res.tokens.refresh);

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
          "Invalid credentials",
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

  const handleForgotPassword = async () => {
    if (cooldown > 0) return;

    setError("");
    setForgotSuccess("");

    if (!forgotEmail.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!forgotEmail.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    try {
      await forgotMutation.mutateAsync(forgotEmail);
      setForgotSuccess("Reset link sent successfully!");
      setCooldown(30);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to send reset link",
      );
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      <ThemeToggle variant="floating" />

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/10 dark:bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex w-1/2 relative p-12 items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-red-500/20 rounded-2xl rotate-12" />
            <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-red-500/10 rounded-full" />
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-red-500/5 rounded-xl rotate-45" />
          </div>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 relative group">
                <TrendingUp className="w-7 h-7 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Time{" "}
                  <span className="text-red-600 dark:text-red-500">Line</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Investments Pvt Ltd
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30">
                <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Smart Trading Platform
                </span>
              </div>

              <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Trade smarter,
                <br />
                <span className="text-red-600 dark:text-red-500">
                  not harder
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Automate your strategies, monitor markets in real-time, and
                execute trades with precision. Experience the future of trading.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { label: "Active Users", value: "10K+" },
                  { label: "Trades/Day", value: "50K+" },
                  { label: "Uptime", value: "99.9%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Time{" "}
                <span className="text-red-600 dark:text-red-500">Line</span>
              </h1>
            </div>
          </div>

          {/* Login Form */}
          {!showOtp && !showForgot ? (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome back
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter your credentials to continue trading
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all outline-none"
                    placeholder="Enter your email or phone"
                    value={form.identifier}
                    onChange={(e) =>
                      setForm({ ...form, identifier: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all outline-none hide-browser-eye"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      onFocus={() => setIsPasswordFocused(true)} // ✅ ADD THIS
                      onBlur={() => setIsPasswordFocused(false)} // ✅ ADD THIS
                      required
                    />

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`absolute inset-y-0 right-3 flex items-center transition-opacity duration-200
    ${form.password && isPasswordFocused ? "opacity-100" : "opacity-0 pointer-events-none"}
    text-slate-500 dark:text-slate-200 hover:text-red-500`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-red-600"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail(form.identifier || "");
                      setError("");
                      setForgotSuccess("");
                    }}
                    className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loginMutation.isPending ? (
                    "Logging in..."
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                      New to Timeline?
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/register" })}
                  className="w-full py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                >
                  Create an account
                </button>
              </form>
            </div>
          ) : showForgot ? (
            /* Forgot Password */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Reset Password
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter your email to receive a reset link
                </p>
              </div>

              <input
                type="email"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all outline-none"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {forgotSuccess && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                  {forgotSuccess}
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={cooldown > 0 || forgotMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : forgotMutation.isPending
                    ? "Sending..."
                    : "Send Reset Link"}
              </button>

              <button
                onClick={() => {
                  setShowForgot(false);
                  setError("");
                  setForgotSuccess("");
                }}
                className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            /* OTP Verification */
            <OtpVerification
              email={email}
              loading={verifyMutation.isPending}
              onVerify={handleVerifyOtp}
              onResend={handleResend}
              title="Email verification required"
              subtitle="Please verify before login"
            />
          )}
        </div>
      </div>
    </div>
  );
}
