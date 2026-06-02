import { UserRound } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";

import PersonalStep from "../components/registration/PersonalStep";
import AadhaarStep from "../components/registration/AadhaarStep";
import PanStep from "../components/registration/PanStep";
import BankStep from "../components/registration/BankStep";

export default function AlgoSmartEdgeRegistrationPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center  py-8 px-4">
      <ThemeToggle variant="floating" />

      <div className="w-full max-w-4xl">
        <div
          className="
            rounded-[28px]
            border
            border-slate-200
            dark:border-slate-800

            bg-white
            dark:bg-slate-900

            shadow-xl

          
            md:p-12
          "
        >
          {/* Header */}
          <div className="flex justify-center gap-4 mb-10">
            <div
              className="
                h-14
                w-14

                rounded-full

                bg-red-500

                flex
                items-center
                justify-center

                shadow-lg
                shadow-red-500/30
              "
            >
              <UserRound
                size={28}
                className="text-white"
              />
            </div>

            <div>
              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold

                  text-slate-900
                  dark:text-white
                "
              >
                Create Your Account
              </h1>

              <p
                className="
                  mt-1
                  text-sm

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Please fill in the details below to
                register
              </p>
            </div>
          </div>

          {/* Personal */}
          <PersonalStep />

          {/* Aadhaar */}
          <AadhaarStep />

          {/* PAN */}
          <PanStep />

          {/* Bank */}
          <BankStep />

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="
                  mt-1
                  h-4
                  w-4

                  accent-red-600
                "
              />

              <span
                className="
                  text-sm

                  text-slate-600
                  dark:text-slate-400
                "
              >
                I accept the{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-red-600
                    hover:text-red-700
                    font-medium
                  "
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-red-600
                    hover:text-red-700
                    font-medium
                  "
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              className="
                w-full
                h-14

                rounded-xl

                bg-gradient-to-r
                from-red-500
                to-red-600

                hover:from-red-600
                hover:to-red-700

                text-white
                text-lg
                font-semibold

                transition-all
                duration-200

                shadow-lg
                shadow-red-500/20
              "
            >
              Sign Up
            </button>
          </div>

          {/* Login */}
          <div className="mt-6 text-center">
            <p
              className="
                text-sm

                text-slate-500
                dark:text-slate-400
              "
            >
              Already have an account?{" "}
              <a
                href="/signin"
                className="
                  text-red-600
                  hover:text-red-700
                  font-semibold
                "
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}