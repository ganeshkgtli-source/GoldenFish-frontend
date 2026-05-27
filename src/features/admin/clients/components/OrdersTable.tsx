import { useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useOrdersSocket } from "@/websocket/hooks/useOrdersSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

import type { Order } from "@/websocket/types/order.types";

type OrderRow = {
  orderId: string;

  date: string;

  symbol: string;

  exchange: string;

  type: string;

  status: string;

  Price: number;

  // exitPrice: number;

  // totalPnl: number;

  quantity: number;
};

export default function OrdersTable() {
  /**
   * ROUTE PARAM
   */
  const { id } = useParams({
    from: "/admin/client/$id",
  });

  /**
   * START SOCKET
   */
  useOrdersSocket("client", id);

  /**
   * STORE
   */
  const realtimeOrders = useRealtimeStore((state) => state.orders);

  /**
   * FILTERS
   */
  const [filters, setFilters] = useState({
    search: "",

    status: "ALL",

    fromDate: "",

    toDate: "",
  });

  /**
   * PAGINATION
   */
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;

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

      fromDate: "",

      toDate: "",
    });
  };

  /**
   * ADAPT ORDERS
   */
  const adaptedOrders = useMemo<OrderRow[]>(() => {
    return realtimeOrders
      .map((o: Order) => ({
        clientId: String(o.user_id),

        orderId: String(o.order_id || o.id),

        date: new Date(o.created_at).toLocaleString(),

        symbol: o.trading_symbol,

        exchange: o.exchange_segment,

        type: o.transaction_type,

        status: o.order_status,

        Price: Number(o.price),

        // exitPrice: Number(o.average_traded_price || 0),

        // totalPnl: 0,

        quantity: o.quantity,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [realtimeOrders]);

  /**
   * TODAY PENDING ORDERS
   */
  const todayPendingOrders = useMemo(() => {
    const today = new Date();

    return adaptedOrders.filter((o) => {
      const orderDate = new Date(o.date);

      const isToday =
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();

      const isPending = o.status === "PENDING";

      return isToday && isPending;
    });
  }, [adaptedOrders]);
  /**
   * FILTERED DATA
   */
  const filteredData = useMemo(() => {
    let orders = [...adaptedOrders];

    /**
     * STATUS
     */
    if (filters.status !== "ALL" && filters.status !== "") {
      orders = orders.filter((o) => o.status === filters.status);
    }

    /**
     * SEARCH
     */
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      orders = orders.filter(
        (o) =>
          o.symbol.toLowerCase().includes(query) ||
          o.exchange.toLowerCase().includes(query) ||
          o.orderId.toLowerCase().includes(query),
      );
    }

    /**
     * FROM DATE
     */
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);

      orders = orders.filter((o) => new Date(o.date) >= from);
    }

    /**
     * TO DATE
     */
    if (filters.toDate) {
      const to = new Date(filters.toDate);

      to.setHours(23, 59, 59, 999);

      orders = orders.filter((o) => new Date(o.date) <= to);
    }

    return orders;
  }, [adaptedOrders, filters]);

  /**
   * PAGINATION
   */
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginatedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  /**
   * COLUMNS
   */
  const columns: Column<OrderRow>[] = [
    {
      key: "date",

      title: "Time",

      render: (o) => <div className="whitespace-nowrap">{o.date}</div>,
    },

    // {
    //   key: "clientId",

    //   title: "Client",

    //   render: (o) => (
    //     <Link
    //       to="/admin/client/$id"
    //       params={{
    //         id: o.clientId,
    //       }}
    //       search={{
    //         tab: "orders",
    //       }}
    //       className="
    //         text-primary
    //         font-semibold
    //         hover:underline
    //       "
    //     >
    //       Client {o.clientId}
    //     </Link>
    //   ),
    // },

    {
      key: "orderId",

      title: "Order ID",

      render: (o) => <span className="font-medium">#{o.orderId}</span>,
    },

    {
      key: "symbol",

      title: "Symbol",
    },

    {
      key: "exchange",

      title: "Exchange",
    },

    {
      key: "type",

      title: "Type",

      render: (o) => (
        <span
          className={
            o.type === "BUY"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {o.type}
        </span>
      ),
    },

    {
      key: "status",

      title: "Status",

      render: (o) => (
        <span
          className={`
            rounded-md
            px-2 py-1
            text-xs
            font-semibold

            ${
              o.status === "TRADED"
                ? `
                  bg-green-500/10
                  text-green-500
                `
                : o.status === "PENDING"
                  ? `
                    bg-yellow-500/10
                    text-yellow-500
                  `
                  : `
                    bg-red-500/10
                    text-red-500
                  `
            }
          `}
        >
          {o.status}
        </span>
      ),
    },

    {
      key: "entryPrice",

      title: "Price",

      render: (o) => <span>₹{o.Price}</span>,
    },

    {
      key: "quantity",

      title: "Qty",
    },

    // {
    //   key: "totalPnl",

    //   title: "P&L",

    //   render: (o) => (
    //     <span
    //       className={
    //         Number(o.totalPnl) >= 0 ? "text-green-500" : "text-red-500"
    //       }
    //     >
    //       ₹{o.totalPnl}
    //     </span>
    //   ),
    // },
  ];

  return (
    <div className="space-y-6">
      {/* PENDING TODAY TABLE */}
      {/* <TableCard
        title="Today's Pending Orders"
        subtitle="Only pending orders from today"
      > */}
        <DataTable
          columns={columns}
          data={todayPendingOrders}
          emptyText="No pending orders for today"
          minWidth="1400px"
        />
      {/* </TableCard> */}

      {/* ALL ORDERS TABLE */}
      <TableCard
        title="All Orders"
        subtitle="Realtime websocket orders"
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
          data={paginatedData}
          emptyText="Waiting for live websocket orders..."
          minWidth="1400px"
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </TableCard>
    </div>
  );
}
