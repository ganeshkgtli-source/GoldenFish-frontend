import { useClients } from "../hooks/useClients";
import { useNavigate } from "@tanstack/react-router";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function ClientListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  

  /* 🔥 DEBOUNCE (IMPORTANT FIX) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useClients({
    page,
    search: debouncedSearch,
  });

  const clients = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 10);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  /* ✅ ONLY FIRST LOAD SHOW SKELETON */
  const isFirstLoad = isLoading && !data;

  if (isFirstLoad) {
    return (
      <div className="p-6">
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }
const getAvatarColor = (name: string = "") => {
  const colors = [
    "bg-red-500/10 text-red-500",
    "bg-blue-500/10 text-blue-500",
    "bg-green-500/10 text-green-500",
    "bg-yellow-500/10 text-yellow-500",
    "bg-purple-500/10 text-purple-500",
    "bg-pink-500/10 text-pink-500",
    "bg-indigo-500/10 text-indigo-500",
    "bg-orange-500/10 text-orange-500",
  ];

  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ManagementAdminNavbar />

      <main className="p-4 md:p-6 space-y-6 flex-1">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  {/* LEFT */}
  <div>
    <h1 className="text-xl font-semibold">Clients</h1>
    <p className="text-xs md:text-sm text-muted-foreground">
      Manage and monitor all your clients
    </p>
  </div>

  {/* CENTER PAGINATION */}
  <div className="flex justify-center order-3 md:order-2 w-full md:w-auto">
    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">

      {/* PREV */}
      <button
        disabled={!data?.previous}
        onClick={() => setPage((p) => p - 1)}
        className="px-2 py-1 text-xs rounded-md disabled:opacity-40 hover:bg-accent"
      >
        ←
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-2 py-1 text-xs rounded-md transition ${
            page === p
              ? "bg-red-600 text-white"
              : "hover:bg-accent text-muted-foreground"
          }`}
        >
          {p}
        </button>
      ))}

      {/* NEXT */}
      <button
        disabled={!data?.next}
        onClick={() => setPage((p) => p + 1)}
        className="px-2 py-1 text-xs rounded-md disabled:opacity-40 hover:bg-accent"
      >
        →
      </button>

    </div>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-3 w-full md:w-auto order-2 md:order-3">

    <div className="relative w-full md:w-64">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="
          w-full pl-9 pr-3 py-2 rounded-lg
          bg-white dark:bg-slate-800
          border border-border
          text-sm text-foreground
          placeholder:text-muted-foreground
          focus:outline-none
          focus:ring-2 focus:ring-red-500
        "
      />
    </div>

    <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium whitespace-nowrap">
      + Add Client
    </button>

  </div>
</div>

        {/* TABLE */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden ">
          <div className="overflow-x-auto">

            <div className="grid grid-cols-[140px_120px_120px_120px_100px] md:grid-cols-5 px-4 md:px-6 py-3 text-xs text-muted-foreground border-b border-border min-w-[600px]">
              <span>CLIENT</span>
              <span>CLIENT ID</span>
              <span>SUBSCRIPTION</span>
              <span>STATUS</span>
              <span className="text-right">ACTIONS</span>
            </div>

            <div className="divide-y divide-border">

              {clients.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  No clients found
                </div>
              )}

              {clients.map((client: any) => {
                const plan = client.subscription?.plan || "Basic";
                const isUserActive = client.is_active;

                return (
                  <div
                    key={client.id}
                    className="grid grid-cols-[140px_120px_120px_120px_100px] md:grid-cols-5 items-center px-4 md:px-6 py-4 hover:bg-muted transition min-w-[600px]"
                  >
                    <div className="flex items-center gap-3">
                      <div
  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(
    client.username
  )}`}
>
                        {client.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{client.username}</span>
                    </div>

                    <span className="text-muted-foreground">
                      {client.client_id || "--"}
                    </span>

                    <span className="text-xs px-3 py-1 rounded-full bg-muted">
                      {plan}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full w-fit ${
                        isUserActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {isUserActive ? "Active" : "Inactive"}
                    </span>

                    <div className="text-right">
                      <button
                        onClick={() =>
                          navigate({
                            to: "/admin/client/$id",
                            params: { id: String(client.id) },
                          })
                        }
                        className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

           

          </div>
        </div>

      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © 2026 GoldenFish • Management Panel
      </footer>
    </div>
  );
}