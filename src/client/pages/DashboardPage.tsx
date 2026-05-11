import Navbar from "../components/NavBar";
import WatchlistSidebar from "../components/WatchlistSidebar";
import StatsCards from "../components/StatsCards";
import TodaysOrders from "../components/TodaysOrders";
import SectorPerformance from "../components/SectorPerformance";
import Footer from "../components/Footer";
import MarketClock from "../components/MarketClock";
import { X, ShieldAlert } from "lucide-react";
 import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);

  const [showKycPopup, setShowKycPopup] = useState(false);

  const [popupDelay, setPopupDelay] = useState(3000);
  console.log("USER:", user);
 useEffect(() => {

  if (
    user?.role?.toLowerCase() !== "user"
  ) return;

  if (
    user?.is_kyc_verified
  ) return;

  const timer = setTimeout(() => {

    setShowKycPopup(true);

  }, popupDelay);

  return () =>
    clearTimeout(timer);

}, [
  popupDelay,
  user,
]);
const handleClosePopup =
  () => {

    setShowKycPopup(false);

    // NEXT SHOW TIME
    setPopupDelay((prev) =>

      prev === 3000
        ? 10000
        : 30000
    );
};
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 bg-background border-b lg:border-b-0 lg:border-r border-border">
          <div className="w-full p-4 flex flex-col gap-4 overflow-y-auto">
            <div>
              <MarketClock />
            </div>
            <div className="p-2">
              <WatchlistSidebar />
            </div>

            <div className="p-2">
              <SectorPerformance />
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <StatsCards />

            <div className="p-4">
              <TodaysOrders />
            </div>
            <button
              onClick={async () => {
                const token = localStorage.getItem("access");

                const res = await fetch(
                  "http://127.0.0.1:8000/api/marketdata/",
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                const data = await res.json();
                console.log(data);
              }}
              className="bg-red-600 p-3 rounded-l"
            >
              Fetch Market Data
            </button>
          </div>

          <Footer />
        </main>
        
      </div>
      {/* KYC POPUP */}
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

          <ShieldAlert
            className="text-white"
            size={30}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">

          Verify Your KYC
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">

          Complete your KYC verification to unlock secure trading, deposits, withdrawals, and API access.
        </p>

        {/* WARNING BOX */}
        <div className="rounded-2xl border border-red-200/60 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3 mb-6">

          <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">

            Your account verification is still pending. Please complete KYC to continue using all platform features.
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
