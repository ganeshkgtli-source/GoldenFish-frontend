import { memo } from "react";

import Field from "../Field";
import type { FormState } from "../RegisterWizard";
import StrengthBars from "@/features/user/components/profile/StrengthBars";
 

interface Props {
  form: FormState;

  setForm: React.Dispatch<
    React.SetStateAction<FormState>
  >;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

function StepSecurityComponent({
  form,
  handleChange,
  setForm,
}: Props) {
  const hasDhanAccount =
    form.has_dhan_account;

  const isPrefixMatch =
    form.confirm_password &&
    form.password.startsWith(
      form.confirm_password,
    );

  const isStrongPassword =
    form.password.length >= 8 &&
    /[a-z]/.test(form.password) &&
    /[A-Z]/.test(form.password) &&
    /[0-9]/.test(form.password) &&
    /[^A-Za-z0-9]/.test(
      form.password,
    );

  const exactMatch =
    form.password ===
    form.confirm_password;

  const matchPct = form.password.length
    ? Math.min(
        100,
        Math.round(
          (form.confirm_password.length /
            form.password.length) *
            100,
        ),
      )
    : 0;

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Account Security
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a strong password to protect
          your account
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
        <StrengthBars
          isStrong={isStrongPassword}
          exactMatch={exactMatch}
          partialMatch={Boolean(
            isPrefixMatch,
          )}
          matchPct={matchPct}
          confirmPassword={
            form.confirm_password
          }
          newPassword={form.password}
        />
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Do you have a Dhan trading account?
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                has_dhan_account: true,
                account_type: null,
              }));
            }}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
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

                <p className="mt-1 text-xs text-gray-500">
                  Continue with API setup
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                has_dhan_account: false,
                account_type: null,
              }));
            }}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
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

                <p className="mt-1 text-xs text-gray-500">
                  Redirect to Dhan signup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasDhanAccount === true && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Account Type
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  account_type:
                    "INDIVIDUAL",
                }))
              }
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                form.account_type ===
                "INDIVIDUAL"
                  ? "border-green-500 bg-green-500/10 ring-2 ring-green-400/40"
                  : "border-green-400/40 bg-green-500/5 hover:bg-green-500/10"
              }`}
            >
              <div className="text-sm font-semibold text-green-400">
                INDIVIDUAL Account
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Full API setup required
              </p>
            </div>

            <div
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  account_type: "AP",
                  api_key: "",
                  api_secret: "",
                }))
              }
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                form.account_type ===
                "AP"
                  ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-400/40"
                  : "border-blue-400/40 bg-blue-500/5 hover:bg-blue-500/10"
              }`}
            >
              <div className="text-sm font-semibold text-blue-400">
                API Account
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Only Client ID required
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StepSecurity = memo(
  StepSecurityComponent,
);

export default StepSecurity;