"use client";

import { useState, useMemo } from "react";
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

type SortDirection = 'asc' | 'desc' | null;

interface ColumnConfig {
  key: string;
  label: string;
  sortable: boolean;
  align?: 'left' | 'right' | 'center';
  format: (value: any, trade: Trade) => string | React.ReactNode;
}

export function TradesTable({ trades }: TradesTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dynamically detect all available columns from the trades data
  const columns = useMemo(() => {
    if (trades.length === 0) return [];
    
    // Get all unique keys from all trades (in case some trades have optional fields)
    const allKeys = new Set<string>();
    trades.forEach(trade => {
      Object.keys(trade).forEach(key => allKeys.add(key));
    });
    
    // Define column configurations with display names and formatting
    const columnConfigs: Record<string, Partial<ColumnConfig>> = {
      date: { 
        label: 'Date', 
        sortable: true,
        format: (value) => formatDate(value)
      },
      symbol: { 
        label: 'Symbol', 
        sortable: true,
        format: (value) => <Badge variant="outline">{value}</Badge>
      },
      side: { 
        label: 'Side', 
        sortable: true,
        format: (value) => (
          <Badge 
            variant={value === 'BUY' ? 'default' : 'secondary'}
            className={value === 'BUY' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
          >
            {value}
          </Badge>
        )
      },
      quantity: { 
        label: 'Quantity', 
        sortable: true, 
        align: 'right',
        format: (value) => value?.toLocaleString() || '-'
      },
      price: { 
        label: 'Price', 
        sortable: true, 
        align: 'right',
        format: (value) => formatCurrency(value)
      },
      pnl: { 
        label: 'P&L', 
        sortable: true, 
        align: 'right',
        format: (value) => value !== undefined ? formatCurrency(value) : '-'
      },
    };
    
    // Return columns that exist in the data, in preferred order
    const preferredOrder = ['date', 'symbol', 'side', 'quantity', 'price', 'pnl'];
    const orderedColumns = preferredOrder.filter(col => allKeys.has(col));
    
    // Add any additional columns not in the preferred order
    const additionalColumns = Array.from(allKeys).filter(col => !preferredOrder.includes(col));
    
    return [...orderedColumns, ...additionalColumns].map(key => ({
      key,
      label: columnConfigs[key]?.label || key.charAt(0).toUpperCase() + key.slice(1),
      sortable: columnConfigs[key]?.sortable ?? true,
      align: columnConfigs[key]?.align || 'left',
      format: columnConfigs[key]?.format || ((value: any) => String(value ?? '-'))
    })) as ColumnConfig[];
  }, [trades]);

  // Filter trades based on search (search across all fields)
  const filteredTrades = useMemo(() => {
    if (!search) return trades;
    
    return trades.filter(trade =>
      Object.values(trade).some(value => 
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [trades, search]);

  // Sort trades
  const sortedTrades = useMemo(() => {
    if (!sortDirection || !sortField) return filteredTrades;

    return [...filteredTrades].sort((a, b) => {
      let aValue: any = (a as any)[sortField];
      let bValue: any = (b as any)[sortField];

      // Handle date sorting
      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle undefined/null values
      if (aValue == null) aValue = 0;
      if (bValue == null) bValue = 0;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTrades, sortField, sortDirection]);

  // Paginate trades
  const totalPages = Math.ceil(sortedTrades.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTrades = sortedTrades.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: string) => {
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

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const getCellClassName = (columnKey: string, value: any) => {
    let className = "";
    
    // Add alignment
    const column = columns.find(col => col.key === columnKey);
    if (column?.align === 'right') className += "text-right ";
    if (column?.align === 'center') className += "text-center ";
    
    // Special styling for certain fields
    if (columnKey === 'date') className += "font-medium ";
    if (columnKey === 'pnl') {
      className += "font-medium ";
      if (value === undefined || value === null) {
        className += "text-muted-foreground";
      } else if (value >= 0) {
        className += "text-green-600";
      } else {
        className += "text-red-600";
      }
    }
    
    return className.trim();
  };

  console.log('📊 TradesTable: Rendering with', trades.length, 'trades');
  console.log('📋 TradesTable: Detected columns:', columns.map(c => c.key));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Trades Table ({trades.length} total)
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
              disabled={trades.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToJSON(trades, "trades")}
              disabled={trades.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trades data available</p>
            <p className="text-sm">Upload a report or load demo data to see trades</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={`${column.sortable ? 'cursor-pointer' : ''} ${
                          column.align === 'right' ? 'text-right' : ''
                        }`}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className={`flex items-center space-x-1 ${
                          column.align === 'right' ? 'justify-end' : ''
                        }`}>
                          <span>{column.label}</span>
                          {column.sortable && getSortIcon(column.key)}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                        {search ? "No trades match your search" : "No trades to display"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTrades.map((trade, index) => (
                      <TableRow key={`${trade.date}-${trade.symbol}-${index}`}>
                        {columns.map((column) => {
                          const value = (trade as any)[column.key];
                          return (
                            <TableCell 
                              key={column.key} 
                              className={getCellClassName(column.key, value)}
                            >
                              {column.format(value, trade)}
                            </TableCell>
                          );
                        })}
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
                  {search && ` (filtered from ${trades.length} total)`}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
