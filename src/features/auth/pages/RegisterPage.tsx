import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import RegisterWizard from "../components/RegisterWizard";
import OtpVerification from "../components/OtpVerification";
import ThemeToggle from "../components/ThemeToggle";

import {
  useRegister,
  useVerifyOtp,
} from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const registerMutation = useRegister();
  const verifyMutation = useVerifyOtp();

  const handleRegister = async (data: any) => {
    await registerMutation.mutateAsync(data);

    setEmail(data.email);
    setShowOtp(true);
  };

  const handleVerifyOtp = async (otp: string) => {
    const res = await verifyMutation.mutateAsync({
      email,
      otp,
    });

    localStorage.setItem(
      "access",
      res.tokens.access
    );

    localStorage.setItem(
      "refresh",
      res.tokens.refresh
    );

    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020B1F] flex items-center justify-center px-4">
      <ThemeToggle />

      {!showOtp ? (
        <RegisterWizard
          onSubmit={handleRegister}
          loading={registerMutation.isPending}
        />
      ) : (
        <OtpVerification
          email={email}
          onVerify={handleVerifyOtp}
          loading={verifyMutation.isPending}
        />
      )}
    </div>
  );
}