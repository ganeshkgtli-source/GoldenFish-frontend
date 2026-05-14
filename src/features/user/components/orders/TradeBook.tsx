import type {
  Trade,
} from "../../api/getMarketData";

import { useTrades } from "../../hooks/useMarketData";

import ContentTable from "../ContentTable";
import TableCard from "../TableCard";

export default function TradeBook() {
  const {
    data: tradesData,
    isLoading,
    error,
  } = useTrades();

  const trades: Trade[] =
    tradesData || [];

  const columns = [
    {
      key: "orderId",
      title: "Order ID",

      render: (trade: Trade) => (
        <span className="font-medium">
          #{trade.orderId}
        </span>
      ),
    },

    {
      key: "exchangeOrderId",
      title: "Exchange Order",
    },

    {
      key: "exchangeTradeId",
      title: "Trade ID",
    },

    {
      key: "transactionType",
      title: "Type",

      render: (trade: Trade) => (
        <span
          className={`
            text-xs px-2 py-1
            rounded-md font-medium
            ${
              trade.transactionType === "BUY"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }
          `}
        >
          {trade.transactionType}
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
      key: "tradingSymbol",
      title: "Stock",

      render: (trade: Trade) => (
        <span className="font-medium">
          {trade.tradingSymbol}
        </span>
      ),
    },

    {
      key: "tradedQuantity",
      title: "Qty",
    },

    {
      key: "tradedPrice",
      title: "Trade Price",

      render: (trade: Trade) => (
        <span>
          ₹{trade.tradedPrice}
        </span>
      ),
    },

    {
      key: "exchangeTime",
      title: "Exchange Time",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        Loading trades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load trades
      </div>
    );
  }

  return (
    <TableCard
      title="Trade Book"
      subtitle="View all executed trades"
    >

      <ContentTable
        columns={columns}
        data={trades}
        emptyText="No trades found"
        minWidth="1400px"
      />

    </TableCard>
  );
}