"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3 } from "lucide-react";
import { Trade } from "@/lib/types";
import { calculateStats, formatCurrency } from "@/lib/trade-utils";

interface SummaryCardsProps {
  trades: Trade[];
}

export function SummaryCards({ trades }: SummaryCardsProps) {
  const stats = calculateStats(trades);

  const cards = [
    {
      title: "Total Trades",
      value: stats.totalTrades.toString(),
      icon: BarChart3,
      description: `${stats.wins} wins, ${stats.losses} losses`
    },
    {
      title: "Win Rate",
      value: `${(stats.winRate * 100).toFixed(1)}%`,
      icon: Target,
      description: `${stats.wins} winning trades`,
      trend: stats.winRate >= 0.6 ? "positive" : stats.winRate >= 0.4 ? "neutral" : "negative"
    },
    {
      title: "Gross P&L",
      value: formatCurrency(stats.grossPnl),
      icon: stats.grossPnl >= 0 ? TrendingUp : TrendingDown,
      description: stats.grossPnl >= 0 ? "Total profit" : "Total loss",
      trend: stats.grossPnl >= 0 ? "positive" : "negative"
    },
    {
      title: "Avg Win",
      value: formatCurrency(stats.avgWin),
      icon: TrendingUp,
      description: `From ${stats.wins} winning trades`,
      trend: "positive"
    },
    {
      title: "Avg Loss",
      value: formatCurrency(Math.abs(stats.avgLoss)),
      icon: TrendingDown,
      description: `From ${stats.losses} losing trades`,
      trend: "negative"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${
                card.trend === "positive" 
                  ? "text-green-600" 
                  : card.trend === "negative" 
                    ? "text-red-600" 
                    : "text-muted-foreground"
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                card.trend === "positive" 
                  ? "text-green-600" 
                  : card.trend === "negative" 
                    ? "text-red-600" 
                    : ""
              }`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}