// *** Base stock info
export type MoreInfo = {
  cap: string;
  capRank: string;
  amountOfListed: string;
  week52high: string;
  week52low: string;
  per: string;
  pbr: string;
  dividendYield: string;
  industryPer: string;
  industryChange: string;
};

export type PriceInfo = {
  today: string;
  exday: string;
  change: string;
  changePercent: string;
  high: string;
  low: string;
  start: string;
  volume: string;
  tradingValue: string;
};

export type StockInfo = {
  name: string;
  code: string;
  market: string;
  price: PriceInfo;
  more: MoreInfo;
};

// *** Statistics
export type TodaysStat = StockInfo & {
  score: number | null;
};

type ForecastStat = {
  sell: number;
  hold: number;
  buy: number;
};
export type MarketStat = {
  kospi: ForecastStat;
  kosdaq: ForecastStat;
};

// *** Comments
export type Comment = {
  id: number;
  user?: User;
  message: string;
  tags: string[];
  createdAt: string;
};

// *** User
export type User = {
  id: number;
  name: string;
};

// *** Tournament
export type Tournament = {
  id: number;
  eventDate: string;
  stockInfo: string;
  marketStat?: string;
  scores?: string;
  comments?: Comment[];
};
