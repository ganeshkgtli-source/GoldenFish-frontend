import {
  Download,
  FileText,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import TableCard from "@/components/data-table/TableCard";

const reports = [
  {
    title: "P&L Statement",

    desc: "Profit and loss summary for all executed trades.",

    icon: TrendingUp,

    type: "Financial",

    size: "2.4 MB",

    updated: "Updated today",
  },

  {
    title: "Tax Report",

    desc: "Financial year tax summary and deductions.",

    icon: ReceiptText,

    type: "Tax",

    size: "1.1 MB",

    updated: "Updated yesterday",
  },

  {
    title: "Trade Summary",

    desc: "Detailed trade history with execution records.",

    icon: FileText,

    type: "Trading",

    size: "3.2 MB",

    updated: "Updated 2 days ago",
  },
];

export default function Reports() {
  return (
    <TableCard
      title="Reports"
      subtitle="Download trading, tax, and financial reports."
    >
      <div
        className="
          grid grid-cols-1 gap-5

          p-5

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {reports.map(
          (report) => {
            const Icon =
              report.icon;

            return (
              <div
                key={report.title}
                className="
                  group

                  relative

                  overflow-hidden

                  rounded-2xl

                  border border-border

                  bg-background

                  p-5

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:bg-muted/30
                "
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  {/* ICON */}
                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center

                      rounded-2xl

                      bg-primary/10

                      text-primary
                    "
                  >
                    <Icon size={22} />
                  </div>

                  {/* TYPE */}
                  <span
                    className="
                      rounded-full

                      border border-border

                      bg-muted/40

                      px-3 py-1

                      text-[11px]
                      font-medium
                      uppercase
                      tracking-wide

                      text-muted-foreground
                    "
                  >
                    {report.type}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="mt-5">
                  <h3
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    {report.title}
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm
                      leading-6

                      text-muted-foreground
                    "
                  >
                    {report.desc}
                  </p>
                </div>

                {/* META */}
                <div
                  className="
                    mt-5

                    flex items-center
                    justify-between

                    text-xs
                    text-muted-foreground
                  "
                >
                  <span>
                    {report.size}
                  </span>

                  <span>
                    {report.updated}
                  </span>
                </div>

                {/* ACTION */}
                <button
                  type="button"
                  className="
                    mt-6

                    inline-flex
                    h-11
                    w-full

                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-emerald-500

                    px-4

                    text-sm
                    font-semibold
                    text-black

                    transition-all
                    duration-200

                    hover:opacity-90
                    hover:shadow-lg
                  "
                >
                  <Download size={16} />

                  Download Report
                </button>

                {/* GLOW */}
                <div
                  className="
                    pointer-events-none

                    absolute
                    inset-0

                    opacity-0

                    transition-opacity
                    duration-300

                    group-hover:opacity-100
                  "
                >
                  <div
                    className="
                      absolute -right-10 -top-10

                      h-32 w-32

                      rounded-full

                      bg-primary/10

                      blur-3xl
                    "
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </TableCard>
  );
}