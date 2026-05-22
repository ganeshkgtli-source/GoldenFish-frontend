import {
  useMemo,
  useState,
} from "react";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type {
  Column,
} from "@/components/data-table/types";

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
    remark:
      "Brokerage Charges",
    amount: "-₹120",
    type: "debit",
  },
];

export default function Ledger() {
  // =========================================
  // FILTERS
  // =========================================

  const [filters, setFilters] =
    useState({
      search: "",
      type: "",
    });

  // =========================================
  // PAGINATION
  // =========================================

  const [page, setPage] =
    useState(1);

  const PAGE_SIZE = 10;

  // =========================================
  // FILTER HANDLER
  // =========================================

  const handleFilterChange = (
    key: string,
    value: string,
  ) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================================
  // RESET
  // =========================================

  const handleReset = () => {
    setPage(1);

    setFilters({
      search: "",
      type: "",
    });
  };

  // =========================================
  // FILTERED DATA
  // =========================================

  const filteredLedger =
    useMemo(() => {
      let data = [...ledger];

      // SEARCH
      if (
        filters.search.trim()
      ) {
        const query =
          filters.search.toLowerCase();

        data = data.filter(
          (item) =>
            item.remark
              .toLowerCase()
              .includes(query) ||
            item.date
              .toLowerCase()
              .includes(query),
        );
      }

      // TYPE FILTER
      if (filters.type) {
        data = data.filter(
          (item) =>
            item.type ===
            filters.type,
        );
      }

      return data;
    }, [filters]);

  // =========================================
  // PAGINATION DATA
  // =========================================

  const totalPages =
    Math.ceil(
      filteredLedger.length /
        PAGE_SIZE,
    );

  const paginatedLedger =
    filteredLedger.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE,
    );

  // =========================================
  // COLUMNS
  // =========================================

  const columns: Column<LedgerEntry>[] =
    [
      {
        key: "date",
        title: "Date",
      },

      {
        key: "remark",
        title: "Remark",

        render: (item) => (
          <span className="font-medium">
            {item.remark}
          </span>
        ),
      },

      {
        key: "amount",
        title: "Amount",

        render: (item) => (
          <span
            className={`
              font-semibold

              ${
                item.type ===
                "credit"
                  ? "text-emerald-500"
                  : "text-red-500"
              }
            `}
          >
            {item.amount}
          </span>
        ),
      },

      {
        key: "type",
        title: "Type",

        render: (item) => (
          <span
            className={`
              rounded-full

              px-2 py-1

              text-xs
              font-semibold
              uppercase

              ${
                item.type ===
                "credit"
                  ? `
                    bg-emerald-500/10
                    text-emerald-500
                  `
                  : `
                    bg-red-500/10
                    text-red-500
                  `
              }
            `}
          >
            {item.type}
          </span>
        ),
      },
    ];

  return (
    <TableCard
      title="Ledger"
      subtitle="Track fund movements and charges"
      headerActions={
        <FilterBar
          values={filters}
          onChange={
            handleFilterChange
          }
          onReset={handleReset}
          filters={[
            {
              type: "search",
              key: "search",
              placeholder:
                "Search ledger...",
            },

            {
              type: "select",
              key: "type",
              placeholder:
                "All",
              options: [
                {
                  label: "All",
                  value: "",
                },

                {
                  label:
                    "Credit",
                  value:
                    "credit",
                },

                {
                  label:
                    "Debit",
                  value:
                    "debit",
                },
              ],
            },

            {
              type: "reset",
              key: "reset",
            },
          ]}
        />
      }
    >
      {/* TABLE */}
      <DataTable
        columns={columns}
        data={paginatedLedger}
        emptyText="No ledger entries found"
        minWidth="700px"
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={
          filteredLedger.length
        }
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </TableCard>
  );
}