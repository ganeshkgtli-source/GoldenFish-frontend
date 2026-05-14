import { useEffect, useState } from "react";
import {
  useProfile,
  useChangePassword,
  useSendOtp,
  useVerifyOtpPassword,
  useUpdateApi,
} from "@/features/user/hooks/useProfile";
import {
  User,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
  Copy,
  Shield,
  // TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  //  ChevronRight, RefreshCw, LogOut,
  Building2,
  CreditCard,
  //  BarChart3, Wallet,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

/* ─── TYPES ───────────────────────────────────────────────── */

type PasswordFieldProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  setShow: (v: boolean) => void;
  label?: string;
};

type ApiResponse = {
  force_logout?: boolean;
  [key: string]: unknown;
};

/* ─── HELPER — copy to clipboard ─────────────────────────── */
const copyText = (val?: string) => {
  if (!val) return;
  navigator.clipboard.writeText(val);
  toast.success("Copied!", { autoClose: 1200 });
};

/* ════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function Profile() {
  const { data, isLoading } = useProfile();

  /* — API credentials state — */
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassword, setApiPassword] = useState("");

  /* — Password / OTP state — */
  const [step, setStep] = useState<"password" | "otp">("password");
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const canResend = resendTimer <= 0;
  /* — Active section tab — */
  const [activeSection, setActiveSection] = useState<
    "overview" | "security" | "api" | "account"
  >("overview");

  /* — Mutations — */
  const changePasswordMutation = useChangePassword();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtpPassword();
  const updateApiMutation = useUpdateApi();

  /* — Password strength — */
  const isStrong =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  // const isPrefixMatch = !!confirmPassword && newPassword.startsWith(confirmPassword);
  const exactMatch = newPassword === confirmPassword;

  const partialMatch =
    confirmPassword.length < newPassword.length &&
    newPassword.startsWith(confirmPassword);

  const matchPct = partialMatch
    ? Math.round((confirmPassword.length / newPassword.length) * 100)
    : 0;

  /* — OTP countdown — */
  useEffect(() => {
    if (resendTimer <= 0) return;

    const t = setTimeout(() => {
      setResendTimer((n) => n - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ── HANDLERS ────────────────────────────────────────────── */

  const doForceLogout = (res: ApiResponse) => {
    if (res?.force_logout) {
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/signin";
      }, 2500);
    }
  };

  const handleUpdateApi = () => {
    if (!apiKey || !apiSecret || !apiPassword) {
      toast.error("All fields required ❌");
      return;
    }
    updateApiMutation.mutate(
      { api_key: apiKey, api_secret: apiSecret, password: apiPassword },
      {
        onSuccess: () => {
          toast.success("API credentials updated ✅");
          setIsEditingApi(false);
          setApiKey("");
          setApiSecret("");
          setApiPassword("");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update API ❌");
        },
      },
    );
  };

  const handleSendOtp = () => {
    sendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("OTP sent to your email 📩");
        setStep("otp");
        setResendTimer(60);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to send OTP");
      },
    });
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }
    changePasswordMutation.mutate(
      {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password updated ✅ Logging you out…");
          doForceLogout(res);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update password ❌");
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      toast.error("Enter a valid 6-digit OTP ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }
    verifyOtpMutation.mutate(
      {
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success("Password changed ✅ Logging you out…");
          doForceLogout(res);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Invalid OTP ❌");
        },
      },
    );
  };

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1   mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── HERO CARD ─────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
          {/* gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* avatar + identity */}
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                    {isLoading
                      ? "?"
                      : (data?.user?.username?.[0]?.toUpperCase() ?? "U")}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold truncate">
                    {isLoading ? "Loading…" : (data?.user?.username ?? "—")}
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Mail size={13} className="flex-shrink-0" />
                    <span className="truncate">{data?.user?.email ?? "—"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Phone size={13} className="flex-shrink-0" />
                    {data?.user?.phone ?? "—"}
                  </p>
                </div>
              </div>

              {/* stat pills */}
              <div className="flex flex-wrap gap-3">
                <StatPill
                  icon={<CreditCard size={14} />}
                  label="Client ID"
                  value={data?.user?.client_id ?? "—"}
                />
                <StatPill
                  icon={<Clock size={14} />}
                  label="Member Since"
                  value="May 2024"
                />
                <StatPill
                  icon={<Activity size={14} />}
                  label="Last Login"
                  value="Today"
                />
              </div>
            </div>

            {/* mini perf strip */}
            {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Today's P&L",   value: "+₹1,240",  color: "text-green-500" },
                { label: "Open Positions", value: "5",        color: "text-blue-400"  },
                { label: "Orders Today",   value: "12",       color: "text-foreground"},
                { label: "Margin Used",    value: "₹52,400",  color: "text-yellow-500"},
              ].map(p => (
                <div key={p.label} className="rounded-xl bg-muted/50 border border-border px-4 py-3">
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${p.color}`}>{p.value}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* ── SECTION TABS ──────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto scrollbar-hide">
          {(
            [
              { key: "overview", label: "Overview", icon: <User size={15} /> },
              {
                key: "account",
                label: "Account",
                icon: <Building2 size={15} />,
              },
              { key: "api", label: "API Keys", icon: <Key size={15} /> },
              {
                key: "security",
                label: "Security",
                icon: <Shield size={15} />,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center
                ${
                  activeSection === tab.key
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {activeSection === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Details */}
            <SectionCard title="Profile Details" icon={<User size={16} />}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" value={data?.user?.username} />
                <Field label="Email" value={data?.user?.email} />
                <Field label="Mobile" value={data?.user?.phone} />
                <Field label="PAN" value="DZX****41M" />
                <Field label="UCC" value={data?.dhan_client_ucc} copy />
                <Field label="CKYC No" value="XXXXXXXX" />
              </div>
            </SectionCard>

            {/* Trading Summary */}
            {/* <SectionCard title="Trading Summary" icon={<TrendingUp size={16} />}>
              <div className="space-y-3">
                {[
                  { label: "Total Trades This Month", value: "84",        bar: 84  },
                  { label: "Win Rate",                 value: "67%",       bar: 67  },
                  { label: "Max Drawdown",             value: "₹3,200",   bar: 32  },
                  { label: "Avg Profit/Trade",         value: "₹148",     bar: 55  },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-semibold">{r.value}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-700"
                        style={{ width: `${r.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard> */}

            {/* Subscription */}
            <SectionCard title="Subscription" icon={<CreditCard size={16} />}>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-400/5 border border-red-500/20">
                <div>
                  <p className="font-semibold">Pro Plan</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Renews on 31 May 2026
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { label: "Strategies", value: "10" },
                  { label: "Clients", value: "50" },
                  { label: "Alerts", value: "∞" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl bg-muted px-3 py-3 text-center"
                  >
                    <p className="text-lg font-bold">{f.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            {/* <SectionCard title="Quick Actions" icon={<BarChart3 size={16} />}>
              <div className="space-y-2">
                {[
                  { label: "View Trading History",  icon: <BarChart3 size={15} />,  action: () => {} },
                  { label: "Download P&L Report",   icon: <Wallet size={15} />,     action: () => {} },
                  { label: "Refresh Broker Session",icon: <RefreshCw size={15} />,  action: () => {} },
                  { label: "Logout All Devices",    icon: <LogOut size={15} />,     action: () => {} },
                ].map(a => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted hover:bg-accent border border-transparent hover:border-border transition text-sm group"
                  >
                    <span className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                      {a.icon} {a.label}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </SectionCard> */}
          </div>
        )}

        {/* ── ACCOUNT ──────────────────────────────────────── */}
        {activeSection === "account" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* BROKER DETAILS */}
            <SectionCard
              title="Broker Details"
              icon={<Building2 size={16} />}
              className="min-w-[320px]"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="Broker" value="Dhan" />
                <Field label="Depository" value="CDSL" />
                <Field label="Demat ID" value="1208340039511866" copy />
                <Field label="Exchanges" value="BSE / NSE" />
                <Field label="Segment" value="EQ / F&O" />
                <Field label="Status" value="Active ✓" />
              </div>
            </SectionCard>

            {/* LINKED BANK */}
            <SectionCard
              title="Linked Bank"
              icon={<CreditCard size={16} />}
              className="min-w-[320px]"
            >
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="text-blue-400" size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">HDFC Bank</p>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• 4821
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      IFSC: HDFC0001234
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    Verified
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── API KEYS ─────────────────────────────────────── */}
        {activeSection === "api" && (
          <div className="  mx-auto space-y-4">
            <SectionCard title="API Credentials" icon={<Key size={16} />}>
              {!isEditingApi ? (
                <div className="space-y-3">
                  <SecretRow
                    label="API Key"
                    value={data?.user?.api_key}
                    show={showApiKey}
                    onToggle={() => setShowApiKey((p) => !p)}
                    onCopy={() => copyText(data?.user?.api_key)}
                  />
                  <SecretRow
                    label="API Secret"
                    value={data?.user?.api_secret}
                    show={showApiSecret}
                    onToggle={() => setShowApiSecret((p) => !p)}
                    onCopy={() => copyText(data?.user?.api_secret)}
                  />

                  <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <AlertCircle
                      size={14}
                      className="text-yellow-500 flex-shrink-0"
                    />
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Never share your API credentials. Rotate them immediately
                      if compromised.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditingApi(true)}
                    className="w-full mt-2 py-2.5 rounded-xl border border-red-500/40 text-red-500 text-sm font-medium hover:bg-red-500/10 transition"
                  >
                    Update API Credentials
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enter your new credentials. Your account password is
                    required to confirm.
                  </p>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      New API Key
                    </label>
                    <input
                      className="wizard-input "
                      placeholder="api_key_xxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      New API Secret
                    </label>
                    <input
                      className="wizard-input "
                      placeholder="api_secret_xxxxxxxxxxxx"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                    />
                  </div>
                  <div>
                    {/* w-full px-3 py-2.5 rounded-xl border border-border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-red-500 */}
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Account Password
                    </label>
                    <input
                      type="password"
                      className="wizard-input "
                      placeholder="Your account password"
                      value={apiPassword}
                      onChange={(e) => setApiPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleUpdateApi}
                      disabled={updateApiMutation.isPending}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                    >
                      {updateApiMutation.isPending ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingApi(false);
                        setApiKey("");
                        setApiSecret("");
                        setApiPassword("");
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ── SECURITY ─────────────────────────────────────── */}
        {activeSection === "security" && (
          <div className=" mx-auto  max-w-4xl space-y-4">
            <SectionCard title="Change Password" icon={<Shield size={16} />}>
              {/* PASSWORD STEP */}
              {step === "password" && (
                <div className="space-y-3   ">
                  <PasswordField
                    value={oldPassword}
                    onChange={setOldPassword}
                    placeholder="Current Password"
                    show={showOld}
                    setShow={setShowOld}
                    label="Current Password"
                  />
                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="New Password"
                    show={showNew}
                    setShow={setShowNew}
                    label="New Password"
                  />
                  <PasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                    label="Confirm Password"
                  />

                  {/* <StrengthBars isStrong={isStrong} isPrefixMatch={isPrefixMatch} confirmPassword={confirmPassword} newPassword={newPassword} /> */}
                  <StrengthBars
                    isStrong={isStrong}
                    exactMatch={exactMatch}
                    partialMatch={partialMatch}
                    matchPct={matchPct}
                    confirmPassword={confirmPassword}
                    newPassword={newPassword}
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {changePasswordMutation.isPending
                      ? "Updating…"
                      : "Update Password"}
                  </button>

                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={sendOtpMutation.isPending}
                    className="w-full py-2.5 rounded-xl border border-border text-sm hover:bg-muted disabled:opacity-50 transition"
                  >
                    {sendOtpMutation.isPending
                      ? "Sending OTP…"
                      : "Change via OTP instead"}
                  </button>
                </div>
              )}

              {/* OTP STEP */}
              {step === "otp" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
                    OTP sent to your registered email. Enter it below.
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      One-Time Password
                    </label>
                    <input
                      className="wizard-input"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="New Password"
                    show={showNew}
                    setShow={setShowNew}
                    label="New Password"
                  />
                  <PasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm Password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                    label="Confirm Password"
                  />

                  {/* <StrengthBars
                    isStrong={isStrong}
                    isPrefixMatch={isPrefixMatch}
                    confirmPassword={confirmPassword}
                    newPassword={newPassword}
                  /> */}
                  <StrengthBars
                    isStrong={isStrong}
                    exactMatch={exactMatch}
                    partialMatch={partialMatch}
                    matchPct={matchPct}
                    confirmPassword={confirmPassword}
                    newPassword={newPassword}
                  />

                  <button
                    onClick={handleVerifyOtp}
                    disabled={
                      !otp || otp.length < 6 || verifyOtpMutation.isPending
                    }
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {verifyOtpMutation.isPending
                      ? "Verifying…"
                      : "Verify & Change Password"}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {canResend
                        ? "Didn't receive it?"
                        : `Resend in ${resendTimer}s`}
                    </span>
                    <button
                      onClick={handleSendOtp}
                      disabled={!canResend || sendOtpMutation.isPending}
                      className={`font-medium transition ${canResend ? "text-red-500 hover:underline" : "text-muted-foreground cursor-not-allowed"}`}
                    >
                      {sendOtpMutation.isPending ? "Sending…" : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    onClick={() => setStep("password")}
                    className="w-full py-2 rounded-xl border border-border text-sm hover:bg-muted transition text-muted-foreground"
                  >
                    ← Back to password
                  </button>
                </div>
              )}
            </SectionCard>

            {/* Security checklist */}
            {/* <SectionCard title="Security Checklist" icon={<CheckCircle2 size={16} />}>
              <div className="space-y-2">
                {[
                  { label: "Email Verified",       done: true  },
                  { label: "Phone Verified",        done: true  },
                  { label: "2FA Enabled",           done: false },
                  { label: "API Key Configured",    done: !!data?.api_key },
                  { label: "Broker Session Active", done: true  },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border">
                    <span className="text-sm">{item.label}</span>
                    {item.done
                      ? <CheckCircle2 size={16} className="text-green-500" />
                      : <AlertCircle  size={16} className="text-yellow-500" />}
                  </div>
                ))}
              </div>
            </SectionCard> */}
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold border-b border-border pb-3">
        <span className="text-red-500">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground leading-none">{label}</p>
        <p className="font-semibold leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  copy,
}: {
  label: string;
  value?: string;
  copy?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{value || "—"}</span>
        {copy && value && (
          <button
            onClick={() => copyText(value)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

function SecretRow({
  label,
  value,
  show,
  onToggle,
  onCopy,
}: {
  label: string;
  value?: string;
  show: boolean;
  onToggle: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-xl border border-border gap-3">
      <span className="text-sm text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-mono flex-1 truncate text-center">
        {show ? (value ?? "—") : "••••••••••••••••"}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground transition"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground transition"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  placeholder,
  show,
  setShow,
  label,
}: PasswordFieldProps) {
  return (
    <div>
      {label && (
        <label className="text-xs text-muted-foreground mb-1 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="wizard-input "
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// function StrengthBars({
//   isStrong,
//   isPrefixMatch,
//   confirmPassword,
//   newPassword,
// }: {
//   isStrong: boolean;
//   isPrefixMatch: boolean;
//   confirmPassword: string;
//   newPassword: string;
// }) {
//   const matchPct = newPassword.length
//     ? Math.min((confirmPassword.length / newPassword.length) * 100, 100)
//     : 0;

//   const strength = !newPassword.length
//     ? 0
//     : newPassword.length < 6
//       ? 1
//       : newPassword.length < 8
//         ? 2
//         : isStrong
//           ? 4
//           : 3;

//   const bars = [
//     strength >= 1
//       ? strength === 1
//         ? "bg-red-500"
//         : strength === 2
//           ? "bg-yellow-500"
//           : "bg-green-500"
//       : "bg-muted",
//     strength >= 2
//       ? strength === 2
//         ? "bg-yellow-500"
//         : "bg-green-500"
//       : "bg-muted",
//     strength >= 3 ? "bg-green-500" : "bg-muted",
//     strength >= 4 ? "bg-green-500" : "bg-muted",
//   ];

//   const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

//   return (
//     <div className="space-y-2">
//       <div className="flex gap-1">
//         {bars.map((b, i) => (
//           <div
//             key={i}
//             className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${b}`}
//           />
//         ))}
//       </div>
//       <div className="flex justify-between text-xs">
//         <span className="text-muted-foreground">
//           {strength > 0 && (
//             <span
//               className={
//                 strength <= 1
//                   ? "text-red-500"
//                   : strength === 2
//                     ? "text-yellow-500"
//                     : "text-green-500"
//               }
//             >
//               {strengthLabel}
//             </span>
//           )}
//           {strength === 0 && "Password strength"}
//         </span>
//         {/* {confirmPassword && (
//           <span className={isPrefixMatch ? "text-green-500" : "text-red-500"}>
//             {Math.round(matchPct)}% match
//           </span>
//         )} */}
//         {confirmPassword && (
//           <span
//             className={
//               matchPct === 100
//                 ? "text-green-500"
//                 : isPrefixMatch
//                   ? "text-yellow-500"
//                   : "text-red-500"
//             }
//           >
//             {matchPct === 100
//               ? "Passwords match"
//               : isPrefixMatch
//                 ? `${Math.round(matchPct)}% match`
//                 : "Passwords do not match"}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }
function StrengthBars({
  isStrong,
  exactMatch,
  partialMatch,
  matchPct,
  confirmPassword,
  newPassword,
}: {
  isStrong: boolean;
  exactMatch: boolean;
  partialMatch: boolean;
  matchPct: number;
  confirmPassword: string;
  newPassword: string;
}) {
  /* ================= PASSWORD STRENGTH ================= */

  const strength = !newPassword.length
    ? 0
    : newPassword.length < 6
      ? 1
      : newPassword.length < 8
        ? 2
        : isStrong
          ? 4
          : 3;

  const bars = [
    strength >= 1
      ? strength === 1
        ? "bg-red-500"
        : strength === 2
          ? "bg-yellow-500"
          : "bg-green-500"
      : "bg-muted",

    strength >= 2
      ? strength === 2
        ? "bg-yellow-500"
        : "bg-green-500"
      : "bg-muted",

    strength >= 3 ? "bg-green-500" : "bg-muted",

    strength >= 4 ? "bg-green-500" : "bg-muted",
  ];

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  /* ================= UI ================= */

  return (
    <div className="space-y-2">
      {/* STRENGTH BARS */}
      <div className="flex gap-1">
        {bars.map((b, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${b}`}
          />
        ))}
      </div>

      {/* LABELS */}
      <div className="flex justify-between text-xs">
        {/* LEFT */}
        <span className="text-muted-foreground">
          {strength > 0 ? (
            <span
              className={
                strength <= 1
                  ? "text-red-500"
                  : strength === 2
                    ? "text-yellow-500"
                    : "text-green-500"
              }
            >
              {strengthLabel}
            </span>
          ) : (
            "Password strength"
          )}
        </span>

        {/* RIGHT */}
        {confirmPassword && (
          <span
            className={
              exactMatch
                ? "text-green-500"
                : partialMatch
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {exactMatch
              ? "Passwords match"
              : partialMatch
                ? `${matchPct}% match`
                : "Passwords do not match"}
          </span>
        )}
      </div>
    </div>
  );
}
