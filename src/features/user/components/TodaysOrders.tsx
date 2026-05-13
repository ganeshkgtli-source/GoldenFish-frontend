import { useMemo, useState } from "react";

type Order = {
  orderId: string;
  orderStatus: string;
  transactionType: string;
  exchangeSegment: string;
  productType: string;
  orderType: string;
  validity: string;
  tradingSymbol: string;
  quantity: number;
  price: number;
  createTime: string;
  remainingQuantity: number;
  averageTradedPrice: number;
  filledQty: number;
};

type FilterType =
  | "ALL"
  | "PENDING"
  | "TRADED";

const FILTERS: FilterType[] = [
  "ALL",
  "PENDING",
  "TRADED",
];

export default function TodaysOrders() {

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("ALL");

const ORDERS: Order[] = [
  {
    orderId: "112111182198",
    orderStatus: "TRADED",
    transactionType: "BUY",
    exchangeSegment: "NSE_EQ",
    productType: "INTRADAY",
    orderType: "MARKET",
    validity: "DAY",
    tradingSymbol: "RELIANCE",
    quantity: 10,
    price: 2850,
    createTime: "2026-05-13 10:15:00",
    remainingQuantity: 0,
    averageTradedPrice: 2850,
    filledQty: 10,
  },

  {
    orderId: "112111182199",
    orderStatus: "TRADED",
    transactionType: "SELL",
    exchangeSegment: "NSE_EQ",
    productType: "INTRADAY",
    orderType: "LIMIT",
    validity: "DAY",
    tradingSymbol: "TCS",
    quantity: 5,
    price: 3420,
    createTime: "2026-05-13 10:12:00",
    remainingQuantity: 0,
    averageTradedPrice: 3420,
    filledQty: 5,
  },

  {
    orderId: "112111182200",
    orderStatus: "PENDING",
    transactionType: "BUY",
    exchangeSegment: "NSE_EQ",
    productType: "DELIVERY",
    orderType: "MARKET",
    validity: "DAY",
    tradingSymbol: "INFY",
    quantity: 15,
    price: 1540,
    createTime: "2026-05-13 10:08:00",
    remainingQuantity: 15,
    averageTradedPrice: 0,
    filledQty: 0,
  },
];

 const filteredOrders = useMemo(() => {

  if (activeFilter === "ALL") {
    return ORDERS;
  }

  return ORDERS.filter(
    (order) =>
      order.orderStatus === activeFilter
  );

}, [activeFilter]);

  return (

    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">

        {/* TITLE */}
        <div>

          <h2 className="text-lg font-semibold tracking-tight">
            Today's Orders
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Track all live and completed orders
          </p>

        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl w-fit">

          {FILTERS.map((filter) => {

            const isActive =
              activeFilter === filter;

            return (

              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`
                  px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/30
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

      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-border overflow-hidden">

        {/* SCROLL AREA */}
        <div className="overflow-auto max-h-[420px]">

          <div className="min-w-[1400px]">

            {/* TABLE HEADER */}
            <div className="sticky top-0 z-10 bg-card border-b border-border">

              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-xs font-semibold text-muted-foreground">

                <span>Order ID</span>
                <span>Status</span>
                <span>Type</span>
                <span>Exchange</span>
                <span>Product</span>
                <span>Order Type</span>
                <span>Validity</span>
                <span>Stock</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Filled</span>
                <span>Remaining</span>

              </div>

            </div>

            {/* TABLE BODY */}
            <div className="divide-y divide-border">

              {filteredOrders.map((o) => (

                <div
                  key={o.orderId}
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
                >

                  {/* ORDER ID */}
                  <span className="font-medium truncate">
                    #{o.orderId}
                  </span>

                  {/* STATUS */}
                  <span
                    className={`
                      text-xs px-2 py-1 rounded-md w-fit h-fit font-medium
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

                  {/* TYPE */}
                  <span
                    className={
                      o.transactionType === "BUY"
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {o.transactionType}
                  </span>

                  {/* EXCHANGE */}
                  <span className="truncate">
                    {o.exchangeSegment}
                  </span>

                  {/* PRODUCT */}
                  <span className="truncate">
                    {o.productType}
                  </span>

                  {/* ORDER TYPE */}
                  <span className="truncate">
                    {o.orderType}
                  </span>

                  {/* VALIDITY */}
                  <span>
                    {o.validity}
                  </span>

                  {/* STOCK */}
                  <span className="font-medium truncate">
                    {o.tradingSymbol}
                  </span>

                  {/* QUANTITY */}
                  <span>
                    {o.quantity}
                  </span>

                  {/* PRICE */}
                  <span>
                    ₹
                    {o.averageTradedPrice > 0
                      ? o.averageTradedPrice
                      : o.price}
                  </span>

                  {/* FILLED */}
                  <span>
                    {o.filledQty}
                  </span>

                  {/* REMAINING */}
                  <span>
                    {o.remainingQuantity}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}