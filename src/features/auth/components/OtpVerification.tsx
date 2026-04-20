import { useState } from "react";
import { Mail } from "lucide-react";

interface Props {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  loading: boolean;
}

export default function OtpVerification({
  email,
  onVerify,
  loading,
}: Props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    try {
      await onVerify(otp);
      // ❌ removed success (parent will redirect)

    } catch (err: any) {
      console.log("❌ OTP ERROR:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Invalid OTP. Please try again"
      );
    }
  };

  return (
    // ✅ ONLY ONE CARD (no outer wrapper)
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 text-center">

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Verify Your Email
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Enter the 6-digit OTP sent to
        <span className="block text-gray-900 dark:text-white font-medium mt-1">
          {email}
        </span>
      </p>

      {/* OTP Input */}
      <input
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 6)
          )
        }
        className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-semibold 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          border border-gray-300 dark:border-gray-700 
          rounded-lg outline-none 
          focus:ring-2 focus:ring-red-500 transition-all"
        placeholder="000000"
      />

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Success (only for resend) */}
      {success && (
        <div className="mt-4 p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          {success}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full mt-5 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-red-500/30"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {/* Resend */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Didn’t receive OTP?{" "}
        <span
          onClick={() =>
            setSuccess("New OTP sent to your email 📩")
          }
          className="text-red-600 hover:text-red-700 cursor-pointer font-medium"
        >
          Resend
        </span>
      </p>
    </div>
  );
}