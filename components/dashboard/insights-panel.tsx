"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, TrendingUp, TrendingDown, Target } from "lucide-react";
import { InsightsResponse } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/trade-utils";

interface InsightsPanelProps {
  insights: InsightsResponse | null;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function InsightsPanel({ insights, onRegenerate, isLoading }: InsightsPanelProps) {
  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload trades to generate AI insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { bullets, conclusion, stats } = insights;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Insights
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(stats.winRate * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className={`text-2xl font-bold ${stats.grossPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.grossPnl).replace('₹', '₹')}
            </div>
            <div className="text-xs text-muted-foreground">Total P&L</div>
          </div>
        </div>

        <Separator />

        {/* Key Insights Bullets */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Key Insights
          </h4>
          <ul className="space-y-2">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Best & Worst Trades */}
        {stats.bestTrade && stats.worstTrade && (
          <div className="space-y-3">
            <h4 className="font-semibold">Notable Trades</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Best Trade</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.bestTrade.symbol} • {formatDate(stats.bestTrade.date)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {formatCurrency(stats.bestTrade.pnl)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-sm font-medium">Worst Trade</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.worstTrade.symbol} • {formatDate(stats.worstTrade.date)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {formatCurrency(stats.worstTrade.pnl)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* AI Conclusion */}
        <div>
          <h4 className="font-semibold mb-3">Analysis Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {conclusion}
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(stats.avgWin)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Win</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {formatCurrency(Math.abs(stats.avgLoss))}
            </div>
            <div className="text-xs text-muted-foreground">Avg Loss</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}