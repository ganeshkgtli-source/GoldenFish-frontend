import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type Stock = {
  name: string;
  price: number;
  change: number;
  flash?: "up" | "down" | null;
};

export default function WatchlistSidebar() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [query, setQuery] = useState("");

  /* ================= INITIAL API LOAD ================= */
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        // const res = await api.post("market/quotes/", {
        //   securityIds: ["13", "25", "1333", "11536"],
        //   const res = none ;
        // });
const res = None ;
        console.log("API RESPONSE:", res.data);

        if (res.data?.status !== "success") {
          throw new Error("API failed");
        }

        const formatted = Object.values(res.data?.data || {}).map((s: any) => ({
          name: s.tradingSymbol?.toUpperCase(),
          price: s.lastTradedPrice,
          change: s.percentChange,
        }));

        setStocks(formatted);
      } catch (err: any) {
        console.log("API ERROR:", err?.response?.data || err.message);

        // 🔥 fallback data
        setStocks([
          { name: "RELIANCE", price: 2850, change: 0 },
          { name: "TCS", price: 3420, change: 0 },
          { name: "NIFTY", price: 24227, change: 0 },
                    { name: "BANKNIFTY", price: 24227, change: 0 },

        ]);
      }
    };

    fetchInitial();
  }, []);

  /* ================= LIVE DATA (MOCK / WS TOGGLE) ================= */
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
    <div className="flex flex-col gap-3">

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks..."
        className="w-full px-3 py-2 rounded-lg bg-[#0f172a] text-sm border border-white/5 outline-none"
      />

      {/* HEADER */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Watchlist</span>
        <span className="cursor-pointer">+</span>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-2">
        {filtered.map((s, i) => {
          const isUp = s.change >= 0;

          return (
            <div
              key={i}
              className={`flex justify-between items-center px-3 py-2 rounded-lg transition
              ${isUp ? "bg-green-500/10" : "bg-red-500/10"}
              `}
            >
              {/* LEFT */}
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-[10px] text-gray-500">NSE</p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ₹{s.price.toLocaleString()}
                </p>

                <p
                  className={`text-[10px] ${
                    isUp ? "text-green-400" : "text-red-400"
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
