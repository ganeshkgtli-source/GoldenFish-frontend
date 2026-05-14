import api from "@/lib/api";

/* =========================================================
   ORDERS
========================================================= */

export type Order = {
  orderId: string;

  orderStatus: string;

  transactionType: string;

  exchangeSegment: string;

  productType: string;

  orderType: string;

  validity: string;

  tradingSymbol: string;

  quantity: number;

  averageTradedPrice: number;

  price: number;

  filledQty: number;

  remainingQuantity: number;
};

export type OrdersResponse =
  Order[];

export const getOrders =
  async (): Promise<OrdersResponse> => {
    const res = await api.get(
      "/get-orders/"
    );

    return res.data;
  };

/* =========================================================
   MARKET DATA
========================================================= */

export type MarketSymbol = {
  security_id: string;

  SYMBOL_NAME: string;
};

export type MarketDataResponse = {
  data: MarketSymbol[];
};

export const getMarketData =
  async (): Promise<MarketDataResponse> => {
    const res = await api.get(
      "/marketdata/"
    );

    return res.data;
  };

/* =========================================================
   TRADES
========================================================= */

export type Trade = {
  dhanClientId: string;

  orderId: string;

  exchangeOrderId: string;

  exchangeTradeId: string;

  transactionType: string;

  exchangeSegment: string;

  productType: string;

  orderType: string;

  tradingSymbol: string;

  customSymbol: string | null;

  securityId: string;

  tradedQuantity: number;

  tradedPrice: number;

  createTime: string;

  updateTime: string;

  exchangeTime: string;

  drvExpiryDate: string;

  drvOptionType: string;

  drvStrikePrice: number;
};

export type TradesResponse =
  Trade[];

export const getTrades =
  async (): Promise<TradesResponse> => {
    const res = await api.get(
      "/get-trades/"
    );

    return res.data;
  };

/* =========================================================
   FUND LIMITS
========================================================= */

export type FundLimitResponse = {
  data: {
    dhanClientId: string;

    availabelBalance: number;

    sodLimit: number;

    collateralAmount: number;

    receiveableAmount: number;

    utilizedAmount: number;

    blockedPayoutAmount: number;

    withdrawableBalance: number;
  };

 };

export const getFundLimit =
  async (): Promise<FundLimitResponse> => {
    const res = await api.get(
      "/fund-limit/"
    );

    return res.data;
  };

/* =========================================================
   OPEN POSITIONS
========================================================= */

export type OpenPosition = {
  dhanClientId: string;

  tradingSymbol: string;

  securityId: string;

  positionType: string;

  exchangeSegment: string;

  productType: string;

  buyAvg: number;

  costPrice: number;

  buyQty: number;

  sellAvg: number;

  sellQty: number;

  netQty: number;

  realizedProfit: number;

  unrealizedProfit: number;

  rbiReferenceRate: number;

  multiplier: number;

  carryForwardBuyQty: number;

  carryForwardSellQty: number;

  carryForwardBuyValue: number;

  carryForwardSellValue: number;

  dayBuyQty: number;

  daySellQty: number;

  dayBuyValue: number;

  daySellValue: number;

  drvExpiryDate: string;

  drvOptionType: string;

  drvStrikePrice: number;

  crossCurrency: boolean;
};

export type OpenPositionsResponse = {
  realizedPnL: number;

  unrealizedPnL: number;
openPositionsCount: number;
  TotalPnL: number;

  positions: OpenPosition[];
};

export const getOpenPositions =
  async (): Promise<OpenPositionsResponse> => {
    const res = await api.get(
      "/open-positions/"
    );

    return res.data;
  };

/* =========================================================
   HOLDINGS
========================================================= */

export type Holding = {
  exchange: string;

  tradingSymbol: string;

  securityId: string;

  isin: string;

  totalQty: number;

  dpQty: number;

  t1Qty: number;

  mtf_t1_qty: number;

  mtf_qty: number;

  availableQty: number;

  collateralQty: number;

  avgCostPrice: number;

  lastTradedPrice: number;
};

export type HoldingsResponse = {
  totalHoldings: number;

  totalInvestment: number;

  holdings: Holding[];
};

export const getHoldings =
  async (): Promise<HoldingsResponse> => {
    const res = await api.get(
      "/holdings/"
    );

    return res.data;
  };