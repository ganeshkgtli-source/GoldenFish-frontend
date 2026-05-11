import {
  Moon,Sun,Menu,X,LayoutDashboard,LogOut,User,
  ChevronDown,
  BrainCircuit, PlusSquare, BarChart3, Settings2, Activity, ShieldCheck, CandlestickChart,

} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";

/* ─── NAV CONFIG ─────────────────────────────────────────── */

 
export const NAV_ITEMS = [{ label: "Dashboard", icon: LayoutDashboard, to: "/super-admin/dashboard" },
     { label: "Strategies", icon: BrainCircuit, to: "/super-admin/strategies" },
      { label: "Create Strategy", icon: PlusSquare, to: "/super-admin/createstrategies" },
       { label: "Backtesting", icon: BarChart3, to: "/super-admin/backtesting" }, 
       { label: "Live Trades", icon: CandlestickChart, to: "/super-admin/live-trades" }, 
       { label: "Execution Monitor", icon: Activity, to: "/super-admin/execution-monitor" },
        { label: "Risk Management", icon: ShieldCheck, to: "/super-admin/risk-management" }, 
        { label: "Strategy Settings", icon: Settings2, to: "/super-admin/strategy-settings" },
        //  { label: "Order Logs", icon: ClipboardList, to: "/super-admin/order-logs" }, 
        //  { label: "Error Logs", icon: AlertTriangle, to: "/super-admin/error-logs" }
        
        ] as const;
  
/* ─── TICKER DATA (static dummy — swap with real feed) ─── */
// const TICKER = [
//   { sym: "NIFTY",     val: "22,419.95", chg: "+0.42%" , up: true  },
//   { sym: "BANKNIFTY", val: "48,320.10", chg: "-0.18%",  up: false },
//   { sym: "SENSEX",    val: "73,851.40", chg: "+0.31%",  up: true  },
//   { sym: "FINNIFTY",  val: "21,105.25", chg: "+0.67%",  up: true  },
//   { sym: "MIDCPNIFTY",val: "10,922.70", chg: "-0.09%",  up: false },
// ];

/* ════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
export default function SANavbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);

  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate        = useNavigate();
  const logoutMutation  = useLogout();
  const user            = useAuthStore(s => s.user);

  /* — shadow on scroll — */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* — close menus on outside click — */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    // document.addEventListener("mousedown", onClick);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* — ESC close — */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setProfileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* — close mobile on route change — */
  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [pathname]);

  const handleLogout = () => {
    if (logoutMutation.isPending) return;
    logoutMutation.mutate();
  };

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <>
      {/* ══ TICKER STRIP ═══════════════════════════════════ */}
      {/* <div className="
        w-full overflow-hidden
        bg-card border-b border-border
        text-xs font-mono
        hidden lg:block
      ">
        <div className="flex animate-ticker whitespace-nowrap w-max">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 py-1.5 border-r border-border last:border-r-0">
              <span className="text-muted-foreground font-semibold tracking-widest">{t.sym}</span>
              <span className="text-foreground">{t.val}</span>
              <span className={t.up ? "text-green-500" : "text-red-500"}>
                {t.up ? "▲" : "▼"} {t.chg}
              </span>
            </span>
          ))}
        </div>
      </div> */}

      {/* ══ MAIN HEADER ════════════════════════════════════ */}
      <header className={`
        sticky top-0 z-50 w-full
        transition-all duration-300
        bg-background/90 backdrop-blur-xl
        border-b border-border
        ${scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.08)]" : ""}
      `}>
        <div className="h-15 flex items-center px-4 md:px-6   mx-auto w-full gap-4" style={{ height: "3.75rem" }}>

          {/* ── LOGO ─────────────────────────────────────── */}
          <button
            onClick={() => navigate({ to: "/super-admin/dashboard" })}
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="Go to dashboard"
          >
            {/* diamond mark */}
            <div className="relative w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center overflow-hidden
              group-hover:border-red-500/40 transition-colors duration-200">
              <div className="w-3.5 h-3.5 border-2 border-red-500 rotate-45 transition-transform duration-300 group-hover:rotate-[225deg]" />
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-200" />
            </div>
            <span className="text-red-500 font-bold text-base tracking-tight leading-none">
              Golden<span className="text-foreground">Fish</span>
            </span>
          </button>

          {/* ── CENTER NAV (desktop) ─────────────────────── */}
          <nav className="hidden lg:flex flex-1 justify-center" aria-label="Main navigation">
            <div className="flex items-center gap-0.5">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                      text-sm font-medium transition-all duration-150
                      ${active
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }
                    `}
                  >
                    <item.icon
                      size={15}
                      className={`flex-shrink-0 transition-colors duration-150 ${active ? "text-red-500" : ""}`}
                    />
                    {item.label}

                    {/* active pip */}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── RIGHT ACTIONS ────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* market pulse indicator */}
            {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">Market Open</span>
            </div> */}

            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="
                w-9 h-9 flex items-center justify-center rounded-xl
                bg-card border border-border
                hover:border-border/80 hover:bg-muted
                transition-all duration-150
              "
            >
              {theme === "dark"
                ? <Sun  size={15} className="text-yellow-400" />
                : <Moon size={15} className="text-slate-600"  />}
            </button>

            {/* ── PROFILE DROPDOWN ─────────────────────── */}
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className={`
                  flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                  border transition-all duration-150
                  ${profileOpen
                    ? "bg-muted border-border"
                    : "bg-card border-border hover:bg-muted"}
                `}
              >
                {/* avatar */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.username?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                  {user?.username ??  ""}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* dropdown */}
              {profileOpen && (
                <div className="
                  absolute right-0 top-[calc(100%+8px)] w-52
                  bg-card backdrop-blur-md border border-border rounded-2xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                  dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                  overflow-hidden
                  animate-in fade-in slide-in-from-top-2 duration-150
                ">
                  {/* user info header */}


                  {/* <div className="px-4 py-3 border-b border-border bg-muted/40">
                    <p className="text-sm font-semibold truncate">{user?.username ?? "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{user?.role ?? "user"}</p>
                  </div> */}

                  <div className="p-1.5 space-y-0.5">
                    <DropdownItem
                      icon={<User size={14} />}
                      label="My Profile"
                        // onClick={() => navigate({ to: "/admin/profile" })}
                      onClick={() => { setProfileOpen(false); navigate({ to: "/admin/profile" }); }}
                    />
                    {/* <DropdownItem
                      icon={<TrendingUp size={14} />}
                      label="Trading Summary"
                      onClick={() => { setProfileOpen(false); navigate({ to: "/dashboard" }); }}
                    /> */}
                  </div>

                  <div className="p-1.5 border-t border-border">
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      disabled={logoutMutation.isPending}
                      className="
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
                        text-sm text-red-600 dark:text-red-400
                        hover:bg-red-500/10 transition-colors duration-150
                        disabled:opacity-50
                      "
                    >
                      <LogOut size={14} />
                      {logoutMutation.isPending ? "Logging out…" : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* mobile hamburger */}
            <button
onClick={(e) => {
    e.stopPropagation();
    setMobileOpen((prev) => !prev);
  }}              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted transition-colors duration-150"
            >
              <div className="relative w-4 h-4">
                <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                  <X size={16} />
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}>
                  <Menu size={16} />
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE MENU ════════════════════════════════════ */}
      {/* backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* slide-down panel */}
      <div
        ref={mobileRef}
        className={`
          fixed top-[3.75rem] left-0 right-0 z-50 lg:hidden
          transition-all duration-300 ease-out
          ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}
        `}
      >
        <div className="mx-3 mt-2 rounded-2xl border border-border bg-card/98 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* user strip */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-muted/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.username ?? "User"}</p>
              {/* <p className="text-xs text-muted-foreground capitalize">{user?.role ?? "user"}</p> */}
            </div>
            {/* inline theme in mobile */}
            {/* <button
              onClick={toggleTheme}
              className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-background"
            >
              {theme === "dark"
                ? <Sun  size={14} className="text-yellow-400" />
                : <Moon size={14} />}
            </button> */}
          </div>

          {/* nav items */}
          <nav className="p-2 space-y-0.5">
            {NAV_ITEMS.map((item, idx) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-150
                    ${active
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"}
                  `}
                >
                  <item.icon
                    size={17}
                    className={`flex-shrink-0 ${active ? "text-red-500" : "text-muted-foreground"}`}
                  />
                  {item.label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* bottom actions */}
          <div className="p-2 border-t border-border space-y-1 pb-3">
            <button
              onClick={() => { setMobileOpen(false); navigate({ to: "/admin/profile" }); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-muted transition-colors duration-150"
            >
              <User size={16} className="text-muted-foreground" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 font-medium transition-colors duration-150 disabled:opacity-50"
            >
              <LogOut size={16} />
              {logoutMutation.isPending ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ TICKER ANIMATION ══════════════════════════════ */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 28s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}

/* ─── DROPDOWN ITEM ──────────────────────────────────────── */
function DropdownItem({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
        text-sm text-foreground/80 hover:text-foreground
        hover:bg-muted transition-colors duration-150 text-left
      "
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  );
}

 