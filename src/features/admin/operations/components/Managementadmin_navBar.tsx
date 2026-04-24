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
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
    { label: "Clients", icon: Users, to: "/admin/clients" },
    { label: "Add Clients", icon: UserPlus, to: "/admin/add" },
    { label: "Order Logs", icon: FileText, to: "/admin/orders" },
    { label: "Error Logs", icon: AlertTriangle, to: "/admin/errors" },
  ];

  return (
    <header className="bg-background border-b border-border antialiased ">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-border bg-card flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-red-500 rotate-45" />
          </div>
          <span className="text-red-500 font-semibold text-base md:text-lg">
            GoldenFish
          </span>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden xl:flex items-center gap-4">
          {navItems.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to + "/");

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
  relative group flex items-center gap-2 px-2 py-2
  text-[14px] tracking-wide transition-all duration-200

  ${active ? "text-blue-500 font-semibold" : "text-gray-400 hover:text-white"}
`}
              >
                <item.icon
                  size={16}
                  className={
                    active
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-white"
                  }
                />
                {item.label}

                {/* 🔥 UNDERLINE */}
                <span
                  className={`
                    absolute left-0 -bottom-[4px] h-[2px] w-full bg-blue-500
                    origin-left transition-transform duration-300
                    ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }
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
            <span className="text-sm text-muted-foreground">Admin</span>
          </div>

          {/* LOGOUT */}
          <button
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-blue-500/10 text-red-500 border border-blue-500/20 hover:bg-blue-500/20 transition"
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-2 bg-card border border-border rounded-xl p-3">
            {navItems.map((item) => {
              const active =
                pathname === item.to || pathname.startsWith(item.to + "/");

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                    ${active ? "text-blue-500" : "text-muted-foreground"}
                  `}
                >
                  <item.icon
                    size={16}
                    className={
                      active
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-white"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}

            {/* PROFILE */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted mt-2">
              <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs">
                <Shield size={14} className="text-gray-400" />
              </div>
              Admin
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg
  bg-muted text-red-500 hover:bg-red-600/10 hover:text-red-600 transition"
            >
              <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                <LogOut size={14} className="text-red-500" />
              </div>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
