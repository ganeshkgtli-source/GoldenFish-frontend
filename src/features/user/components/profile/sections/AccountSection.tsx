import { Building2, CheckCircle2, CreditCard } from "lucide-react";
import SectionCard from "@/features/user/components/profile/SectionCard";
import Field from "@/features/user/components/profile/Field";

export default function AccountSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* BROKER DETAILS */}
      <SectionCard
        title="Broker Details"
        icon={<Building2 size={16} />}
        className="min-w-[320px]"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Broker" value="Dhan" />

          <Field label="Depository" value="CDSL" />

          <Field label="Demat ID" value="1208340039511866" copy />

          <Field label="Exchanges" value="BSE / NSE" />

          <Field label="Segment" value="EQ / F&O" />

          <Field label="Status" value="Active ✓" />
        </div>
      </SectionCard>

      {/* LINKED BANK */}
      <SectionCard
        title="Linked Bank"
        icon={<CreditCard size={16} />}
        className="min-w-[320px]"
      >
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Building2 className="text-blue-400" size={20} />
            </div>

            <div>
              <p className="font-semibold">HDFC Bank</p>

              <p className="text-sm text-muted-foreground">
                •••• •••• •••• 4821
              </p>

              <p className="text-xs text-muted-foreground mt-0.5">
                IFSC: HDFC0001234
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />

            <span className="text-sm text-green-500 font-medium">Verified</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
