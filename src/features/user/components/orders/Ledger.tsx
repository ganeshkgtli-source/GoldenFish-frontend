import ContentTable from "../ContentTable";
import TableCard from "../TableCard";

type LedgerEntry = {
  date: string;
  remark: string;
  amount: string;
  type: "credit" | "debit";
};

const ledger: LedgerEntry[] = [
  {
    date: "05 May 2026",
    remark: "Funds Added",
    amount: "+₹50,000",
    type: "credit",
  },

  {
    date: "04 May 2026",
    remark: "Brokerage Charges",
    amount: "-₹120",
    type: "debit",
  },
];

export default function Ledger() {
  const columns = [
    {
      key: "date",
      title: "Date",
    },

    {
      key: "remark",
      title: "Remark",

      render: (item: LedgerEntry) => (
        <span className="font-medium">{item.remark}</span>
      ),
    },

    {
      key: "amount",
      title: "Amount",

      render: (item: LedgerEntry) => (
        <span
          className={`
            font-semibold
            ${item.type === "credit" ? "text-emerald-500" : "text-red-500"}
          `}
        >
          {item.amount}
        </span>
      ),
    },

    {
      key: "type",
      title: "Type",

      render: (item: LedgerEntry) => (
        <span className="uppercase text-xs text-muted-foreground">
          {item.type}
        </span>
      ),
    },
  ];

  return (
    <TableCard title="Ledger" subtitle="Track fund movements and charges">
      <ContentTable columns={columns} data={ledger} minWidth="700px" />
    </TableCard>
  );
}
