import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  CreditCard,
  IndianRupee,
  Landmark,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AppLayout from "@/layouts/UserLayout";

import { useFundLimit, useOpenPositions } from "../hooks/useMarketData";

import Card from "../components/Card";
import TableCard from "../components/TableCard";

const transactions = [
  {
    title: "Funds Added",
    amount: "+₹50,000",
    time: "Today • 10:42 AM",
    type: "credit",
  },

  {
    title: "Withdrawal",
    amount: "-₹10,000",
    time: "Yesterday • 03:12 PM",
    type: "debit",
  },

  {
    title: "Brokerage Charges",
    amount: "-₹120",
    time: "04 May 2026",
    type: "debit",
  },

  {
    title: "Dividend Credit",
    amount: "+₹1,240",
    time: "02 May 2026",
    type: "credit",
  },
];

export default function MoneyPage() {
  const { data: fundData } = useFundLimit();
  const { data: positionsData } = useOpenPositions();

  return (
    <AppLayout sidebar={false}>
      {/* HEADER */}
      <div
        className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funds & Balance</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your trading balance, withdrawals and fund history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="
              h-11 px-5
              rounded-xl
              border border-border
              bg-card
              text-sm font-medium
              hover:bg-muted
              transition-colors
            "
          >
            Withdraw
          </button>

          <button
            className="
              h-11 px-5
              rounded-xl
              bg-emerald-500
              text-black
              text-sm font-semibold
              hover:opacity-90
              transition-opacity
              flex items-center gap-2
            "
          >
            <Plus size={16} />
            Add Funds
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        {/* AVAILABLE BALANCE */}
        <Card
          title="Available Balance"
          value={`₹${
            fundData?.data?.availabelBalance?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"
          }`}
          change="Ready for trading"
          icon={<Wallet size={20} />}
          color="blue"
        />

        {/* USED MARGIN */}
        <Card
          title="Used Margin"
          value={`₹${
            fundData?.data?.utilizedAmount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"
          }`}
          change={
            (fundData?.data?.utilizedAmount || 0) > 0
              ? "Margin utilized"
              : "No margin used"
          }
          icon={<IndianRupee size={20} />}
          color="orange"
        />

        {/* COLLATERAL */}
        <Card
          title="Collateral"
          value={`₹${
            fundData?.data?.collateralAmount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0.00"
          }`}
          change={
            (fundData?.data?.collateralAmount || 0) > 0
              ? "Collateral active"
              : "No collateral added"
          }
          icon={<Briefcase size={20} />}
          color="purple"
        />

        {/* TODAY'S PNL */}
        <Card
          title="Today's P&L"
          value={`${(positionsData?.TotalPnL || 0) >= 0 ? "+" : "-"}₹${Math.abs(
            positionsData?.TotalPnL || 0,
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change={
            (positionsData?.TotalPnL || 0) >= 0
              ? `+₹${Math.abs(positionsData?.TotalPnL || 0).toLocaleString(
                  "en-IN",
                )} profit today`
              : `-₹${Math.abs(positionsData?.TotalPnL || 0).toLocaleString(
                  "en-IN",
                )} loss today`
          }
          icon={<TrendingUp size={20} />}
          color={(positionsData?.TotalPnL || 0) >= 0 ? "green" : "orange"}
        />
      </div>

      {/* MAIN GRID */}
      <div
        className="
          grid grid-cols-1
          xl:grid-cols-[1fr_360px]
          gap-6
        "
      >
        {/* LEFT */}
        <div className="space-y-6">
          {/* FUND MANAGEMENT */}
          <TableCard
            title="Fund Management"
            subtitle="Add or withdraw funds instantly."
          >
            <div
              className="
                p-5
                grid grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {/* ADD MONEY */}
              <div
                className="
                  rounded-2xl
                  border border-border
                  bg-background
                  p-5
                "
              >
                <div
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-emerald-500/10
                    text-emerald-500
                    flex items-center justify-center
                  "
                >
                  <ArrowDownLeft size={20} />
                </div>

                <h3 className="mt-4 text-lg font-semibold">Add Money</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Instantly add money to your trading account.
                </p>

                <button
                  className="
                    mt-5 h-11 w-full
                    rounded-xl
                    bg-emerald-500
                    text-black
                    text-sm font-semibold
                    hover:opacity-90
                    transition-opacity
                  "
                >
                  Add Funds
                </button>
              </div>

              {/* WITHDRAW */}
              <div
                className="
                  rounded-2xl
                  border border-border
                  bg-background
                  p-5
                "
              >
                <div
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-red-500/10
                    text-red-500
                    flex items-center justify-center
                  "
                >
                  <ArrowUpRight size={20} />
                </div>

                <h3 className="mt-4 text-lg font-semibold">Withdraw Funds</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Transfer money directly to your bank account.
                </p>

                <button
                  className="
                    mt-5 h-11 w-full
                    rounded-xl
                    border border-border
                    bg-card
                    text-sm font-medium
                    hover:bg-muted
                    transition-colors
                  "
                >
                  Withdraw
                </button>
              </div>
            </div>
          </TableCard>

          {/* TRANSACTIONS */}
          <TableCard
            title="Recent Transactions"
            subtitle="Latest fund activities and settlements."
          >
            <div>
              {transactions.map((txn, i) => (
                <div
                  key={i}
                  className="
                      px-5 py-4
                      border-b border-border/60
                      flex items-center justify-between
                      hover:bg-muted/30
                      transition-colors
                    "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                          w-11 h-11
                          rounded-2xl
                          flex items-center justify-center
                          ${
                            txn.type === "credit"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }
                        `}
                    >
                      {txn.type === "credit" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>

                    <div>
                      <p className="font-medium">{txn.title}</p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {txn.time}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`
                        text-sm font-semibold
                        ${
                          txn.type === "credit"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }
                      `}
                  >
                    {txn.amount}
                  </p>
                </div>
              ))}
            </div>
          </TableCard>
        </div>

        {/* RIGHT */}
        <aside className="space-y-6">
          {/* BANK */}
          <TableCard
            title="Linked Bank"
            subtitle="Primary settlement account"
            actions={
              <div
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-blue-500/10
                  text-blue-500
                  flex items-center justify-center
                "
              >
                <Landmark size={20} />
              </div>
            }
          >
            <div className="p-5">
              <div
                className="
                  rounded-2xl
                  border border-border
                  bg-background
                  p-4
                "
              >
                <p className="font-semibold">HDFC Bank</p>

                <p className="text-sm text-muted-foreground mt-2">
                  •••• •••• •••• 4821
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  IFSC: HDFC0001234
                </p>
              </div>
            </div>
          </TableCard>

          {/* MARGIN */}
          <TableCard
            title="Margin Details"
            subtitle="Available trading limits"
            actions={
              <div
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-500
                  flex items-center justify-center
                "
              >
                <Wallet size={20} />
              </div>
            }
          >
            <div className="p-5 space-y-5">
              {[
                {
                  label: "Equity Margin",
                  value: "₹1,45,000",
                  width: "74%",
                  color: "bg-emerald-500",
                },

                {
                  label: "F&O Margin",
                  value: "₹68,000",
                  width: "52%",
                  color: "bg-blue-500",
                },

                {
                  label: "Commodity Margin",
                  value: "₹24,000",
                  width: "32%",
                  color: "bg-yellow-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full`}
                      style={{
                        width: item.width,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TableCard>

          {/* PAYMENTS */}
          <TableCard
            title="Payment Methods"
            subtitle="Saved payment options"
            actions={
              <div
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-violet-500/10
                  text-violet-500
                  flex items-center justify-center
                "
              >
                <CreditCard size={20} />
              </div>
            }
          >
            <div className="p-5 space-y-3">
              <div
                className="
                  rounded-2xl
                  border border-border
                  bg-background
                  px-4 py-4
                  flex items-center justify-between
                "
              >
                <div>
                  <p className="font-medium">UPI</p>

                  <p className="text-xs text-muted-foreground mt-1">gani@upi</p>
                </div>

                <span className="text-xs font-medium text-emerald-500">
                  Active
                </span>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-border
                  bg-background
                  px-4 py-4
                  flex items-center justify-between
                "
              >
                <div>
                  <p className="font-medium">Debit Card</p>

                  <p className="text-xs text-muted-foreground mt-1">
                    •••• 4821
                  </p>
                </div>

                <span className="text-xs font-medium text-emerald-500">
                  Active
                </span>
              </div>
            </div>
          </TableCard>
        </aside>
      </div>
    </AppLayout>
  );
}
