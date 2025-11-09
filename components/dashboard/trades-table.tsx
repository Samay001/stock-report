"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  FileText
} from "lucide-react";
import { Trade } from "@/lib/types";
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from "@/lib/trade-utils";

interface TradesTableProps {
  trades: Trade[];
}

type SortField = 'date' | 'symbol' | 'side' | 'quantity' | 'price' | 'pnl';
type SortDirection = 'asc' | 'desc' | null;

export function TradesTable({ trades }: TradesTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter trades based on search
  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(search.toLowerCase()) ||
    trade.side.toLowerCase().includes(search.toLowerCase()) ||
    formatDate(trade.date).toLowerCase().includes(search.toLowerCase())
  );

  // Sort trades
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (!sortDirection) return 0;

    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle date sorting
    if (sortField === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle undefined P&L values
    if (sortField === 'pnl') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate trades
  const totalPages = Math.ceil(sortedTrades.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTrades = sortedTrades.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField('date');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Trades Table
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 w-[200px]"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToCSV(trades, "trades")}
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToJSON(trades, "trades")}
            >
              <Download className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    {getSortIcon('symbol')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('side')}>
                  <div className="flex items-center space-x-1">
                    <span>Side</span>
                    {getSortIcon('side')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('quantity')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Quantity</span>
                    {getSortIcon('quantity')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price</span>
                    {getSortIcon('price')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('pnl')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>P&L</span>
                    {getSortIcon('pnl')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? "No trades match your search" : "No trades to display"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrades.map((trade, index) => (
                  <TableRow key={`${trade.date}-${trade.symbol}-${index}`}>
                    <TableCell className="font-medium">
                      {formatDate(trade.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{trade.symbol}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={trade.side === 'BUY' ? 'default' : 'secondary'}
                        className={trade.side === 'BUY' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                      >
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {trade.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(trade.price)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      trade.pnl === undefined 
                        ? 'text-muted-foreground' 
                        : trade.pnl >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }`}>
                      {trade.pnl === undefined ? '-' : formatCurrency(trade.pnl)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedTrades.length)} of{" "}
              {sortedTrades.length} trades
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="mx-1">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}