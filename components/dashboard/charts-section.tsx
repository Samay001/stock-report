"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/trade-utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ChartsSectionProps {
  trades: Trade[];
}

export function ChartsSection({ trades }: ChartsSectionProps) {
  // Equity Curve Data
  const equityCurveData = trades
    .filter(t => t.pnl !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const cumPnl = (acc[index - 1]?.cumPnl || 0) + (trade.pnl || 0);
      return [
        ...acc,
        {
          date: formatDate(trade.date),
          pnl: trade.pnl,
          cumPnl,
          symbol: trade.symbol
        }
      ];
    }, [] as any[]);

  // P&L by Symbol Data
  const pnlBySymbol = trades
    .filter(t => t.pnl !== undefined)
    .reduce((acc, trade) => {
      const existing = acc.find(item => item.symbol === trade.symbol);
      if (existing) {
        existing.pnl += trade.pnl || 0;
        existing.trades += 1;
      } else {
        acc.push({
          symbol: trade.symbol,
          pnl: trade.pnl || 0,
          trades: 1
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.pnl - a.pnl);

  // Side Mix Data
  const sideMixData = trades.reduce((acc, trade) => {
    const existing = acc.find(item => item.side === trade.side);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ side: trade.side, count: 1 });
    }
    return acc;
  }, [] as any[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="equity-curve" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equity-curve">Equity Curve</TabsTrigger>
            <TabsTrigger value="pnl-by-symbol">P&L by Symbol</TabsTrigger>
            <TabsTrigger value="side-mix">Side Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equity-curve" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    fontSize={12}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), "Cumulative P&L"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumPnl" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="pnl-by-symbol" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pnlBySymbol}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" fontSize={12} />
                  <YAxis 
                    fontSize={12}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), "Total P&L"]}
                    labelFormatter={(label) => `Symbol: ${label}`}
                  />
                  <Bar 
                    dataKey="pnl" 
                    fill="#8884d8"
                    name="P&L"
                  >
                    {pnlBySymbol.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? '#00C49F' : '#FF8042'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="side-mix" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sideMixData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ side, count, percent }: any) => 
                      `${side}: ${count} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sideMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}