import { useState } from "react";
import {
  TrendingUp,
  Mail,
  User,
  Lock,
  Key,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import api from "@/lib/api";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onVerifyOtp?: (otp: string) => Promise<void>;
  loading: boolean;
  initialEmail?: string;
}
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function RegisterWizard({
  onSubmit,
  onVerifyOtp,
  loading,
  initialEmail = "",
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: initialEmail,
    phone: "",
    password: "",
    confirmPassword: "",
    client_id: "",
    api_key: "",
    api_secret: "",
    terms: false,
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Security", icon: Lock },
    { number: 3, title: "API Setup", icon: Key },
  ];

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
      if (!form.phone.startsWith("+91")) {
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
      if (!form.password || !form.confirmPassword) {
        setError("Please fill in all security fields");
        return false;
      }

      if (form.password !== form.confirmPassword) {
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
      if (!form.client_id || !form.api_key || !form.api_secret) {
        setError("Please fill in all API credentials");
        return false;
      }

      if (!form.terms) {
        setError("Please accept Terms & Conditions");
        return false;
      }
    }

    return true;
  };
  const checkUserExists = async (email: string, phone: string) => {
    const res = await api.post("/check-user-exists/", {
      email,
      phone: phone.replace(/^\+91/, ""),
      // phone,
    });

    return res.data;
  };
  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 1) {
      try {
        const res = await checkUserExists(form.email, form.phone);

        if (res.exists) {
          setError(res.message);
          return;
        }
      } catch {
        setError("Failed to validate user details");
        return;
      }
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
    if (!validateStep()) return;

    try {
      setError("");
      setSuccess("");

      const { confirmPassword, ...payload } = form;

      await onSubmit({
  ...payload,
  phone: payload.phone.replace(/^\+91/, ""),
});

      setShowOtp(true);
      setSuccess("OTP sent to your email 📩");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setError("");
      setSuccess("");

      if (onVerifyOtp) {
        await onVerifyOtp(otp);
      }

      setSuccess("Email verified successfully ✅");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "OTP verification failed");
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
              TimeLine
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
                          } else {
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
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={handleChange}
                    />

                    <Field
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />

                    {form.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
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

                          <div className="h-1 flex-1 rounded bg-gray-300 overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{
                                width: `${
                                  form.password.length
                                    ? (() => {
                                        let matchedChars = 0;

                                        for (
                                          let i = 0;
                                          i < form.confirmPassword.length;
                                          i++
                                        ) {
                                          if (
                                            form.confirmPassword[i] ===
                                            form.password[i]
                                          ) {
                                            matchedChars++;
                                          } else {
                                            break;
                                          }
                                        }

                                        return (
                                          (matchedChars /
                                            form.password.length) *
                                          100
                                        );
                                      })()
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Password Strength</span>
                          <span>Password Match</span>
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
                        API Configuration
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Dhan trading account
                      </p>
                    </div>

                    <Field
                      label="Client ID"
                      name="client_id"
                      placeholder="Enter your Dhan Client ID"
                      value={form.client_id}
                      onChange={handleChange}
                    />
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

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={form.terms}
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

              <div className="px-6 sm:px-10 py-6 bg-gray-50 dark:bg-gray-800/50 border-t flex justify-between">
                <button onClick={handleBack} disabled={currentStep === 1}>
                  <ChevronLeft className="inline w-4 h-4" /> Back
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-500/30"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
                  >
                    {loading ? "Processing..." : "Complete Registration"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="px-6 sm:px-10 py-12">
              <div className="text-center mb-8">
                <Mail className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Verify Your Email</h3>
                <p className="text-sm text-gray-500">{form.email}</p>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full border rounded-lg p-4 text-center text-2xl"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full mt-4"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          )}
        </div>

        {!showOtp && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="#" className="text-red-600 font-medium">
                Sign in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
      />
    </div>
  );
}
