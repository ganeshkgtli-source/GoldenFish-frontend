export type Position = {
  id: number;

  user_id: number;

  dhanClientId: string;

  tradingSymbol: string;

  securityId: string;

  positionType: string;

  exchangeSegment: string;

  productType: string;

  buyAvg: string;

  costPrice: string;

  buyQty: number;

  sellAvg: string;

  sellQty: number;

  netQty: number;

  realizedProfit: string;

  unrealizedProfit: string;

  rbiReferenceRate: string;

  multiplier: number;

  carryForwardBuyQty: number;

  carryForwardSellQty: number;

  carryForwardBuyValue: string;

  carryForwardSellValue: string;

  dayBuyQty: number;

  daySellQty: number;

  dayBuyValue: string;

  daySellValue: string;

  drvExpiryDate: string | null;

  drvOptionType: string;

  drvStrikePrice: string;

  crossCurrency: boolean;

  created_at: string;

  updated_at: string;
};