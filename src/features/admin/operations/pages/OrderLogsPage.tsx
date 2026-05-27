import { useMemo, useState } from "react";

import TableSkeleton from "@/components/ui/TableSkeleton";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import { Link } from "@tanstack/react-router";

import type { Column } from "@/components/data-table/types";

import { useOrdersSocket } from "@/websocket/hooks/useOrdersSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

import type { Order } from "@/websocket/types/order.types";

import ManagementAdminNavbar from "@/features/admin/operations/components/Managementadmin_navBar";
import { useAuthStore } from "@/store/authStore";

export type TableOrder = {
  orderId: string;

  username: string;
  user_id: number;
  orderStatus: string;

  transactionType: string;

  exchangeSegment: string;

  productType: string;

  orderType: string;

  validity: string;

  tradingSymbol: string;

  quantity: number;

  price: number;

  averageTradedPrice: number;

  filledQty: number;

  createdAt: string;

  createdAtRaw: number;

  remainingQuantity: number;
};

const adaptOrder = (order: Order): TableOrder => {
  const createdDateObj = new Date(order.created_at);

  const createdTimestamp = createdDateObj.getTime();

  return {
    orderId: order.order_id,
    user_id: order.user_id,
    username: String(order.username || order.dhan_client_id || "clint"),

    orderStatus: order.order_status,

    transactionType: order.transaction_type,

    exchangeSegment: order.exchange_segment,

    productType: order.product_type,

    orderType: order.order_type,

    validity: order.validity,

    tradingSymbol: order.trading_symbol,

    quantity: order.quantity,

    price: Number(order.price),

    averageTradedPrice: Number(order.average_traded_price),

    filledQty: order.filled_qty,

    remainingQuantity: order.remaining_quantity,

    createdAt: createdDateObj.toLocaleString(),

    createdAtRaw: createdTimestamp,
  };
};

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;

  value: string | number;

  color?: "green" | "red" | "yellow";
}) {
  const colors = {
    green: "text-green-500",

    red: "text-red-500",

    yellow: "text-yellow-500",
  };

  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-card
        p-4
      "
    >
      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        {title}
      </p>

      <p className={`text-lg font-semibold ${color ? colors[color] : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function OrderLogsPage() {
  /**
   * START SOCKET
   */
  const user = useAuthStore((s) => s.user);
  
  useOrdersSocket(user?.role);

  /**
   * STORE
   */
  const realtimeOrders = useRealtimeStore((state) => state.orders);

  const connectionStatus = useRealtimeStore((state) => state.connectionStatus);

  /**
   * FILTERS
   */
  const [filters, setFilters] = useState({
    search: "",

    status: "ALL",

    sort: "latest",
    fromDate: "",

    toDate: "",
  });

  /**
   * PAGINATION
   */
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 16;

  /**
   * FILTER CHANGE
   */
  const handleFilterChange = (key: string, value: string) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,

      [key]: value,
    }));
  };

  /**
   * RESET
   */
  const handleReset = () => {
    setPage(1);

    setFilters({
      search: "",

      status: "ALL",

      sort: "latest",
      fromDate: "",

      toDate: "",
    });
  };

  /**
   * ADAPT + SORT
   */
  const adaptedOrders = useMemo(() => {
    return realtimeOrders
      .map(adaptOrder)
      .sort((a, b) => b.createdAtRaw - a.createdAtRaw);
  }, [realtimeOrders]);

  /**
   * FILTERED DATA
   */
  const filteredOrders = useMemo(() => {
    let orders = [...adaptedOrders];

    /**
     * STATUS FILTER
     */
    if (filters.status !== "ALL" && filters.status !== "") {
      orders = orders.filter((order) => order.orderStatus === filters.status);
    }

    /**
     * SEARCH
     */
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      orders = orders.filter(
        (order) =>
          order.tradingSymbol.toLowerCase().includes(query) ||
          order.orderId.toLowerCase().includes(query) ||
          order.username.toLowerCase().includes(query),
      );
    }

    /**
     * SORT
     */
    switch (filters.sort) {
      case "latest":
        orders = [...orders].sort((a, b) => b.createdAtRaw - a.createdAtRaw);

        break;

      case "oldest":
        orders = [...orders].sort((a, b) => a.createdAtRaw - b.createdAtRaw);

        break;

      default:
        break;
    }
    /**
     * FROM DATE
     */
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);

      orders = orders.filter((order) => order.createdAtRaw >= from.getTime());
    }

    /**
     * TO DATE
     */
    if (filters.toDate) {
      const to = new Date(filters.toDate);

      to.setHours(23, 59, 59, 999);

      orders = orders.filter((order) => order.createdAtRaw <= to.getTime());
    }
    return orders;
  }, [adaptedOrders, filters]);

  /**
   * PAGINATION
   */
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  /**
   * SUMMARY
   */
  const totalOrders = adaptedOrders.length;

  const completedOrders = adaptedOrders.filter(
    (o) => o.orderStatus === "TRADED",
  ).length;

  const pendingOrders = adaptedOrders.filter(
    (o) => o.orderStatus === "PENDING",
  ).length;

  const rejectedOrders = adaptedOrders.filter(
    (o) => o.orderStatus === "REJECTED",
  ).length;

  /**
   * TABLE COLUMNS
   */
  const columns: Column<TableOrder>[] = [
    {
      key: "createdAt",

      title: "Order Time",

      render: (o) => <div className="whitespace-nowrap">{o.createdAt}</div>,
    },

    {
      key: "username",

      title: "Client",

      render: (o) => (
        <Link
          to="/admin/client/$id"
          params={{
            id: o.user_id,
          }}
          search={{
            tab: "orders",
          }}
          className="
            text-primary
            text-blue-400
            font-semibold
            hover:underline
            whitespace-nowrap
          "
        >
          {o.username}
        </Link>
      ),
    },

    {
      key: "orderId",

      title: "Order ID",

      render: (o) => <span className="font-medium">#{o.orderId}</span>,
    },

    {
      key: "orderStatus",

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

  /**
   * LOADING
   */
  if (connectionStatus === "CONNECTING") {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ManagementAdminNavbar />

      {/* SUMMARY */}
      <div
        className="
          grid grid-cols-1
          gap-4

          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <SummaryCard title="Total Orders" value={totalOrders} />

        <SummaryCard title="Executed" value={completedOrders} color="green" />

        <SummaryCard title="Pending" value={pendingOrders} color="yellow" />

        <SummaryCard title="Rejected" value={rejectedOrders} color="red" />
      </div>

      {/* TABLE */}
      <TableCard
        title="Live Order Logs"
        subtitle="Realtime websocket order feed"
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

                placeholder: "Status",

                options: [
                  {
                    label: "All",

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

                  {
                    label: "Rejected",

                    value: "REJECTED",
                  },
                ],
              },

              {
                type: "select",

                key: "sort",

                placeholder: "Sort",

                options: [
                  {
                    label: "Latest First",

                    value: "latest",
                  },

                  {
                    label: "Oldest First",

                    value: "oldest",
                  },
                ],
              },

              {
                type: "date-range",

                key: "dateRange",
              },

              {
                type: "reset",

                key: "reset",
              },
            ]}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedOrders}
          emptyText="Waiting for realtime orders..."
          minWidth="1600px"
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </TableCard>
    </div>
  );
}
