import { useState } from "react";
import { Mail } from "lucide-react";

interface Props {
  email: string;
  onVerify: (otp: string) => void;
  loading: boolean;
}

export default function OtpVerification({
  email,
  onVerify,
  loading,
}: Props) {
  const [otp, setOtp] = useState("");

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10">
      <Mail className="w-12 h-12 mx-auto text-red-600 mb-4" />

      <h2 className="text-2xl font-bold text-center mb-2">
        Verify Email
      </h2>

      <p className="text-center text-sm mb-6">
        OTP sent to {email}
      </p>

      <input
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 6)
          )
        }
        className="wizard-input text-center text-2xl tracking-widest"
        placeholder="000000"
      />

      <button
        onClick={() => onVerify(otp)}
        className="wizard-primary-btn w-full mt-4"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}