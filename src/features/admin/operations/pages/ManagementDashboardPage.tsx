import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "@tanstack/react-router";

export default function ManagementDashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col justify-between p-4">
        
        <div>
          <h2 className="text-xl font-bold mb-6">Management Admin</h2>

          <nav className="space-y-2">
            <SidebarItem label="Dashboard" onClick={() => navigate({ to: "/admin/dashboard" })} />
            <SidebarItem label="Client Details" onClick={() => navigate({ to: "/admin/clients" })} />
            <SidebarItem label="Add Client" onClick={() => navigate({ to: "/admin/clients/add" })} />
            <SidebarItem label="Logs" onClick={() => navigate({ to: "/admin/logs" })} />
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full px-3 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] transition"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <button
            onClick={() => navigate({ to: "/login" })}
            className="w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 flex flex-col">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Monitor client activity, orders, and system errors
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Clients" value="128" />
          <StatCard title="Orders Today" value="342" />
          <StatCard title="Errors" value="12" danger />
        </div>

        {/* ================= LOGS ================= */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex-1">
          <h3 className="font-semibold mb-3">Recent Activity</h3>

          <div className="space-y-2 text-sm">
            <p>✅ Client A placed an order</p>
            <p className="text-red-500">❌ API limit error (Client B)</p>
            <p className="text-yellow-500">⚠️ Network issue detected</p>
            <p>✅ Client C order executed</p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          © 2026 GoldenFish • Management Panel
        </footer>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--accent)] transition"
    >
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
      <h3 className="text-sm text-[var(--muted-foreground)]">{title}</h3>
      <p
        className={`text-2xl font-bold mt-2 ${
          danger ? "text-red-500" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}