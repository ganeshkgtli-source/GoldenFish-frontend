 
import { useNavigate } from "@tanstack/react-router";

import RegisterWizard from "../components/RegisterWizard";
import ThemeToggle from "../components/ThemeToggle";

import {
  useRegister,
  useResendOtp,
  useVerifyOtp,
} from "../hooks/useAuth";

import type { RegisterPayload } from "../api/authApi";
import {  useState } from "react";

/* ================= HELPERS ================= */

const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

/* ================= PAGE ================= */

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegister();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

const [registeredEmail, setRegisteredEmail] = useState(
  sessionStorage.getItem("verify_email") || ""
);
  /* ================= REGISTER ================= */
// useEffect(() => {
//   const saved = sessionStorage.getItem("verify_email");

//   if (saved) {
//     setRegisteredEmail(saved);
//   }
// }, []);
  const handleRegister = async (data: RegisterPayload) => {
    try {
      await registerMutation.mutateAsync(data);

      const email = normalizeEmail(data.email);
      setRegisteredEmail(email);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  };

  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = async (otp: string) => {
  if (!registeredEmail) {
    return {
      success: false,
      message: "Email not found. Please register again.",
    };
  }

  try {
    const res = await verifyMutation.mutateAsync({
      email: registeredEmail,
      otp,
    });

    // ✅ CHECK BACKEND RESPONSE
    if (res?.status === "error") {
      return {
        success: false,
        message: res.message || "Invalid OTP",
      };
    }

    // ✅ SUCCESS ONLY HERE
    sessionStorage.removeItem("verify_email");

    navigate({ to: "/signin" });

    return { success: true };

  } catch (err) {
    return {
      success: false,
      message: (err as Error).message,
    };
  }
};

  /* ================= RESEND OTP ================= */

  const handleResendOtp = async () => {
    if (!registeredEmail) {
      return {
        success: false,
        message: "No email found",
      };
    }

    try {
      await resendMutation.mutateAsync(registeredEmail);

      return {
        success: true,
        message: "OTP sent again",
      };
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
      <ThemeToggle variant="floating" />

      <RegisterWizard
        onSubmit={handleRegister}
        onVerifyOtp={handleVerifyOtp}
        onResend={handleResendOtp}
        loading={
          registerMutation.isPending ||
          verifyMutation.isPending ||
          resendMutation.isPending
        }
      />
    </div>
  );
}



 