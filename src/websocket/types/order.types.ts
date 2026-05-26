export type Order = {
  id: number;

  user_id: number;

  username: string;

  dhan_client_id: string;

  order_id: string;

  exchange_order_id: string;

  correlation_id: string;

  order_status: string;

  oms_error_code: string;

  oms_error_description: string;

  transaction_type: string;

  exchange_segment: string;

  product_type: string;

  order_type: string;

  validity: string;

  trading_symbol: string;

  security_id: string;

  quantity: number;

  filled_qty: number;

  remaining_quantity: number;

  disclosed_quantity: number;

  price: string;

  trigger_price: string;

  average_traded_price: string;

  bo_profit_value: string;

  bo_stop_loss_value: string;

  leg_name: string;

  algo_id: string;

  create_time: string;

  update_time: string;

  exchange_time: string;

  drv_expiry_date: string;

  drv_option_type: string;

  drv_strike_price: string;

  after_market_order: boolean;

  created_at: string;

  updated_at: string;
};

export type OrderEventType =
  | "snapshot"
  | "created"
  | "updated"
  | "deleted";

export type UseOrdersSocketProps = {
  type?: "admin" | "client" | "self";

  clientId?: string;
};