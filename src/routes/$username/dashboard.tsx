import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/* ================= ROUTE ================= */

export const Route = createFileRoute("/$username/dashboard")({
  beforeLoad: ({ params }) => {
    // 🔐 Must be logged in
    requireAuth();

    const user = useAuthStore.getState().user;

    // 🔒 Prevent accessing other users' dashboards
    if (!user || params.username !== user.username) {
      throw redirect({ to: "/" }); // better than throwing Error
    }
  },
  component: DashboardPage,
});

/* ================= API ================= */

const getDashboard = async (username: string) => {
  const res = await api.get(`/api/user/${username}/dashboard/`);
  return res.data;
};

/* ================= COMPONENT ================= */

function DashboardPage() {
  const { username } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", username],
    queryFn: () => getDashboard(username),
    enabled: !!username,
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Failed to load dashboard</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <p>
        Welcome, <strong>{data?.username || username}</strong>
      </p>

      <div style={{ marginTop: "20px" }}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}