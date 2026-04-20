import { TrendingUp, LogOut, User, Activity } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import ThemeToggle from "../../auth/components/ThemeToggle";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020B1F]">

      {/* ❌ REMOVED THEME TOGGLE FROM HERE */}

      {/* NAVBAR */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            TimeLine
          </h1>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {/* ✅ THEME TOGGLE INSIDE NAVBAR */}
          <ThemeToggle variant="inline" />

          <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <User className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* WELCOME CARD */}
        <div className="rounded-3xl p-8 mb-8 shadow-xl border border-slate-200 dark:border-slate-800 
          bg-gradient-to-br from-slate-100 via-white to-slate-200
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        ">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage your trading activity and monitor performance.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Active Sessions
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              3
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Running trading sessions
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Total Profit
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₹12,450
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Last 30 days
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Account Status
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              Active
            </p>
            <p className="text-sm text-slate-500 mt-1">
              All systems operational
            </p>
          </div>

        </div>

        {/* ACTION SECTION */}
        <div className="mt-10 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-4">
            <button className="wizard-primary-btn">
              Start Trading
            </button>

            <button className="wizard-secondary-btn">
              View Reports
            </button>

            <button className="wizard-secondary-btn">
              Manage API
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}