import { useClients } from "../hooks/useClients";
import { useNavigate } from "@tanstack/react-router";
import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";

export default function ClientListPage() {
  const { data, isLoading } = useClients();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
            <ManagementAdminNavbar   />
      
      <h1 className="text-xl font-bold mb-4">Clients</h1>

      <div className="space-y-2">
        {data?.map((client: any) => (
          <div
            key={client.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <span>{client.username}</span>

            <button
              onClick={() =>
                navigate({
                  to: "/admin/client/$id",
                  params: { id: String(client.id) },
                })
              }
              className="text-blue-500"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}