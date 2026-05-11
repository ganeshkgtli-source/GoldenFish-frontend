import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
} from "lucide-react";
import Navbar from "../components/NavBar";
 

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

function MoneyCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold tracking-tight">
        {value}
      </h3>

      {sub && (
        <p className="mt-2 text-sm text-muted-foreground">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function MoneyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Funds & Balance
              </h1>

              <p className="text-sm text-muted-foreground mt-1">
                Manage your trading balance, withdrawals and fund history.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button className="h-11 px-5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                Withdraw
              </button>

              <button className="h-11 px-5 rounded-xl bg-emerald-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                <Plus size={16} />
                Add Funds
              </button>

            </div>

          </div>

          {/* BALANCE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <MoneyCard
              title="Available Balance"
              value="₹2,48,520"
              sub="Ready for trading"
            />

            <MoneyCard
              title="Used Margin"
              value="₹48,300"
              sub="Across positions"
            />

            <MoneyCard
              title="Collateral"
              value="₹1,20,000"
              sub="Margin collateral"
            />

            <MoneyCard
              title="Today's P&L"
              value="+₹12,430"
              sub="+2.41% today"
            />

          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

            {/* LEFT */}
            <div className="space-y-6">

              {/* FUND MANAGEMENT */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">

                <div className="px-5 py-5 border-b border-border">
                  <h2 className="text-lg font-semibold">
                    Fund Management
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Add or withdraw funds instantly.
                  </p>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* ADD FUNDS */}
                  <div className="rounded-2xl border border-border bg-background p-5">

                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ArrowDownLeft size={20} />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      Add Money
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Instantly add money to your trading account.
                    </p>

                    <button className="mt-5 h-11 w-full rounded-xl bg-emerald-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity">
                      Add Funds
                    </button>

                  </div>

                  {/* WITHDRAW */}
                  <div className="rounded-2xl border border-border bg-background p-5">

                    <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                      <ArrowUpRight size={20} />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      Withdraw Funds
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Transfer money directly to your bank account.
                    </p>

                    <button className="mt-5 h-11 w-full rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                      Withdraw
                    </button>

                  </div>

                </div>
              </div>

              {/* TRANSACTIONS */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">

                <div className="px-5 py-5 border-b border-border flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Recent Transactions
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Latest fund activities and settlements.
                    </p>
                  </div>

                </div>

                <div>

                  {transactions.map((txn, i) => (
                    <div
                      key={i}
                      className="px-5 py-4 border-b border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                            txn.type === "credit"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {txn.type === "credit" ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>

                        <div>
                          <p className="font-medium">
                            {txn.title}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            {txn.time}
                          </p>
                        </div>

                      </div>

                      <p
                        className={`text-sm font-semibold ${
                          txn.type === "credit"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {txn.amount}
                      </p>

                    </div>
                  ))}

                </div>
              </div>

            </div>

            {/* RIGHT */}
            <aside className="space-y-6">

              {/* BANK ACCOUNT */}
              <div className="rounded-2xl border border-border bg-card p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Linked Bank
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Primary settlement account
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Landmark size={20} />
                  </div>

                </div>

                <div className="mt-5 rounded-2xl border border-border bg-background p-4">

                  <p className="font-semibold">
                    HDFC Bank
                  </p>

                  <p className="text-sm text-muted-foreground mt-2">
                    •••• •••• •••• 4821
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    IFSC: HDFC0001234
                  </p>

                </div>

              </div>

              {/* MARGIN DETAILS */}
              <div className="rounded-2xl border border-border bg-card p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Margin Details
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Available trading limits
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Wallet size={20} />
                  </div>

                </div>

                <div className="mt-6 space-y-5">

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

                        <span className="text-sm font-semibold">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`${item.color} h-full rounded-full`}
                          style={{ width: item.width }}
                        />
                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* PAYMENT METHODS */}
              <div className="rounded-2xl border border-border bg-card p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Payment Methods
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Saved payment options
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>

                </div>

                <div className="mt-5 space-y-3">

                  <div className="rounded-2xl border border-border bg-background px-4 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        UPI
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        gani@upi
                      </p>
                    </div>

                    <span className="text-xs font-medium text-emerald-500">
                      Active
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-background px-4 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Debit Card
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        •••• 4821
                      </p>
                    </div>

                    <span className="text-xs font-medium text-emerald-500">
                      Active
                    </span>
                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>
      </main>
    </div>
  );
}