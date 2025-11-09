export type Trade = {
  date: string;        // ISO, e.g. "2025-01-01"
  symbol: string;      // e.g. "INFY", "RELIANCE", "TCS"
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  pnl?: number;        // optional per-trade P&L
};

export type ParseReportResponse = {
  trades: Trade[];
  meta: {
    currency?: string;        // default "INR"
    source?: "ocr" | "csv" | "pdf";
    rowsParsed: number;
    parseConfidence: number;  // 0-1
  };
};

export type InsightsResponse = {
  bullets: string[];         // 5–8 crisp bullet points
  conclusion: string;        // 1 paragraph
  stats: {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;         // 0-1
    grossPnl: number;
    avgWin: number;
    avgLoss: number;
    bestTrade?: { symbol: string; pnl: number; date: string };
    worstTrade?: { symbol: string; pnl: number; date: string };
  };
};

export type RecentUpload = {
  id: string;
  filename: string;
  timestamp: string;
  summary: string;
  tradesCount: number;
};

export type DashboardFilters = {
  dateRange: {
    from: string;
    to: string;
  };
  symbols: string[];
  side: "ALL" | "BUY" | "SELL";
  pnlRange: {
    min: number;
    max: number;
  };
};