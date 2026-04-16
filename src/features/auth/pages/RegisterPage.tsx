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

  let registeredEmail = "";

  const handleRegister = async (data: any) => {
    console.log("📤 REGISTER PAYLOAD:", data);
    await registerMutation.mutateAsync(data);

    registeredEmail = data.email;
  };

  const handleVerifyOtp = async (otp: string) => {
    const res = await verifyMutation.mutateAsync({
      email: registeredEmail,
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