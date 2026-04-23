import { createFileRoute } from "@tanstack/react-router";
import ClientDetailPage from "@/features/admin/clients/pages/ClientDetailPage";

export const Route = createFileRoute("/admin/client/$id")({
  component: ClientDetailPage,
});