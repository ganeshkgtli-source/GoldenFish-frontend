import { useMemo, useState } from "react";

import TableSkeleton from "@/components/ui/TableSkeleton";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useOrders } from "../../hooks/useMarketData";

import type { Order } from "../../api/getMarketData";

export default function OrderBook() {
  // =========================================
  // FILTERS
  // =========================================

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    // type: "",
    // fromDate: "",
    // toDate: "",
  });

  // =========================================
  // PAGINATION
  // =========================================

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;

  // =========================================
  // API
  // =========================================

  const { data: ordersData, isLoading, error } = useOrders();

  // =========================================
  // FILTER CHANGE
  // =========================================

  const handleFilterChange = (key: string, value: string) => {
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
      status: "",
      // type: "",
      // fromDate: "",
      // toDate: "",
    });
  };

  // =========================================
  // QUICK RANGE
  // =========================================

  const handleQuickRange = (days: number) => {
    const today = new Date();

    const from = new Date();

    from.setDate(today.getDate() - days);

    setFilters((prev) => ({
      ...prev,

      fromDate: from.toISOString().split("T")[0],

      toDate: today.toISOString().split("T")[0],
    }));
  };

  // =========================================
  // FILTERED DATA
  // =========================================

  const filteredOrders = useMemo(() => {
    let orders = ordersData || [];

    // SEARCH
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      orders = orders.filter(
        (order) =>
          order.tradingSymbol?.toLowerCase().includes(query) ||
          order.orderId?.toString().includes(query),
      );
    }

    // STATUS
    if (filters.status) {
      orders = orders.filter((order) => order.orderStatus === filters.status);
    }

    // TYPE
    // if (filters.type) {
    //   orders = orders.filter((order) => order.transactionType === filters.type);
    // }

    return orders;
  }, [filters, ordersData]);

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // =========================================
  // COLUMNS
  // =========================================

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      title: "Order ID",

      render: (o) => <span className="font-medium">#{o.orderId}</span>,
    },

    {
      key: "status",
      title: "Status",

      render: (o) => (
        <span
          className={`
              whitespace-nowrap

              rounded-md

              px-2 py-1

              text-xs
              font-medium

              ${
                o.orderStatus === "PENDING"
                  ? `
                    bg-yellow-500/20
                    text-yellow-500
                  `
                  : o.orderStatus === "TRADED"
                    ? `
                      bg-green-500/20
                      text-green-500
                    `
                    : `
                      bg-red-500/20
                      text-red-500
                    `
              }
            `}
        >
          {o.orderStatus}
        </span>
      ),
    },

    {
      key: "transactionType",
      title: "Type",

      render: (o) => (
        <span
          className={
            o.transactionType === "BUY"
              ? `
                  font-semibold
                  text-green-500
                `
              : `
                  font-semibold
                  text-red-500
                `
          }
        >
          {o.transactionType}
        </span>
      ),
    },

    {
      key: "exchangeSegment",
      title: "Exchange",
    },

    {
      key: "productType",
      title: "Product",
    },

    {
      key: "orderType",
      title: "Order Type",
    },

    {
      key: "validity",
      title: "Validity",
    },

    {
      key: "tradingSymbol",
      title: "Stock",

      render: (o) => <span className="font-medium">{o.tradingSymbol}</span>,
    },

    {
      key: "quantity",
      title: "Qty",
    },

    {
      key: "price",
      title: "Price",

      render: (o) => (
        <span>
          ₹{o.averageTradedPrice > 0 ? o.averageTradedPrice : o.price}
        </span>
      ),
    },

    {
      key: "filledQty",
      title: "Filled",
    },

    {
      key: "remainingQuantity",
      title: "Remaining",
    },
  ];

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return <TableSkeleton />;
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div
        className="
          rounded-2xl

          border border-red-500/20

          bg-red-500/5

          p-6
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-red-500
          "
        >
          Failed to load orders
        </p>

        <p
          className="
            mt-2
            text-xs
            text-muted-foreground
          "
        >
          Please try again later.
        </p>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <TableCard
      title="Order Book"
      subtitle="Track all live and completed orders"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onQuickRange={handleQuickRange}
          filters={[
            {
              type: "search",
              key: "search",
              placeholder: "Search orders...",
            },

            {
              type: "select",
              key: "status",
              placeholder: "All",
              options: [
                // {
                //   label: "All Status",
                //   value: "",
                // },

                {
                  label: "Pending",
                  value: "PENDING",
                },

                {
                  label: "Executed",
                  value: "TRADED",
                },
              ],
            },

            // {
            //   type: "select",
            //   key: "type",
            //   placeholder: "All",
            //   options: [
            //     {
            //       label: "All",
            //       value: "",
            //     },

            //     {
            //       label: "BUY",
            //       value: "BUY",
            //     },

            //     {
            //       label: "SELL",
            //       value: "SELL",
            //     },
            //   ],
            // },

            // {
            //   type: "date-range",
            //   key: "date",
            // },

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
        data={paginatedOrders}
        emptyText="No orders found"
        minWidth="1400px"
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </TableCard>
  );
}
