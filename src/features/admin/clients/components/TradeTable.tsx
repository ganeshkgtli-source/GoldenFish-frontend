import { useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";

import DataTable from "@/components/data-table/DataTable";
import FilterBar from "@/components/data-table/FilterBar";
import Pagination from "@/components/data-table/Pagination";
import TableCard from "@/components/data-table/TableCard";

import type { Column } from "@/components/data-table/types";

import { useTradesSocket } from "@/websocket/hooks/useTradesSocket";

import { useRealtimeStore } from "@/websocket/store/realtimeStore";

import type { Trade } from "@/websocket/types/trade.types";

type TradeRow = {
  // clientId: string;

  tradeId: string;

  orderId: string;

  date: string;

  symbol: string;

  exchange: string;

  type: string;

  productType: string;

  orderType: string;

  tradedPrice: number;

  tradedQuantity: number;

  tradeIdExchange: string;

  // expiry: string;

  // optionType: string;

  // strikePrice: string;

  // securityId: string;
};

export default function TradeTable() {
  /**
   * ROUTE PARAM
   */
  const { id } = useParams({
    from: "/admin/client/$id",
  });

  /**
   * START SOCKET
   */
  useTradesSocket("client", id);

  /**
   * STORE
   */
  const realtimeTrades = useRealtimeStore((state) => state.trades);
 
  /**
   * FILTERS
   */
  const [filters, setFilters] = useState({
    search: "",

    type: "ALL",

    fromDate: "",

    toDate: "",
  });

  /**
   * PAGINATION
   */
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 15;

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

      type: "ALL",

      fromDate: "",

      toDate: "",
    });
  };

  /**
   * ADAPT TRADES
   */
  const adaptedTrades = useMemo<TradeRow[]>(() => {
    return realtimeTrades
      .map((t: Trade) => ({
        // clientId:
        //   String(
        //     t.user_id,
        //   ),

        tradeId: String(t.id),

        orderId: t.order_id,

        date: new Date(t.created_at).toLocaleString(),

        symbol: t.trading_symbol,

        exchange: t.exchange_segment,

        type: t.transaction_type,

        productType: t.product_type,

        orderType: t.order_type,

        tradedPrice: Number(t.traded_price),

        tradedQuantity: t.traded_quantity,

        tradeIdExchange: t.exchange_trade_id,

        // expiry: t.drv_expiry_date,

        // optionType: t.drv_option_type,

        // strikePrice: t.drv_strike_price,

        // securityId: t.security_id,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [realtimeTrades]);

  /**
   * FILTERED DATA
   */
  const filteredData = useMemo(() => {
    let trades = [...adaptedTrades];

    /**
     * TYPE
     */
    if (filters.type !== "ALL" && filters.type !== "") {
      trades = trades.filter((t) => t.type === filters.type);
    }

    /**
     * SEARCH
     */
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      trades = trades.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.exchange.toLowerCase().includes(query) ||
          t.orderId.toLowerCase().includes(query),
      );
    }

    /**
     * FROM DATE
     */
    if (filters.fromDate) {
      const from = new Date(filters.fromDate);

      trades = trades.filter((t) => new Date(t.date) >= from);
    }

    /**
     * TO DATE
     */
    if (filters.toDate) {
      const to = new Date(filters.toDate);

      to.setHours(23, 59, 59, 999);

      trades = trades.filter((t) => new Date(t.date) <= to);
    }

    return trades;
  }, [adaptedTrades, filters]);

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
  const columns: Column<TradeRow>[] = [
    {
      key: "date",

      title: "Time",

      render: (t) => <div className="whitespace-nowrap">{t.date}</div>,
    },

    // {
    //   key: "clientId",

    //   title: "Client",

    //   render: (
    //     t,
    //   ) => (
    //     <Link
    //       to="/admin/client/$id"
    //       params={{
    //         id: t.clientId,
    //       }}
    //       search={{
    //         tab: "trades",
    //       }}
    //       className="
    //         text-primary
    //         font-semibold
    //         hover:underline
    //       "
    //     >
    //       Client{" "}
    //       {
    //         t.clientId
    //       }
    //     </Link>
    //   ),
    // },

    {
      key: "orderId",

      title: "Order ID",

      render: (t) => <span className="font-medium">#{t.orderId}</span>,
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

      render: (t) => (
        <span
          className={
            t.type === "BUY"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {t.type}
        </span>
      ),
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
      key: "tradedPrice",

      title: "Traded Price",

      render: (t) => <span>₹{t.tradedPrice}</span>,
    },

    {
      key: "tradedQuantity",

      title: "Qty",
    },

    {
      key: "tradeIdExchange",

      title: "Exchange Trade ID",
    },

    // {
    //   key: "expiry",

    //   title: "Expiry",
    // },

    // {
    //   key: "optionType",

    //   title: "Option",
    // },

    // {
    //   key: "strikePrice",

    //   title: "Strike",
    // },

    // {
    //   key: "securityId",

    //   title: "Security ID",
    // },
  ];

  return (
    
    <TableCard
      title="Live Trades"
      subtitle="Realtime websocket trades"
      headerActions={
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          filters={[
            {
              type: "search",

              key: "search",

              placeholder: "Search trades...",
            },

            {
              type: "select",

              key: "type",

              placeholder: "Trade Type",

              options: [
                {
                  label: "All",

                  value: "ALL",
                },

                {
                  label: "BUY",

                  value: "BUY",
                },

                {
                  label: "SELL",

                  value: "SELL",
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
        emptyText="Waiting for live websocket trades..."
        minWidth="2200px"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </TableCard>
  );
}
