import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  ShieldCheck,
  Upload,
  CreditCard,
  User,
  Landmark,
  FileText,
} from "lucide-react";

import { useKycVerification } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { parseError } from "../api/authApi";

export default function KycVerificationPage() {
const user =
  useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const kycMutation = useKycVerification();

  const [error, setError] = useState("");

const [form, setForm] = useState({

  aadhaar_number: "",

  pan_number: "",

  account_holder_name: "",

  account_number: "",

  ifsc_code: "",

  aadhaar_image: null as File | null,

  pan_image: null as File | null,
});

// =====================================================
// SUBMIT KYC
// =====================================================
const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  setError("");

  try {

    // ============================================
    // CREATE FORM DATA
    // ============================================
    const formData =
      new FormData();

    // ============================================
    // EMAIL
    // ============================================
    formData.append(
      "email",
      user?.email || ""
    );

    // ============================================
    // KYC DETAILS
    // ============================================
    formData.append(
      "aadhaar_number",
      form.aadhaar_number
    );

    formData.append(
      "pan_number",
      form.pan_number
    );

    formData.append(
      "account_holder_name",
      form.account_holder_name
    );

    formData.append(
      "account_number",
      form.account_number
    );

    formData.append(
      "ifsc_code",
      form.ifsc_code
    );

    // ============================================
    // AADHAAR IMAGE
    // ============================================
    if (form.aadhaar_image) {

      formData.append(
        "aadhaar_image",
        form.aadhaar_image
      );
    }

    // ============================================
    // PAN IMAGE
    // ============================================
    if (form.pan_image) {

      formData.append(
        "pan_image",
        form.pan_image
      );
    }

    // ============================================
    // DEBUG LOG
    // ============================================
    console.log(
      "===== KYC FORMDATA ====="
    );

    for (
      const pair
      of formData.entries()
    ) {

      console.log(
        pair[0],
        pair[1]
      );
    }

    // ============================================
    // API CALL
    // ============================================
    await kycMutation.mutateAsync(
      formData
    );

    // ============================================
    // SUCCESS NAVIGATION
    // ============================================
    navigate({
      to: "/dashboard",
      replace: true,
    });

  } catch (err: unknown) {

  console.error(err);

  setError(
    parseError(err) ||
    "Failed to submit KYC"
  );
}
};
  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
    <ThemeToggle variant="floating" />
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-10 text-white">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                KYC Verification
              </h1>

              <p className="text-red-100 mt-1">
                Complete verification to continue trading
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">

          {/* ERROR */}
          {error && (

            <div className="mb-6 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Aadhaar */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <FileText className="w-4 h-4" />

                  Aadhaar Number
                </label>

                <input
                  type="text"
                  maxLength={12}
                  value={form.aadhaar_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aadhaar_number:
                        e.target.value,
                    })
                  }
                  placeholder="Enter Aadhaar Number"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <Upload className="w-4 h-4" />

                  Aadhaar Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aadhaar_image:
                        e.target.files?.[0] || null,
                    })
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>
            </div>

            {/* PAN */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <CreditCard className="w-4 h-4" />

                  PAN Number
                </label>

                <input
                  type="text"
                  maxLength={10}
                  value={form.pan_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pan_number:
                        e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="ABCDE1234F"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <Upload className="w-4 h-4" />

                  PAN Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pan_image:
                        e.target.files?.[0] || null,
                    })
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <User className="w-4 h-4" />

                  Account Holder Name
                </label>

                <input
                  type="text"
                  value={form.account_holder_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      account_holder_name:
                        e.target.value,
                    })
                  }
                  placeholder="Enter Account Holder Name"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                  <Landmark className="w-4 h-4" />

                  Account Number
                </label>

                <input
                  type="text"
                  value={form.account_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      account_number:
                        e.target.value,
                    })
                  }
                  placeholder="Enter Account Number"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
                  required
                />
              </div>
            </div>

            {/* IFSC */}
            <div>

              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">

                <Landmark className="w-4 h-4" />

                IFSC Code
              </label>

              <input
                type="text"
                value={form.ifsc_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ifsc_code:
                      e.target.value.toUpperCase(),
                  })
                }
                placeholder="SBIN0001234"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={kycMutation.isPending}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {kycMutation.isPending
                ? "Submitting KYC..."
                : "Submit Verification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}