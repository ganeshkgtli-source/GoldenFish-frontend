import { CreditCard, User } from "lucide-react";

import type { ProfileResponse } from "@/features/user/api/profileApi";
import SectionCard from "@/features/user/components/profile/SectionCard";
import Field from "@/features/user/components/profile/Field";

const SUBSCRIPTION_STATS = [
  { label: "Strategies", value: "10" },
  { label: "Clients", value: "50" },
  { label: "Alerts", value: "∞" },
];

type Props = {
  data?: ProfileResponse;
};

export default function OverviewSection({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Details */}
      <SectionCard title="Profile Details" icon={<User size={16} />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={data?.user?.username} />

          <Field label="Email" value={data?.user?.email} />

          <Field label="Mobile" value={data?.user?.phone} />

          <Field label="PAN" value="DZX****41M" />

          <Field label="UCC" value={data?.dhan_client_ucc} copy />

          <Field label="CKYC No" value="XXXXXXXX" />
        </div>
      </SectionCard>

      {/* Subscription */}
      <SectionCard title="Subscription" icon={<CreditCard size={16} />}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-400/5 border border-red-500/20">
          <div>
            <p className="font-semibold">Pro Plan</p>

            <p className="text-sm text-muted-foreground mt-0.5">
              Renews on 31 May 2026
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
            Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {SUBSCRIPTION_STATS.map((f) => (
            <div
              key={f.label}
              className="rounded-xl bg-muted px-3 py-3 text-center"
            >
              <p className="text-lg font-bold">{f.value}</p>

              <p className="text-xs text-muted-foreground mt-0.5">{f.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
