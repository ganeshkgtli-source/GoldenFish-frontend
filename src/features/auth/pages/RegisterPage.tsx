import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import RegisterWizard from "../components/RegisterWizard";
import ThemeToggle from "../components/ThemeToggle";

import {
  useRegister,
  useResendOtp,
  useVerifyOtp,
} from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegister();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [registeredEmail, setRegisteredEmail] = useState("");

  /* ================= RESEND OTP ================= */
 const handleResendOtp = async () => {
  if (!registeredEmail) return null;

  const data = await resendMutation.mutateAsync(registeredEmail);
  return data; // ✅ explicit return
};
  /* ================= REGISTER ================= */
  const handleRegister = async (data: any) => {
    try {
      await registerMutation.mutateAsync(data);
      setRegisteredEmail(data.email.trim().toLowerCase());
    } catch (err) {
      throw err;
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (otp: string) => {
    if (!registeredEmail) {
      throw new Error("Email not found. Please register again.");
    }

    await verifyMutation.mutateAsync({
      email: registeredEmail,
      otp,
    });

    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
      
      {/* THEME BUTTON */}
      <ThemeToggle variant="floating" />

      {/* CONTENT */}
      <RegisterWizard
        onSubmit={handleRegister}
        onVerifyOtp={handleVerifyOtp}
        onResend={handleResendOtp}
        loading={
          registerMutation.isPending ||
          verifyMutation.isPending
        }
      />
    </div>
  );
}