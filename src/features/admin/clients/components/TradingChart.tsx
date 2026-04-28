"use client";
import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function TradingChart() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      height: 300,
      layout: {
        background: { color: "transparent" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
    });

    // ✅ NEW API (v5)
    const series = chart.addSeries(CandlestickSeries);

    series.setData([
      { time: "2024-04-01", open: 100, high: 120, low: 90, close: 110 },
      { time: "2024-04-02", open: 110, high: 130, low: 100, close: 125 },
      { time: "2024-04-03", open: 125, high: 140, low: 120, close: 135 },
    ]);

    return () => chart.remove();
  }, []);

  return <div ref={ref} className="w-full h-[300px]" />;
}