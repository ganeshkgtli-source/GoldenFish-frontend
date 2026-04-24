import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";

interface Props {
  email: string;
  loading: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend?: () => Promise<{ message?: string }>;
  title?: string;
  subtitle?: string;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");

  return `${mm}:${ss}`;
};
export default function OtpVerification({
  email,
  onVerify,
  loading,
  onResend,
  title,
  subtitle,
}: Props) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shake, setShake] = useState(false);
  //  const blockRef = useRef(false);

  const [blocked, setBlocked] = useState(false);

  const [timer, setTimer] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmittedOtp = useRef<string | null>(null);
  const resendLock = useRef(false);
  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  /* ================= TIMER FIX ================= */
  useEffect(() => {
    if (timer <= 0) {
      setTimer(0);

      // ✅ ADD THIS LINE
      setBlocked(false);

      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  /* ================= SUCCESS MESSAGE ================= */
  useEffect(() => {
    if (!success) return;

    const t = setTimeout(() => setSuccess(""), 2500);
    return () => clearTimeout(t);
  }, [success]);

  /* ================= INPUT ================= */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setError("");
    setSuccess("");

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

  /* ================= PASTE ================= */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");

    if (paste.length === 6) {
      setOtp(paste.split(""));
      lastSubmittedOtp.current = null;
      setTimeout(() => inputsRef.current[5]?.focus(), 0);
    }

    e.preventDefault();
  };

  /* ================= SHAKE ================= */
  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 400);
  };

  /* ================= VERIFY ================= */
  const handleVerify = async (code: string) => {
    if (blocked || loading) return;

    if (code.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      triggerShake();
      return;
    }

    try {
      const res = await onVerify(code);
      console.log("Verify response:", res);

      setSuccess("Verified successfully");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      const data = err?.response?.data;

      triggerShake();
      // setOtp(["", "", "", "", "", ""]);
      inputsRef.current[5]?.focus();

      // 🔥 BACKEND BLOCK HANDLING
      if (data?.blocked) {
        setBlocked(true);
        if (data.remaining_time) {
          setTimer(data.remaining_time);
        }
        setError("Too many attempts. Try later.");
        return;
      }

      // 🔥 NORMAL ERROR
      setError(data?.message || data?.error || "Invalid OTP");
    }
  };

  /* ================= AUTO VERIFY ================= */
  useEffect(() => {
    const code = otp.join("");

    if (
      code.length === 6 &&
      !loading &&
      !blocked &&
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
  }, [otp, loading, blocked, success]);

  /* ================= RESEND ================= */

  const handleResend = async () => {
    if (resendLock.current) return;
    resendLock.current = true;

    if (timer > 0) {
      setError(`Please wait ${formatTime(timer)} before requesting again`);
      resendLock.current = false;
      return;
    }

    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
    setBlocked(false);
    lastSubmittedOtp.current = null;

    try {
      const res = await onResend?.();
      console.log("Resend response:", res || "No response returned");

      // ✅ SUCCESS
      if (res) {
        setSuccess(res.message ?? "OTP sent");
      } else {
        setSuccess("OTP sent");
      }
      setTimer(30); // match backend cooldown (30s)

      inputsRef.current[0]?.focus();
    } catch (err: any) {
      const data = err?.response?.data;

      // =============================
      // 🔥 BLOCK (5 MIN)
      // =============================
      if (data?.blocked) {
        const seconds = Number(data?.remaining_time) || 300;

        setBlocked(true);
        setTimer(seconds);
        setError(
          `You're temporarily blocked. Try again after ${formatTime(seconds)}`,
        );
        return;
      }

      // =============================
      // 🔥 COOLDOWN (30 SEC)
      // =============================
      if (
        data?.message?.toLowerCase().includes("please wait") &&
        /\d+/.test(data.message)
      ) {
        const seconds =
          Number(data?.remaining_time) ||
          parseInt(data?.message?.match(/\d+/)?.[0] || "30");

        setTimer(seconds);
        setError(`Wait ${formatTime(seconds)} before retry`);
        return;
      }

      // =============================
      // 🔥 NORMAL ERROR
      // =============================
      setError(data?.message || "Failed to resend OTP");
    } finally {
      setTimeout(() => {
        resendLock.current = false;
      }, 300);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title || "Verify Your Email"}
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {subtitle || "Enter the 6-digit OTP sent to"}
        <span className="block text-gray-900 dark:text-white font-medium mt-1">
          {email.toLowerCase()}
        </span>
      </p>

      {(error || success) && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border
          ${success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
        >
          {success || error}
        </div>
      )}

      <div
        className={`flex justify-center gap-3 mb-4 ${shake ? "animate-shake" : ""}`}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit}
            disabled={blocked || loading}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            maxLength={1}
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

      <button
        onClick={() => handleVerify(otp.join(""))}
        disabled={loading || blocked || otp.join("").length !== 6}
        className="w-full py-3 bg-red-600 text-white rounded-lg"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-xs mt-4">
        Didn’t receive OTP?{" "}
        <span
          onClick={() => {
            if (blocked && timer > 0) {
              setError(
                `You're temporarily blocked. Try again after ${formatTime(timer)}`,
              );
              return;
            }
            if (timer > 0) {
              setError(
                `Please wait ${formatTime(timer)} before requesting again`,
              );
              return;
            }
            handleResend();
          }}
          className={`${
            blocked || timer > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 cursor-pointer hover:underline"
          }`}
        >
          {blocked && timer > 0
            ? `Blocked (${formatTime(timer)})`
            : timer > 0
              ? `Resend in ${formatTime(timer)}`
              : "Resend"}
        </span>
      </p>
    </div>
  );
}
