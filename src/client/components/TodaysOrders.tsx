     
export default function TodaysOrders() {
  const orders = [
    {
      id: "#ORD125487",
      type: "BUY",
      stock: "RELIANCE",
      qty: 10,
      price: "2,850",
      status: "Executed",
      time: "10:15 AM",
    },
    {
      id: "#ORD125486",
      type: "SELL",
      stock: "TCS",
      qty: 5,
      price: "3,420",
      status: "Executed",
      time: "10:12 AM",
    },
    {
      id: "#ORD125485",
      type: "BUY",
      stock: "INFY",
      qty: 15,
      price: "1,540",
      status: "Open",
      time: "10:08 AM",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Today's Orders</h2>

        <div className="flex gap-2 text-xs">
          <button className="px-3 py-1 rounded-md bg-primary text-white">
            All
          </button>
          <button className="px-3 py-1 rounded-md bg-muted">Open</button>
          <button className="px-3 py-1 rounded-md bg-muted">Executed</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="space-y-2">

        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] text-xs text-muted px-2">
          <span>ID</span>
          <span>Type</span>
          <span>Stock</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Status</span>
        </div>

        {orders.map((o, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] px-2 py-2 rounded-md hover:bg-muted/40 text-sm"
          >
            <span>{o.id}</span>

            <span className={o.type === "BUY" ? "text-green-500" : "text-red-500"}>
              {o.type}
            </span>

            <span>{o.stock}</span>
            <span>{o.qty}</span>
            <span>₹{o.price}</span>

            <span className="text-xs px-2 py-1 rounded bg-muted w-fit">
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
