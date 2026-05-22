import { useMemo, useState } from "react";

import TableSkeleton from "@/components/ui/TableSkeleton";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useOrders } from "../hooks/useMarketData";

import type { Order } from "../api/getMarketData";

export default function TodaysOrders() {
  // FILTER STATE
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    sort: "",
  });

  // PAGINATION
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  const { data: ordersData, isLoading, error } = useOrders();

  // FILTER CHANGE
  const handleFilterChange = (key: string, value: string) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // RESET
  const handleReset = () => {
    setPage(1);

    setFilters({
      search: "",
      status: "ALL",
      sort: "",
    });
  };

  // FILTERED DATA
  const filteredOrders = useMemo(() => {
    let orders = ordersData || [];

    // STATUS FILTER
    if (filters.status !== "ALL" && filters.status !== "") {
      orders = orders.filter((order) => order.orderStatus === filters.status);
    }

    // SEARCH
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      orders = orders.filter(
        (order) =>
          order.tradingSymbol?.toLowerCase().includes(query) ||
          order.orderId?.toString().includes(query),
      );
    }

    // SORT
    switch (filters.sort) {
      case "latest":
        orders = [...orders].reverse();
        break;

      case "oldest":
        orders = [...orders];
        break;
    }

    return orders;
  }, [filters, ordersData]);

  // PAGINATED DATA
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // COLUMNS
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

  // LOADING
  if (isLoading) {
    return <TableSkeleton />;
  }

  // ERROR
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

  return (
    <TableCard
      title="Today's Orders"
      subtitle="Track all live and completed orders"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          filters={[
            {
              type: "search",
              key: "search",
              placeholder: "Search orders...",
            },

            {
              type: "select",
              key: "status",
              placeholder: " ",
              options: [
                {
                  label: "All  ",
                  value: "ALL",
                },

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
            //   type: "sort",
            //   key: "sort",
            //   options: [
            //     {
            //       label: "Latest First",
            //       value: "latest",
            //     },

            //     {
            //       label: "Oldest First",
            //       value: "oldest",
            //     },
            //   ],
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
