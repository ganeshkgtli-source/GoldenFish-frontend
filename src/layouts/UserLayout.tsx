import {
  lazy,
  Suspense,
  memo,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { X, ShieldAlert } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import Footer from "@/features/user/components/Footer";

import Navbar from "@/features/user/components/NavBar";

 
import { useAuthStore } from "@/store/authStore";
import SidebarWidgetSkeleton from "@/features/user/components/skeletons/SidebarWidgetSkeleton";

/* ================= LAZY SIDEBAR WIDGETS ================= */

const MarketClock = lazy(
  () => import("@/features/user/components/MarketClock"),
);

const WatchlistSidebar = lazy(
  () => import("@/features/user/components/WatchlistSidebar"),
);

const SectorPerformance = lazy(
  () => import("@/features/user/components/SectorPerformance"),
);

/* ================= TYPES ================= */

type UserLayoutProps = {
  children: ReactNode;

  sidebar?: boolean;
};

/* ================= LAYOUT ================= */

function UserLayout({ children, sidebar = true }: UserLayoutProps) {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);

  const [showKycPopup, setShowKycPopup] = useState(false);

  const [popupDelay, setPopupDelay] = useState(3000);

  /* ================= KYC POPUP ================= */

  useEffect(() => {
    if (user?.role?.toLowerCase() !== "user") return;

    if (user?.is_kyc_verified) return;

    const timer = setTimeout(() => {
      setShowKycPopup(true);
    }, popupDelay);

    return () => clearTimeout(timer);
  }, [popupDelay, user]);

  const handleClosePopup = () => {
    setShowKycPopup(false);

    setPopupDelay((prev) => (prev === 3000 ? 10000 : 30000));
  };

  return (
    <div
      className="
        h-screen
        bg-background
        text-foreground
        flex flex-col
        overflow-hidden
      "
    >
      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* SIDEBAR */}
        {sidebar && (
          <aside
            className="
              hidden lg:flex
              lg:w-[320px]
              xl:w-[360px]
              shrink-0
              border-r border-border
              bg-background
            "
          >
            <div
              className="
                w-full
                overflow-y-auto
                p-4
                space-y-4
                scrollbar-hide
              "
              style={{
                contentVisibility: "auto",
              }}
            >
              {/* MARKET CLOCK */}
              <Suspense fallback={null}>
                <MarketClock />
              </Suspense>

              {/* WATCHLIST */}
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <SidebarWidgetSkeleton  />
                  </div>
                }
              >
                <div className="p-2">
                  <WatchlistSidebar />
                </div>
              </Suspense>

              {/* SECTOR PERFORMANCE */}
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <SidebarWidgetSkeleton  />
                  </div>
                }
              >
                <div className="p-2">
                  <SectorPerformance />
                </div>
              </Suspense>
            </div>
          </aside>
        )}

        {/* MAIN */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* PAGE CONTENT */}
          <div
            className="
              flex-1
              overflow-y-auto
              scrollbar-hide
            "
            style={{
              contentVisibility: "auto",
            }}
          >
            <div
              className="
                w-full
                px-4
                sm:px-6
                lg:px-8
                py-5
                space-y-6
              "
            >
              {children}
            </div>
          </div>

          {/* FOOTER */}
          <Footer />
        </main>
      </div>

      {/* ================= KYC POPUP ================= */}

      {showKycPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-red-200 dark:border-red-500/20 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-500/10 flex items-center justify-center transition-all"
            >
              <X size={16} />
            </button>

            {/* CONTENT */}
            <div className="p-8">
              {/* ICON */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-5 shadow-lg shadow-red-500/30">
                <ShieldAlert className="text-white" size={30} />
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Verify Your KYC
              </h2>

              {/* DESCRIPTION */}
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
                Complete your KYC verification to unlock secure trading,
                deposits, withdrawals, and API access.
              </p>

              {/* WARNING BOX */}
              <div className="rounded-2xl border border-red-200/60 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3 mb-6">
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                  Your account verification is still pending. Please complete
                  KYC to continue using all platform features.
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => {
                  navigate({
                    to: "/kyc_verification",
                  });
                }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/20 transition-all"
              >
                Verify KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(UserLayout);
