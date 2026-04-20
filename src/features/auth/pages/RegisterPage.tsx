import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import RegisterWizard from "../components/RegisterWizard";
import ThemeToggle from "../components/ThemeToggle";

import {
  useRegister,
  useVerifyOtp,
} from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegister();
  const verifyMutation = useVerifyOtp();

  // ✅ FIX: useState instead of let
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegister = async (data: any) => {
    console.log("📤 REGISTER PAYLOAD:", data);

    await registerMutation.mutateAsync(data);

    // ✅ store email properly
    setRegisteredEmail(data.email);
  };

  const handleVerifyOtp = async (otp: string) => {
    const res = await verifyMutation.mutateAsync({
      email: registeredEmail, // ✅ now correct
      otp,
    });

    localStorage.setItem("access", res.tokens.access);
    localStorage.setItem("refresh", res.tokens.refresh);

    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020B1F] flex items-center justify-center px-4">
      <ThemeToggle variant="floating" />

      <RegisterWizard
        onSubmit={handleRegister}
        onVerifyOtp={handleVerifyOtp}
        loading={
          registerMutation.isPending ||
          verifyMutation.isPending
        }
      />
    </div>
  );
}