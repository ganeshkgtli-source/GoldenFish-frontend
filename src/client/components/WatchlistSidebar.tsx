import { useEffect, useMemo, useState } from "react";
import { useMarketData } from "@/client/hooks/useProfile";

type Stock = {
  name: string;
  price: number;
  change: number;
  security_id: string;
  flash?: "up" | "down" | null;
};
type MarketSymbol = {
  SYMBOL_NAME?: string;
  security_id: string;
};
export default function WatchlistSidebar() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [query, setQuery] = useState("");
  const {
    data: marketData,
    // isLoading,
    // error,
  } = useMarketData();

const initialStocks = useMemo<
  Stock[]
>(() => {
  if (!marketData?.data) {
    return [];
  }

  return marketData.data.map(
    (s: MarketSymbol) => ({
      name:
        s.SYMBOL_NAME?.toUpperCase() ||
        "",

      security_id:
        s.security_id,

      price: 0,

      change: 0,
    })
  );
}, [marketData]);

useEffect(() => {
  if (
    stocks.length === 0 &&
    initialStocks.length > 0
  ) {
    queueMicrotask(() => {
      setStocks(initialStocks);
    });
  }
}, [stocks.length, initialStocks]);
 

  useEffect(() => {
    const USE_WS = false; // 🔥 CHANGE TO true WHEN BACKEND READY

    /* ================= MOCK MODE ================= */
    if (!USE_WS) {
      console.log("🧪 MOCK MODE ACTIVE");

      const interval = setInterval(() => {
        setStocks((prev) =>
          prev.map((s) => {
            const change = Number((Math.random() * 2 - 1).toFixed(2));
            const newPrice = Number((s.price + change).toFixed(2));

            return {
              ...s,
              price: newPrice,
              change,
              flash: change >= 0 ? "up" : "down",
            };
          }),
        );
      }, 1500);

      return () => clearInterval(interval);
    }

    /* ================= REAL WEBSOCKET ================= */
    const token = localStorage.getItem("access");

    if (!token) {
      console.warn("⚠️ No token → WS not started");
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let flashTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(`ws://127.0.0.1:8000/ws/market/?token=${token}`);

      ws.onopen = () => {
        console.log("WS CONNECTED ✅");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (!data.symbol) return;

          const symbol = data.symbol.toUpperCase();

          setStocks((prev) =>
            prev.map((s) => {
              if (s.name === symbol) {
                const isUp = data.change >= 0;

                return {
                  ...s,
                  price: data.price,
                  change: data.change,
                  flash: isUp ? "up" : "down",
                };
              }
              return s;
            }),
          );

          clearTimeout(flashTimeout);

          flashTimeout = setTimeout(() => {
            setStocks((prev) => prev.map((s) => ({ ...s, flash: null })));
          }, 400);
        } catch (err) {
          console.log("❌ WS PARSE ERROR:", err);
        }
      };

      ws.onerror = (e) => {
        console.log("WS ERROR ❌", e);
      };

      ws.onclose = () => {
        console.log("WS CLOSED ❌ → reconnecting...");

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 2000);
      };
    };

    connect();

    return () => {
      console.log("🛑 Cleaning WS");

      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
      clearTimeout(flashTimeout);
    };
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return stocks.filter((s) =>
      s.name?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [stocks, query]);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks..."
        className="wizard-input text-sm border-none bg-muted focus:ring-1 focus:ring-primary/40"
      />

      {/* HEADER */}
      <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
        <span className="font-medium">Watchlist</span>
        {/* <span className="cursor-pointer hover:text-foreground transition">+</span> */}
      </div>

      {/* LIST (SCROLLABLE) */}
      <div className="flex flex-col gap-2 max-h-[235px] overflow-y-auto scrollbar-hide pr-1">
        {filtered.map((s, i) => {
          const isUp = s.change >= 0;

          return (
            <div
              key={i}
              className={`
              flex justify-between items-center px-3 py-2 rounded-xl
              transition-all duration-200
              hover:bg-muted/60
              ${isUp ? "bg-green-500/5" : "bg-red-500/5"}
            `}
            >
              {/* LEFT */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {s.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {s.security_id}
                </span>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  ₹{s.price.toLocaleString()}
                </p>

                <p
                  className={`text-[11px] font-medium ${
                    isUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {s.change}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
