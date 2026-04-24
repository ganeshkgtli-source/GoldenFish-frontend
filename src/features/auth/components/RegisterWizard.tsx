import { useState } from "react";
import {
  TrendingUp,
  User,
  Lock,
  Key,
  Check,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "@/lib/api";
import OtpVerification from "./OtpVerification";
interface Props {
  onSubmit: (data: any) => Promise<void>;
  onVerifyOtp?: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  loading: boolean;
  initialEmail?: string;
  externalError?: string;
}
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function RegisterWizard({
  onSubmit,
  onVerifyOtp,
  loading,
  initialEmail = "",
  onResend,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: initialEmail,
    phone: "",
    password: "",
    confirm_password: "",
    client_id: "",
    api_key: "",
    api_secret: "",
    terms_accepted: false,
    account_type: null,
  });

  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasDhanAccount, setHasDhanAccount] = useState<boolean | null>(null);
  const [accountType, setAccountType] = useState<"AP" | "INDIVIDUAL" | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Security", icon: Lock },
    { number: 3, title: "API Setup", icon: Key },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    //     console.log(name, value, type, checked);
    //     console.log(form ,"data"
    // ,      typeof(checked)
    //     );
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const isPrefixMatch =
    form.confirm_password && form.password.startsWith(form.confirm_password);

  // const isExactMatch = form.password === form.confirm_password;

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
      if (accountType === "INDIVIDUAL") {
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

  const checkUserExists = async (
    username: string,
    email: string,
    phone: string,
  ) => {
    const res = await api.post("/check-user-exists/", {
      username,
      email,
      phone: phone.replace(/^\+91/, ""),
    });

    return res.data;
  };

  const handleNext = async () => {
    if (loading) return;
    if (!validateStep()) return;

    // 🔹 STEP 1 → check user exists
    if (currentStep === 1) {
      try {
        if (!form.phone) {
          setError("Phone number is required");
          return;
        }
        const res = await checkUserExists(
          form.username,
          form.email,
          form.phone,
        );

        if (res.exists) {
          setError(res.message);
          return;
        }
      } catch (error) {
        console.log(error);
        setError("Failed to validate user details");
        return;
      }
    }

    // 🔹 STEP 2 → dhan + account type logic
    if (currentStep === 2) {
      if (hasDhanAccount === null) {
        setError("Please select an option to continue");
        return;
      }
      if (hasDhanAccount === true) {
        if (!accountType) {
          setError("Please select account type");
          return;
        }

        setCurrentStep(3);
      } else {
        window.open("https://dhan.co/", "_blank");
        setError("Please create a Dhan account and come back to continue.");
      }

      return;

      return;
    }

    // 🔹 DEFAULT FLOW
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

    if (!validateStep()) return;
    setSubmitting(true);

    if (!accountType) {
      setError("Please select account type");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const { confirm_password, ...payload } = {
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      const cleanedPayload =
        accountType === "AP"
          ? {
              ...payload,
              api_key: "",
              api_secret: "",
            }
          : payload;
      // console.log("Submitting registration with payload:", cleanedPayload);
      await onSubmit({
        ...cleanedPayload,
        phone: payload.phone.replace(/^\+91/, ""),
        account_type: accountType,
      });

      setShowOtp(true);
      // setSuccess("OTP sent to your email 📩");
    } catch (err: any) {
      console.log("❌ REGISTER ERROR:", err?.response?.data);

      // setError(
      //   err?.response?.data?.message ||
      //     err?.response?.data?.detail ||
      //     "Registration failed",
      // );
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed",
      );
    } finally {
      setSubmitting(false); // ✅ ALWAYS reset
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
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {steps.map((step) => {
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

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Personal Information
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let's start with your basic details
                      </p>
                    </div>
                    <Field
                      label="Username"
                      name="username"
                      placeholder="Choose a unique username"
                      value={form.username}
                      onChange={handleChange}
                    />
                    <Field
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {/* <Field label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} /> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>

                      <PhoneInput
                        international
                        defaultCountry="IN"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(value) => {
                          const phone = value || "";

                          setForm((prev) => ({
                            ...prev,
                            phone,
                          }));

                          if (phone && !phone.startsWith("+91")) {
                            setError("Only Indian mobile numbers are accepted");
                          } else if (
                            error === "Only Indian mobile numbers are accepted"
                          ) {
                            setError("");
                          }
                        }}
                      />

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Only Indian mobile numbers are accepted
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Account Security
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create a strong password to protect your account
                      </p>
                    </div>

                    <Field
                      label="Password"
                      name="password"
                      type="password"
                      enableToggle
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={handleChange}
                    />

                    <Field
                      label="Confirm Password"
                      name="confirm_password"
                      type="password"
                      enableToggle
                      placeholder="Re-enter your password"
                      value={form.confirm_password}
                      onChange={handleChange}
                    />
                    {form.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {/* Password Strength */}
                          <div
                            className={`h-1 flex-1 rounded ${
                              form.password.length >= 8 &&
                              /[a-z]/.test(form.password) &&
                              /[A-Z]/.test(form.password) &&
                              /[0-9]/.test(form.password) &&
                              /[^A-Za-z0-9]/.test(form.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />

                          {/* Password Match Bar */}
                          <div className="h-1 flex-1 rounded bg-gray-300 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                !form.confirm_password
                                  ? "bg-gray-300"
                                  : isPrefixMatch
                                    ? "bg-green-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: form.password.length
                                  ? `${(form.confirm_password.length / form.password.length) * 100}%`
                                  : "0%",
                              }}
                            />
                          </div>
                        </div>

                        {/* Labels (Dynamic) */}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Password Strength
                          </span>

                          <span
                            className={`${
                              !form.confirm_password
                                ? "text-gray-500"
                                : isPrefixMatch
                                  ? "text-green-500"
                                  : "text-red-500"
                            }`}
                          >
                            {!form.confirm_password
                              ? "Password Match"
                              : isPrefixMatch
                                ? "Matching..."
                                : "Not Matching"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Dhan Account Selection (Clean Card UI - No Checkbox) */}
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Do you have a Dhan trading account?
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* YES CARD */}
                        <div
                          onClick={() => {
                            setHasDhanAccount(true);
                            setAccountType(null); // reset
                          }}
                          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200
      ${
        hasDhanAccount === true
          ? "border-green-500 bg-green-500/10 ring-2 ring-green-400/40"
          : "border-green-400/40 bg-green-500/5 hover:bg-green-500/10"
      }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold text-green-400">
                                Yes, I have one
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Continue with API setup
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* NO CARD */}
                        <div
                          onClick={() => {
                            setHasDhanAccount(false);
                            setAccountType(null);
                          }}
                          className={`cursor-pointer border rounded-xl p-4 transition-all duration-200
      ${
        hasDhanAccount === false
          ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-400/40"
          : "border-blue-400/40 bg-blue-500/5 hover:bg-blue-500/10"
      }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold text-blue-400">
                                No, create account
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Redirect to Dhan signup
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 🔥 ADD THIS BLOCK BELOW */}
                    {hasDhanAccount === true && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Select Account Type
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* INDIVIDUAL */}
                          <div
                            onClick={() => setAccountType("INDIVIDUAL")}
                            className={`cursor-pointer border rounded-xl p-4 transition-all duration-200
        ${
          accountType === "INDIVIDUAL"
            ? "border-green-500 bg-green-500/10 ring-2 ring-green-400/40"
            : "border-green-400/40 bg-green-500/5 hover:bg-green-500/10"
        }`}
                          >
                            <div className="text-sm font-semibold text-green-400">
                              INDIVIDUAL Account
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Full API setup required
                            </p>
                          </div>

                          {/* API */}
                          <div
                            onClick={() => {
                              setAccountType("AP");

                              setForm((prev) => ({
                                ...prev,
                                api_key: "",
                                api_secret: "",
                              }));
                            }}
                            className={`cursor-pointer border rounded-xl p-4 transition-all duration-200
        ${
          accountType === "AP"
            ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-400/40"
            : "border-blue-400/40 bg-blue-500/5 hover:bg-blue-500/10"
        }`}
                          >
                            <div className="text-sm font-semibold text-blue-400">
                              API Account
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Only Client ID required
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {accountType === "AP"
                          ? "Client ID Setup"
                          : "API Configuration"}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Dhan trading account
                      </p>
                    </div>

                    {/* ALWAYS SHOW */}
                    <Field
                      label="Client ID"
                      name="client_id"
                      placeholder="Enter your Dhan Client ID"
                      value={form.client_id}
                      onChange={handleChange}
                    />

                    {/* ONLY FOR INDIVIDUAL ACCOUNT */}
                    {accountType === "INDIVIDUAL" && (
                      <>
                        <Field
                          label="API Key"
                          name="api_key"
                          placeholder="Enter your API Key"
                          value={form.api_key}
                          onChange={handleChange}
                        />

                        <Field
                          label="API Secret"
                          name="api_secret"
                          type="password"
                          placeholder="Enter your API Secret"
                          value={form.api_secret}
                          onChange={handleChange}
                        />
                      </>
                    )}

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="terms_accepted"
                        checked={form.terms_accepted}
                        onChange={handleChange}
                        className="mt-1"
                      />

                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to the{" "}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 font-medium underline"
                        >
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 font-medium underline"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
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
            <OtpVerification
              email={form.email}
              loading={loading}
              onVerify={async (otp: string) => {
                setError("");
                setSuccess("");

                if (onVerifyOtp) {
                  await onVerifyOtp(otp);
                }
              }}
              onResend={async () => {
                try {
                  setError("");
                  setSuccess("");

                  if (!onResend) {
                    return { message: "No handler" }; // ✅ never return null
                  }

                  const res = await onResend();

                  return res ?? { message: "OTP sent" }; // ✅ fallback object
                } catch (err: any) {
                  setError(
                    err?.response?.data?.message ||
                      err?.response?.data?.detail ||
                      "Failed to resend OTP",
                  );

                  throw err; // ✅ keep error flow
                }
              }}
              title="Verify your email"
              subtitle="Enter the 6-digit OTP sent to your email"
            />
          )}
        </div>

        {!showOtp && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-red-600 font-medium">
                Sign in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, type, enableToggle = false, ...props }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          value={props.value || ""} // ✅ IMPORTANT FIX
          type={isPassword && showPassword ? "text" : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 h-[52px] leading-none ${
            enableToggle ? "pr-12 hide-browser-eye" : ""
          } bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500`}
        />

        {isPassword && enableToggle && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // ✅ FIX
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition-opacity duration-200
    ${
      props.value && (isFocused || showPassword)
        ? "opacity-100"
        : "opacity-0 pointer-events-none"
    }
    text-slate-500 dark:text-slate-200 hover:text-red-500`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
