import { useState, lazy, Suspense } from "react";
import {
  TrendingUp,
  User,
  Lock,
  Key,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
// import api from "@/lib/api";
const OtpVerification = lazy(() => import("./OtpVerification"));
type ActionResponse = {
  success?: boolean;
  message?: string;
  status?: string;
};
interface Props {
  onSubmit: (data: RegisterPayload) => Promise<ActionResponse>;

  onVerifyOtp: (otp: string) => Promise<ActionResponse>;

  onResend?: () => Promise<ActionResponse>;

  loading: boolean;
  initialEmail?: string;
}

import { useCheckUserExists } from "../hooks/useAuth";

import StepPersonal from "./register/StepPersonal";
import StepSecurity from "./register/StepSecurity";
import StepApi from "./register/StepApi";

export type RegisterPayload = {
  username: string;
  email: string;
  phone: string;
  password: string;
  client_id: string;
  api_key?: string;
  api_secret?: string;
  account_type: "AP" | "INDIVIDUAL";
};

export type FormState = {
  username: string;
  email: string;

  phone: string;
  password: string;
  confirm_password: string;
  client_id: string;
  api_key: string;
  api_secret: string;
  terms_accepted: boolean;
  has_dhan_account: boolean | null;
  account_type: "AP" | "INDIVIDUAL" | null; // ✅ ADD THIS
};
type ApiError = {
  message?: string;
  error?: string;
};

const parseError = (err: unknown): string => {
  const e = err as { response?: { data?: ApiError } };

  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    (err as Error)?.message ||
    "Something went wrong"
  );
};
const STEPS = [
  { number: 1, title: "Personal Info", icon: User },
  { number: 2, title: "Security", icon: Lock },
  { number: 3, title: "API Setup", icon: Key },
];
export default function RegisterWizard({
  onSubmit,
  onVerifyOtp,
  loading,
  initialEmail = "",
  onResend,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const checkUserMutation = useCheckUserExists();
  const savedEmail = sessionStorage.getItem("verify_email") || "";

  const [form, setForm] = useState<FormState>({
    username: "",
    has_dhan_account: null,
    email: initialEmail || savedEmail,
    phone: "",
    password: "",
    confirm_password: "",
    client_id: "",
    api_key: "",
    api_secret: "",
    terms_accepted: false,
    account_type: null,
  });

  const [showOtp, setShowOtp] = useState(Boolean(savedEmail));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // const [hasDhanAccount, setHasDhanAccount] = useState<boolean | null>(null);
  // const [accountType, setAccountType] = useState<"AP" | "INDIVIDUAL" | null>(
  //   null,
  // );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
     
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 

  const validateStep = () => {
    setError("");

    if (currentStep === 1) {
      if (!form.username || !form.email || !form.phone) {
        setError("Please fill in all personal information");
        return false;
      }
      if (!form.phone || !form.phone.startsWith("+91")) {
        setError("Only Indian mobile numbers are accepted");
        return false;
      }

      const indianPhone = form.phone.replace("+91", "");

      if (!/^[6-9]\d{9}$/.test(indianPhone)) {
        setError("Only valid Indian mobile numbers are accepted");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!form.password || !form.confirm_password) {
        setError("Please fill in all security fields");
        return false;
      }

      if (form.password !== form.confirm_password) {
        setError("Passwords do not match");
        return false;
      }

      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }

      if (!/[a-z]/.test(form.password)) {
        setError("Password must contain at least one lowercase letter");
        return false;
      }

      if (!/[A-Z]/.test(form.password)) {
        setError("Password must contain at least one uppercase letter");
        return false;
      }

      if (!/[0-9]/.test(form.password)) {
        setError("Password must contain at least one number");
        return false;
      }

      if (!/[^A-Za-z0-9]/.test(form.password)) {
        setError("Password must contain at least one special character");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!form.client_id) {
        setError("Client ID is required");
        return false;
      }

      // ✅ ONLY for INDIVIDUAL
      if (form.account_type === "INDIVIDUAL") {
        if (!form.api_key || !form.api_secret) {
          setError("Please fill in all API credentials");
          return false;
        }
      }

      if (!form.terms_accepted) {
        setError("Please accept Terms & Conditions");
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (loading) return;

    setError("");

    if (!validateStep()) return;

    if (currentStep === 1) {
      try {
        const res = await checkUserMutation.mutateAsync({
          username: form.username,
          email: form.email,
          phone: form.phone.replace(/^\+91/, ""),
        });

        if (res.exists) {
          setError(res.message || "User already exists");
          return;
        }

        setCurrentStep(2);
      } catch (err) {
        setError(parseError(err));
      }
      return;
    }

    if (currentStep === 2) {
      if (form.has_dhan_account === null) {
        setError("Please select an option");
        return;
      }

      if (!form.has_dhan_account) {
        window.open("https://dhan.co/", "_blank");

        setError("Create Dhan account first");

        return;
      }

      if (!form.account_type) {
        setError("Select account type");

        return;
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };
  const handleSubmit = async () => {
    if (loading || submitting) return;

    setError("");
    setSuccess("");

    if (!validateStep()) return;

    if (!form.account_type) {
      setError("Please select account type");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        client_id: form.client_id,
        api_key: form.api_key,
        api_secret: form.api_secret,
        terms_accepted: form.terms_accepted,
      };

      const cleanedPayload =
        form.account_type === "AP"
          ? { ...payload, api_key: "", api_secret: "" }
          : payload;

      const res = await onSubmit({
        ...cleanedPayload,
        phone: payload.phone.replace(/^\+91/, ""),
        account_type: form.account_type,
      });

      if (res?.success !== false) {
        sessionStorage.setItem("verify_email", form.email.trim().toLowerCase());

        setShowOtp(true);
      } else {
        setError(res?.message || "Registration failed");
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 w-full max-w-md sm:max-w-lg md:max-w-xl">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Time Line
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Investments Pvt Ltd
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {!showOtp ? (
            <>
              {/* Progress Steps */}
              <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{
                        width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                      <div
                        key={step.number}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-red-600 text-white shadow-lg shadow-red-500/50"
                              : isCurrent
                                ? "bg-red-600 text-white shadow-lg shadow-red-500/50 scale-110"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>

                        <p
                          className={`mt-2 text-xs font-medium hidden sm:block ${
                            isCurrent || isCompleted
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 sm:px-10 py-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {success}
                    </p>
                  </div>
                )}

                {currentStep === 1 && (
                  <StepPersonal
                    form={form}
                    setForm={setForm}
                    error={error}
                    setError={setError}
                    handleChange={handleChange}
                  />
                )}

                {currentStep === 2 && (
                  <StepSecurity
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                  />
                )}

                {currentStep === 3 && (
                  <StepApi form={form} handleChange={handleChange} />
                )}
              </div>
              <div
                className="px-6 sm:px-10 py-6 bg-gray-50 dark:bg-gray-800/50 border-t 
flex items-center justify-between gap-3"
              >
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 transition shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div /> // keeps layout spacing balanced
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="
    flex items-center gap-1

    px-3 sm:px-5
    py-2  

    text-sm sm:text-base font-medium

    bg-red-600 hover:bg-red-700 text-white

    rounded-lg
    transition-all duration-200

    shadow-md shadow-red-500/20

    whitespace-nowrap
  "
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || submitting}
                    className="
    flex items-center justify-center

    px-4 sm:px-6
    py-2.5

    text-sm sm:text-base font-medium

    bg-red-600 hover:bg-red-700 text-white

    rounded-lg
    transition-all duration-200

    disabled:opacity-50 disabled:cursor-not-allowed

    shadow-md shadow-red-500/20

    whitespace-nowrap   /* 🔥 IMPORTANT */
  "
                  >
                    {loading ? "Processing..." : "Complete Registration"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                </div>
              }
            >
              <OtpVerification
                email={form.email.trim().toLowerCase()}
                loading={loading}
                onVerify={async (otp: string) => {
                  setError("");
                  setSuccess("");

                  return onVerifyOtp(otp);
                }}
                onResend={async () => {
                  try {
                    setError("");

                    if (!onResend) return { message: "No handler" };

                    const res = await onResend();

                    return res ?? { message: "OTP sent" };
                  } catch (err) {
                    const message = parseError(err);
                    setError(message);

                    return { success: false, message };
                  }
                }}
                title="Verify your email"
                subtitle="Enter the 6-digit OTP sent to your email"
              />
            </Suspense>
          )}
        </div>

        {!showOtp && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/signin" className="text-red-600 font-medium">
                Sign in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
