import { useMemo, useState } from "react";

import { useOrders } from "../hooks/useMarketData";

import type { Order } from "../api/getMarketData";

import ContentTable from "./ContentTable";
import TableCard from "./TableCard";

type FilterType = "ALL" | "PENDING" | "TRADED";

const FILTERS: FilterType[] = ["ALL", "PENDING", "TRADED"];

export default function TodaysOrders() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");


  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrders();
  
    const filteredOrders = useMemo(() => {
    const orders =
      ordersData || [];

    if (activeFilter === "ALL") {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.orderStatus ===
        activeFilter
    );
  }, [activeFilter, ordersData]);

  const columns = [
    {
      key: "orderId",
      title: "Order ID",

      render: (o: Order) => <span className="font-medium">#{o.orderId}</span>,
    },

    {
      key: "status",
      title: "Status",

      render: (o: Order) => (
        <span
          className={`
            text-xs
            px-2 py-1
            rounded-md
            font-medium
            whitespace-nowrap
            ${
              o.orderStatus === "PENDING"
                ? "bg-yellow-500/20 text-yellow-500"
                : o.orderStatus === "TRADED"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
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

      render: (o: Order) => (
        <span
          className={
            o.transactionType === "BUY"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
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

      render: (o: Order) => (
        <span className="font-medium">{o.tradingSymbol}</span>
      ),
    },

    {
      key: "quantity",
      title: "Qty",
    },

    {
      key: "price",
      title: "Price",

      render: (o: Order) => (
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

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load orders</div>;
  }

  return (
    <TableCard
      title="Today's Orders"
      subtitle="Track all live and completed orders"
      actions={
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-4 py-2
                  rounded-lg
                  text-xs
                  font-medium
                  transition-all
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                  whitespace-nowrap
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }
                `}
              >
                {filter === "ALL"
                  ? "All"
                  : filter === "PENDING"
                    ? "Open"
                    : "Executed"}
              </button>
            );
          })}
        </div>
      }
    >
      <ContentTable
        columns={columns}
        data={filteredOrders}
        emptyText="No orders found"
        minWidth="1400px"
      />
    </TableCard>
  );
}
