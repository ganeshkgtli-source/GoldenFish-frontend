import { lazy, Suspense, useState } from "react";
import { useSearch } from "@tanstack/react-router";
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
  Shield,
  Activity,
  Clock,
  Building2,
  CreditCard,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
 

import StatPill from "@/features/user/components/profile/StatPill";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import ProfileSectionSkeleton from "../components/skeletons/ProfileSectionSkeleton";
import ApiSectionSkeleton from "../components/skeletons/ApiSectionSkeleton";
import SecuritySectionSkeleton from "../components/skeletons/SecuritySectionSkeleton";

const OverviewSection = lazy(
  () => import("../components/profile/sections/OverviewSection"),
);

const AccountSection = lazy(() => import("../components/profile/sections/AccountSection"));

const ApiSection = lazy(() => import("../components/profile/sections/ApiSection"));

const SecuritySection = lazy(
  () => import("../components/profile/sections/SecuritySection"),
);
/* ─── TYPES ───────────────────────────────────────────────── */

const PROFILE_TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: <User size={15} />,
  },
  {
    key: "account",
    label: "Account",
    icon: <Building2 size={15} />,
  },
  {
    key: "api",
    label: "API Keys",
    icon: <Key size={15} />,
  },
  {
    key: "security",
    label: "Security",
    icon: <Shield size={15} />,
  },
] as const;

/* ════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function Profile() {
  const { data, isLoading } = useProfile();
  const search = useSearch({
    strict: false,
  });

  const initialSection = search?.section === "api" ? "api" : "overview";

  const [activeSection, setActiveSection] = useState<
    "overview" | "security" | "api" | "account"
  >(initialSection);

  /* — Mutations — */
  const changePasswordMutation = useChangePassword();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtpPassword();
  const updateApiMutation = useUpdateApi();
 
  // const subscriptionStats = useMemo(() => {
  //   return [
  //     {
  //       label: "Strategies",
  //       value: data?.subscription?.strategies ?? "0",
  //     },
  //     {
  //       label: "Clients",
  //       value: data?.subscription?.clients ?? "0",
  //     },
  //     {
  //       label: "Alerts",
  //       value: data?.subscription?.alerts ?? "0",
  //     },
  //   ];
  // }, [data?.subscription]);

  if (isLoading) {
  return <ProfileSkeleton />;
}

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    

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
                  value={`${data?.days_left?.joined_month ?? "—"} ${data?.days_left?.joined_year ?? "—"}`}
                />
                <StatPill
                  icon={<Activity size={14} />}
                  label="Last Login"
                  value="Today"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION TABS ──────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto scrollbar-hide">
          {PROFILE_TABS.map((tab) => (
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

      <Suspense
  fallback={
    activeSection === "overview" ? (
      <ProfileSectionSkeleton />
    ) : activeSection === "api" ? (
      <ApiSectionSkeleton />
    ) : activeSection === "security" ? (
      <SecuritySectionSkeleton />
    ) : (
      <ProfileSectionSkeleton />
    )
  }
>
  {activeSection === "overview" && (
    <OverviewSection data={data} />
  )}

  {activeSection === "account" && (
    <AccountSection />
  )}

  {activeSection === "api" && (
    <ApiSection
      data={data}
      updateApiMutation={updateApiMutation}
      editApi={
        search?.edit === true ||
        search?.edit === "true"
      }
    />
  )}

  {activeSection === "security" && (
    <SecuritySection
      changePasswordMutation={
        changePasswordMutation
      }
      sendOtpMutation={sendOtpMutation}
      verifyOtpMutation={
        verifyOtpMutation
      }
    />
  )}
</Suspense>
      </main>
 
  );
}
