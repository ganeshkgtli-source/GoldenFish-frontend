import { useParams } from "@tanstack/react-router";
import { useClient } from "../hooks/useClients";

export default function ClientDetailPage() {
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useClient(id!);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">{data.username}</h1>

      <div className="mt-4 space-y-2">
        <p>Email: {data.email}</p>
        <p>Phone: {data.phone}</p>
        <p>Joined: {data.date_joined}</p>
      </div>
    </div>
  );
}