import { createFileRoute } from "@tanstack/react-router";
import ClientListPage from "@/features/admin/clients/pages/ClientListPage";

export const Route = createFileRoute("/admin/clients")({
  component: ClientListPage,
});