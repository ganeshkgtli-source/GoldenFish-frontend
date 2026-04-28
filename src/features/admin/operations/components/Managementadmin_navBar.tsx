import {
  Users,
  UserPlus,
  FileText,
  AlertTriangle,
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  Shield,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { logout } from "@/lib/api";
import { userService } from "@/lib/auth";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // 🔥 stops refresh + clears tokens + role
    navigate({ to: "/login" }); // 🔁 redirect
  };
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
    { label: "Clients", icon: Users, to: "/admin/clients" },
    { label: "Add Clients", icon: UserPlus, to: "/admin/add" },
    { label: "Order Logs", icon: FileText, to: "/admin/orders" },
    { label: "Error Logs", icon: AlertTriangle, to: "/admin/errors" },
  ];
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    // ✅ set initial value
    setUsername(userService.get());

    // ✅ sync across tabs
    const sync = () => setUsername(userService.get());

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
 useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("#mobile-menu") && !target.closest("#menu-btn")) {
      setOpen(false);
    }
  };

  if (open) {
    window.addEventListener("click", handleClickOutside);
  }

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, [open]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  return (
    <header
      className="
  sticky top-0 z-50
  bg-background border-b border-border antialiased
"
    >
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* LEFT */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate({ to: "/admin/dashboard" })}
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-border bg-card flex items-center justify-center">
            <div className="w-4 h-4 border-2  border-red-500 rotate-45" />
          </div>

          <span className="text-red-500 font-semibold text-base md:text-lg">
            GoldenFish
          </span>
        </div>
        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to + "/");

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
    relative group inline-flex items-center  gap-2
    min-w-[110px] justify-center px-4 py-2 pb-2
    text-[14px] font-medium
    transition-colors duration-200

    ${
      active
        ? "text-black dark:text-white"
        : "text-muted-foreground hover:text-black dark:hover:text-white"
    }
  `}
              >
                {/* ICON */}
                <item.icon
                  size={16}
                  className={`
      transition-colors duration-200
      ${
        active
          ? "text-blue-500 dark:text-blue-400"
          : "text-muted-foreground group-hover:text-black dark:group-hover:text-white"
      }
    `}
                />

                {/* LABEL */}
                <span className="whitespace-nowrap truncate max-w-[100px]">{item.label}</span>

                {/* UNDERLINE */}
                <span
                  className={`
      absolute left-0 bottom-0 h-[2px] w-full
      bg-blue-500
      origin-left transform-gpu
      transition-transform duration-300
      ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
    `}
                />
              </Link>
            );
          })}
        </div>
        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full
            bg-card border border-border text-sm hover:bg-accent transition"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-yellow-400" />
            ) : (
              <Moon size={16} />
            )}
          </button>

          {/* PROFILE */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
              <Shield size={14} className="text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">{username}</span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-blue-500/10 text-red-500 border border-blue-500/20 hover:bg-blue-500/20 transition"
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* MOBILE MENU BUTTON */}
         <button
  onClick={(e) => {
    e.stopPropagation(); // ✅ VERY IMPORTANT
    setOpen((prev) => !prev);
  }}
  className="lg:hidden p-2 rounded-lg hover:bg-accent"
>   
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
{open && (
  <>
    {/* 🔥 SOLID BACKDROP */}
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-40 bg-black/70"
    />

    {/* 🔥 MENU PANEL */}
    <div
      id="mobile-menu"
      onClick={(e) => e.stopPropagation()}
      className="md:hidden absolute top-16 left-0 w-full z-50 px-4"
    >
      <div className="flex flex-col gap-2 bg-card border border-border rounded-xl p-3 shadow-xl backdrop-blur-md">

        {/* NAV ITEMS */}
        {navItems.map((item) => {
          const active =
            pathname === item.to || pathname.startsWith(item.to + "/");

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition

                ${
                  active
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <item.icon
                size={18}
                className={active ? "text-blue-500" : "text-gray-400"}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* PROFILE */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted">
            <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
              <Shield size={16} className="text-gray-400" />
            </div>
            <span className="text-sm text-muted-foreground truncate">
              {username}
            </span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="
              mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-lg

              bg-muted text-red-500
              hover:bg-red-500/10 hover:text-red-600

              transition
            "
          >
            <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
              <LogOut size={16} className="text-red-500" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

      </div>
    </div>
  </>
)}
    </header>
  );
}
