import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/reset-password.$uid.$token";
import { Eye, EyeOff, TrendingUp } from "lucide-react";

import ThemeToggle from "@/features/auth/components/ThemeToggle";
import api from "@/lib/api";

export default function ResetPassword() {
  const { uid, token } = Route.useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedField, setFocusedField] = useState<
    "password" | "confirm" | null
  >(null);

  const isPrefixMatch = confirmPassword && password.startsWith(confirmPassword);

  const isStrongPassword =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!isStrongPassword) {
      setError(
        "Password must include uppercase, lowercase, number & special character",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/reset-password/", {
        uid,
        token,
        password,
      });

      setMessage(
        res.data?.message ||
          "Password reset successful! Redirecting to login...",
      );

      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || "";

      if (msg.toLowerCase().includes("expired")) {
        setError("This reset link has expired. Please request a new one.");
        setIsLinkInvalid(true);
      } else if (msg.toLowerCase().includes("invalid")) {
        setError("Invalid reset link. Please request a new one.");
      } else {
        setError("Failed to reset password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-slate-100 dark:bg-[#020B1F] transition-colors duration-300">
      <ThemeToggle variant="floating" />

      <div className="w-full max-w-md">
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

        {/* CARD */}
        <div className="wizard-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
            Reset Your Password
          </h2>

          {message && (
            <div className="wizard-success mb-4 text-center space-y-1">
              <p>{message}</p>
              <p className="text-xs opacity-80">
                For your security, all sessions have been logged out.
              </p>
            </div>
          )}

          {error && (
            <div className="wizard-error mb-4 text-center space-y-2">
              <p>{error}</p>

              {(error.toLowerCase().includes("expired") ||
                error.toLowerCase().includes("invalid")) && (
                <button
                  onClick={() => navigate({ to: "/login" })}
                  className="text-red-500 underline text-sm"
                >
                  Request new reset link
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="wizard-input pr-12 h-[52px] leading-none hide-browser-eye"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
              />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition
                  ${
                    password && (focusedField === "password" || showPassword)
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }
                  text-slate-400 hover:text-slate-600 dark:hover:text-white`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="wizard-input pr-12 h-[52px] leading-none hide-browser-eye"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                required
              />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition
                  ${
                    confirmPassword &&
                    (focusedField === "confirm" || showConfirmPassword)
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }
                  text-slate-400 hover:text-slate-600 dark:hover:text-white`}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* PASSWORD INDICATOR */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded ${
                      isStrongPassword
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />

                  <div className="h-1 flex-1 rounded bg-gray-300 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full ${
                        !confirmPassword
                          ? "bg-gray-300 dark:bg-gray-700"
                          : isPrefixMatch
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: password.length
                          ? `${Math.min(
                              (confirmPassword.length / password.length) * 100,
                              100,
                            )}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Password Strength
                  </span>

                  <span
                    className={`${
                      !confirmPassword
                        ? "text-gray-500 dark:text-gray-400"
                        : isPrefixMatch
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  >
                    {!confirmPassword
                      ? "Password Match"
                      : isPrefixMatch
                        ? "Matching..."
                        : "Not Matching"}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLinkInvalid}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-500/30 transition-all"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
