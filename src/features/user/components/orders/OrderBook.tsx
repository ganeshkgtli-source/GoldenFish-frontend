import { useMemo, useState } from "react";
import { useOrders } from "../../hooks/useMarketData";
import type { Order } from "../../api/getMarketData";


 
type FilterType =
  | "ALL"
  | "PENDING"
  | "TRADED";

const FILTERS: FilterType[] = [
  "ALL",
  "PENDING",
  "TRADED",
];
export default function OrderBook() {
    const [activeFilter, setActiveFilter] =
      useState<FilterType>("ALL");
  
    const {
      data: ordersData,
      isLoading,
      error,
    } = useOrders();
  
   const ORDERS = useMemo<Order[]>(
  () => ordersData || [],
  [ordersData]
);
  
    const filteredOrders = useMemo(() => {
  
      if (activeFilter === "ALL") {
        return ORDERS;
      }
  
      return ORDERS.filter(
        (order) =>
          order.orderStatus === activeFilter
      );
  
    }, [activeFilter, ORDERS]);
  
    if (isLoading) {
      return (
        <div className="p-6">
          Loading orders...
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-6 text-red-500">
          Failed to load orders
        </div>
      );
    }
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
        <div className="overflow-auto max-h-[520px]">

          <div className="min-w-[1400px]">

            {/* TABLE HEADER */}
            <div
              className="
                sticky top-0 z-50
                bg-background
                border-b border-border
                shadow-sm
                backdrop-blur
              "
            >

              <div
                className="
                  grid
                  grid-cols-[1.5fr_repeat(11,1fr)]
                  px-4 py-3
                  text-xs font-semibold
                  text-muted-foreground
                  bg-background
                "
              >

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
                  className="
                    grid
                    grid-cols-[1.5fr_repeat(11,1fr)]
                    px-4 py-3
                    text-sm
                    hover:bg-muted/40
                    transition-colors
                  "
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