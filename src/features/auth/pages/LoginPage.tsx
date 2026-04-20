import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TrendingUp, Mail, Lock } from "lucide-react";

import { useLogin } from "../hooks/useLogin";
import { useVerifyOtp } from "../hooks/useRegister";
import ThemeToggle from "../components/ThemeToggle";
import OtpVerification from "../components/OtpVerification";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const verifyMutation = useVerifyOtp();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginMutation.mutateAsync(form);

      // ✅ NORMAL LOGIN
      localStorage.setItem("access", res.tokens.access);
      localStorage.setItem("refresh", res.tokens.refresh);

      // ✅ DHAN REDIRECT
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
        return;
      }

      setError(
        data?.message ||
        data?.detail ||
        data?.error ||
        "Invalid credentials"
      );
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const res = await verifyMutation.mutateAsync({
        email,
        otp,
      });

      localStorage.setItem("access", res.tokens.access);
      localStorage.setItem("refresh", res.tokens.refresh);

      navigate({ to: "/login" });

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "OTP verification failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#020B1F] px-4">
      
     <ThemeToggle variant="floating" />
      <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 ">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 relative p-12 items-center">

          <div className="absolute inset-0 
            bg-gradient-to-br from-slate-100 via-white to-slate-200
            dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
          " />

          <div className="absolute w-[300px] h-[300px] 
            bg-red-500/10 dark:bg-red-500/20 
            blur-3xl rounded-full top-10 left-10
          " />

          <div className="relative z-10 max-w-sm text-slate-900 dark:text-white">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">Time Line</h1>
            </div>

            <h2 className="text-xl font-semibold mb-3">
              Trade smarter, not harder
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Automate strategies, monitor markets, and execute trades with precision.
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p>• Secure API connections</p>
              <p>• Real-time insights</p>
              <p>• Built for traders</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">

          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Time Line
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Investments Pvt Ltd
            </p>
          </div>

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
                <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">
                  Email / Phone / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    className="wizard-input pl-9 py-2.5"
                    name="identifier"
                    value={form.identifier}
                    onChange={(e) =>
                      setForm({ ...form, identifier: e.target.value })
                    }
                    placeholder="Enter your identifier"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    className="wizard-input pl-9 py-2.5"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full wizard-primary-btn mt-2"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <OtpVerification
              email={email}
              loading={verifyMutation.isPending}
              onVerify={handleVerifyOtp}
            />
          )}

          <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-red-600 font-medium">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}