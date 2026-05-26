export type Trade = {
  id: string;

  user_id: number;

  symbol: string;

  exchange: string;

  type: "BUY" | "SELL";

  expiry: string;

  entryTime: string;

  entryPrice: number;

  status: "OPEN" | "CLOSED";

  exitTime?: string;

  exitPrice?: number;

  pnlLot: number;

  totalPnl: number;

  ltp: number;

  spot: number;

  strike: number;

  created_at: string;
};
