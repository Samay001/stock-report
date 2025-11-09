import { Trade, InsightsResponse } from "./types";
import { format } from "date-fns";

export const formatCurrency = (amount: number, currency = "INR") => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd MMM yyyy");
};

export const calculateStats = (trades: Trade[]): InsightsResponse["stats"] => {
  const tradesWithPnl = trades.filter(t => t.pnl !== undefined);
  const wins = tradesWithPnl.filter(t => t.pnl! > 0);
  const losses = tradesWithPnl.filter(t => t.pnl! < 0);
  
  const totalPnl = tradesWithPnl.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl!, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + t.pnl!, 0) / losses.length : 0;
  
  const bestTrade = wins.reduce((best, trade) => 
    !best || trade.pnl! > best.pnl ? { symbol: trade.symbol, pnl: trade.pnl!, date: trade.date } : best, 
    null as any
  );
  
  const worstTrade = losses.reduce((worst, trade) => 
    !worst || trade.pnl! < worst.pnl ? { symbol: trade.symbol, pnl: trade.pnl!, date: trade.date } : worst, 
    null as any
  );

  return {
    totalTrades: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: tradesWithPnl.length > 0 ? wins.length / tradesWithPnl.length : 0,
    grossPnl: totalPnl,
    avgWin,
    avgLoss,
    bestTrade,
    worstTrade
  };
};

export const getUniqueSymbols = (trades: Trade[]) => {
  return Array.from(new Set(trades.map(t => t.symbol))).sort();
};

export const exportToCSV = (trades: Trade[], filename = "trades") => {
  const headers = ["Date", "Symbol", "Side", "Quantity", "Price", "P&L"];
  const rows = trades.map(trade => [
    trade.date,
    trade.symbol,
    trade.side,
    trade.quantity.toString(),
    trade.price.toString(),
    (trade.pnl || 0).toString()
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (trades: Trade[], filename = "trades") => {
  const jsonContent = JSON.stringify(trades, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};