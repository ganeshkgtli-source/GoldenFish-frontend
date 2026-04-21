import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import RegisterWizard from "../components/RegisterWizard";
import ThemeToggle from "../components/ThemeToggle";

import {
  useRegister,
  useResendOtp,
  useVerifyOtp,
} from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegister();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [registeredEmail, setRegisteredEmail] = useState("");

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    if (!registeredEmail) return;

    // ❗ let errors bubble to OTP component
    await resendMutation.mutateAsync(registeredEmail);
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (data: any) => {
    try {
      await registerMutation.mutateAsync(data);

      // ✅ normalize email
      setRegisteredEmail(data.email.trim().toLowerCase());
    } catch (err) {
      // ❗ let RegisterWizard handle error
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

  // ✅ Redirect to login for full authentication
  navigate({ to: "/login" });
};

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020B1F] flex items-center justify-center px-4">
      <ThemeToggle variant="floating" />

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