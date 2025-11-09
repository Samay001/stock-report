import { Trade } from "./types";

export const demoTrades: Trade[] = [
  {
    date: "2025-01-01",
    symbol: "INFY",
    side: "BUY",
    quantity: 100,
    price: 1450.00,
    pnl: 2500.00
  },
  {
    date: "2025-01-02",
    symbol: "RELIANCE",
    side: "BUY",
    quantity: 50,
    price: 2850.50,
    pnl: -1200.00
  },
  {
    date: "2025-01-03",
    symbol: "TCS",
    side: "SELL",
    quantity: 25,
    price: 3200.75,
    pnl: 1850.25
  },
  {
    date: "2025-01-04",
    symbol: "HDFCBANK",
    side: "BUY",
    quantity: 75,
    price: 1650.20,
    pnl: 3200.00
  },
  {
    date: "2025-01-05",
    symbol: "LT",
    side: "SELL",
    quantity: 30,
    price: 3450.00,
    pnl: -800.50
  },
  {
    date: "2025-01-06",
    symbol: "INFY",
    side: "SELL",
    quantity: 100,
    price: 1475.00,
    pnl: 2500.00
  },
  {
    date: "2025-01-07",
    symbol: "RELIANCE",
    side: "BUY",
    quantity: 40,
    price: 2820.00,
    pnl: 1600.00
  },
  {
    date: "2025-01-08",
    symbol: "TCS",
    side: "BUY",
    quantity: 20,
    price: 3180.50,
    pnl: -950.00
  },
  {
    date: "2025-01-09",
    symbol: "HDFCBANK",
    side: "SELL",
    quantity: 60,
    price: 1680.75,
    pnl: 2800.00
  },
  {
    date: "2025-01-10",
    symbol: "LT",
    side: "BUY",
    quantity: 45,
    price: 3400.25,
    pnl: 1200.75
  },
  {
    date: "2025-01-11",
    symbol: "INFY",
    side: "BUY",
    quantity: 80,
    price: 1465.00,
    pnl: -1500.00
  },
  {
    date: "2025-01-12",
    symbol: "RELIANCE",
    side: "SELL",
    quantity: 35,
    price: 2875.25,
    pnl: 2200.50
  },
  {
    date: "2025-01-13",
    symbol: "TCS",
    side: "BUY",
    quantity: 15,
    price: 3250.00,
    pnl: 850.00
  },
  {
    date: "2025-01-14",
    symbol: "HDFCBANK",
    side: "SELL",
    quantity: 90,
    price: 1695.50,
    pnl: 4100.00
  },
  {
    date: "2025-01-15",
    symbol: "LT",
    side: "SELL",
    quantity: 25,
    price: 3485.75,
    pnl: -600.25
  }
];

export const getDemoInsights = () => ({
  bullets: [
    "15 trades executed across 5 blue-chip stocks with a 66.7% win rate",
    "Strong performance in banking sector with HDFCBANK contributing ₹10,100 profit",
    "INFY showed mixed results with ₹3,500 net gain across 3 trades",
    "LT underperformed with ₹-200 net loss and 33% win rate",
    "Average winning trade of ₹2,415 vs average loss of ₹-1,210",
    "Best single trade: HDFCBANK SELL on 2025-01-14 with ₹4,100 profit",
    "Position sizing varied from 15 to 100 shares per trade",
    "Trading activity concentrated in first half of January"
  ],
  conclusion: "The trading performance shows a solid foundation with a positive win rate of 66.7% and gross P&L of ₹16,750. The strategy demonstrates good stock selection across quality blue-chip names, with particularly strong performance in banking (HDFCBANK) and technology (INFY, TCS) sectors. However, there's room for improvement in risk management, as evidenced by the mixed performance in LT and some larger losing trades. The trader shows discipline in position sizing and appears to favor quality large-cap stocks, which is a prudent approach for consistent returns.",
  stats: {
    totalTrades: 15,
    wins: 10,
    losses: 5,
    winRate: 0.667,
    grossPnl: 16750.75,
    avgWin: 2415.0,
    avgLoss: -1210.0,
    bestTrade: { symbol: "HDFCBANK", pnl: 4100.0, date: "2025-01-14" },
    worstTrade: { symbol: "INFY", pnl: -1500.0, date: "2025-01-11" }
  }
});