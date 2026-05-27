export type Error = {
  id: number;

  user_id: number;

  dhan_client_id: string;

  order_id: string;

  exchange_order_id: string;

  exchange_trade_id: string;

  transaction_type: "BUY" | "SELL";

  exchange_segment: string;

  product_type: string;

  order_type: string;

  trading_symbol: string;

  security_id: string;

  traded_price: string;

  traded_quantity: number;

  create_time: string;

  update_time: string;

  exchange_time: string;

  drv_expiry_date: string;

  drv_option_type: string;

  drv_strike_price: string;

  custom_symbol: string | null;

  created_at: string;

  updated_at: string;
};