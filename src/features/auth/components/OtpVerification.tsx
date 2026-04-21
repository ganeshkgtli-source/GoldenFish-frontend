import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";

interface Props {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  loading: boolean;
  onResend?: () => Promise<void>;
}

export default function OtpVerification({
  email,
  onVerify,
  loading,
  onResend,
}: Props) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const [blocked, setBlocked] = useState(false);
  const [resendBlocked, setResendBlocked] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmittedOtp = useRef<string | null>(null);

  // ✅ Auto focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // ⏱ Timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 🔓 unblock attempts
  useEffect(() => {
    if (blocked) {
      const t = setTimeout(() => {
        setBlocked(false);
        setAttempts(0);
      }, 5 * 60 * 1000);
      return () => clearTimeout(t);
    }
  }, [blocked]);

  // 🔓 unblock resend
  useEffect(() => {
    if (resendBlocked) {
      const t = setTimeout(() => {
        setResendBlocked(false);
        setResendCount(0);
      }, 5 * 60 * 1000);
      return () => clearTimeout(t);
    }
  }, [resendBlocked]);

  // ✨ success animation
  useEffect(() => {
    if (success) {
      setShowSuccess(true);

      const fade = setTimeout(() => setShowSuccess(false), 1500);
      const clear = setTimeout(() => {
        setSuccess("");
      }, 2000);

      return () => {
        clearTimeout(fade);
        clearTimeout(clear);
      };
    }
  }, [success]);

  // 🔢 Input change
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    if (error) setError("");
    if (success) setSuccess("");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    lastSubmittedOtp.current = null;

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ Better paste UX
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");

    if (paste.length === 6) {
      const split = paste.split("");
      setOtp(split);
      lastSubmittedOtp.current = null;

      setTimeout(() => {
        inputsRef.current[5]?.focus();
      }, 0);
    }

    e.preventDefault();
  };

  // 🔥 Shake trigger (smooth retrigger)
  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 400);
  };

  // 🔥 VERIFY
  const handleVerify = async (code: string) => {
    if (isVerifying || blocked) return;

    if (code.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await onVerify(code);

      setSuccess("Verified successfully ✅");
      setAttempts(0);

      // ✅ reset inputs after success
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      triggerShake();

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          "Invalid OTP"
      );

      if (newAttempts >= 5) setBlocked(true);
    } finally {
      setIsVerifying(false);
    }
  };

  // ⚡ AUTO VERIFY
  useEffect(() => {
    const code = otp.join("");

    if (
      code.length === 6 &&
      !loading &&
      !blocked &&
      !isVerifying &&
      !success &&
      code !== lastSubmittedOtp.current
    ) {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        lastSubmittedOtp.current = code;
        handleVerify(code);
      }, 500);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [otp, loading, blocked, isVerifying, success]);

  // 🔁 Resend
  const handleResend = async () => {
    if (timer > 0 || resendBlocked) return;

    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
    setAttempts(0);
    setBlocked(false);
    lastSubmittedOtp.current = null;

    const newCount = resendCount + 1;
    setResendCount(newCount);

    if (newCount >= 3) {
      setResendBlocked(true);
      setError("Too many resend attempts.");
      setTimer(0);
      return;
    }

    try {
      if (onResend) await onResend();

      setSuccess("New OTP sent 📩");
      setTimer(60);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
  <div>
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 text-center">

    <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6">
      <Mail className="w-8 h-8 text-red-500" />
    </div>

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Verify Your Email
    </h2>

    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
      Enter the 6-digit OTP sent to
      <span className="block text-gray-900 dark:text-white font-medium mt-1">
        {email.toLowerCase()}
      </span>
    </p>

    {/* 🔥 CENTERED WRAPPER (FIXES WIDTH ISSUE) */}
    <div className="flex justify-center">
      <div className="w-fit">

        {/* ERROR / SUCCESS */}
        {(error || success) && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border text-center
            ${
              success
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {success || error}
          </div>
        )}

        {/* OTP INPUTS (SHAKE ONLY HERE ✅) */}
        <div className={`flex justify-center gap-3 mb-4 ${shake ? "animate-shake" : ""}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              disabled={blocked || loading || isVerifying}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              maxLength={1}
              autoComplete="one-time-code"
              inputMode="numeric"
              className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold rounded-lg outline-none
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                border transition-all duration-200
                ${
                  error
                    ? "border-red-500 ring-2 ring-red-400/40"
                    : "border-gray-300 dark:border-gray-700"
                }
                focus:ring-2 focus:ring-red-500 focus:scale-105`}
            />
          ))}
        </div>

        {/* BUTTON (NO SHAKE ❌) */}
        <button
          type="button"
          onClick={() => handleVerify(otp.join(""))}
          disabled={loading || isVerifying || blocked || otp.join("").length !== 6}
          className="w-full mt-5 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-red-500/30 active:scale-95"
        >
          {blocked
            ? "Too many attempts"
            : loading || isVerifying
            ? "Verifying..."
            : "Verify OTP"}
        </button>

      </div>
    </div>

    {/* RESEND */}
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
      Didn’t receive OTP?{" "}
      <span
        onClick={!resendBlocked && timer === 0 ? handleResend : undefined}
        className={`font-medium ${
          resendBlocked
            ? "text-gray-500"
            : timer > 0
            ? "text-blue-400"
            : "text-blue-500 hover:text-blue-600 cursor-pointer"
        }`}
      >
        {resendBlocked
          ? "Blocked for 5 min"
          : timer > 0
          ? `Resend in ${timer}s`
          : "Resend"}
      </span>
    </p>

  </div>
</div>
  );
}