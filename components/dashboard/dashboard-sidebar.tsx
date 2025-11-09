"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Filter, X } from "lucide-react";
import { DashboardFilters, Trade } from "@/lib/types";
import { getUniqueSymbols } from "@/lib/trade-utils";

interface DashboardSidebarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  trades: Trade[];
}

export function DashboardSidebar({ filters, onFiltersChange, trades }: DashboardSidebarProps) {
  const [symbolInput, setSymbolInput] = useState("");
  
  const symbols = getUniqueSymbols(trades);
  const pnlValues = trades.filter(t => t.pnl !== undefined).map(t => t.pnl!);
  const minPnl = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
  const maxPnl = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;

  const addSymbol = (symbol: string) => {
    if (symbol && !filters.symbols.includes(symbol)) {
      onFiltersChange({
        ...filters,
        symbols: [...filters.symbols, symbol]
      });
    }
    setSymbolInput("");
  };

  const removeSymbol = (symbol: string) => {
    onFiltersChange({
      ...filters,
      symbols: filters.symbols.filter(s => s !== symbol)
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { from: "", to: "" },
      symbols: [],
      side: "ALL",
      pnlRange: { min: minPnl, max: maxPnl }
    });
  };

  const hasActiveFilters = 
    filters.dateRange.from || 
    filters.dateRange.to || 
    filters.symbols.length > 0 || 
    filters.side !== "ALL" ||
    (filters.pnlRange.min !== minPnl || filters.pnlRange.max !== maxPnl);

  return (
    <div className="w-80 border-r bg-background p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <Input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, from: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <Input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, to: e.target.value }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Symbols */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Symbols</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Add symbol..."
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSymbol(symbolInput);
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={() => addSymbol(symbolInput)}
                disabled={!symbolInput}
              >
                Add
              </Button>
            </div>
            
            {symbols.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Available</label>
                <div className="flex flex-wrap gap-1">
                  {symbols.map(symbol => (
                    <Badge
                      key={symbol}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => addSymbol(symbol)}
                    >
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {filters.symbols.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Selected</label>
                <div className="flex flex-wrap gap-1">
                  {filters.symbols.map(symbol => (
                    <Badge
                      key={symbol}
                      className="cursor-pointer"
                      onClick={() => removeSymbol(symbol)}
                    >
                      {symbol}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Trade Side</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={filters.side}
              onValueChange={(value: "ALL" | "BUY" | "SELL") => onFiltersChange({
                ...filters,
                side: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Trades</SelectItem>
                <SelectItem value="BUY">Buy Only</SelectItem>
                <SelectItem value="SELL">Sell Only</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* P&L Range */}
        {pnlValues.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">P&L Range (₹)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                <Input
                  type="number"
                  value={filters.pnlRange.min}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    pnlRange: { ...filters.pnlRange, min: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                <Input
                  type="number"
                  value={filters.pnlRange.max}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    pnlRange: { ...filters.pnlRange, max: Number(e.target.value) }
                  })}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Range: ₹{minPnl.toLocaleString()} to ₹{maxPnl.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}