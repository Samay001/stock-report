"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { TradesTable } from "@/components/dashboard/trades-table";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { UploadArea } from "@/components/dashboard/upload-area";
import { Trade, DashboardFilters, InsightsResponse } from "@/lib/types";
import { demoTrades, getDemoInsights } from "@/lib/demo-data";
import { calculateStats } from "@/lib/trade-utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: { from: "", to: "" },
    symbols: [],
    side: "ALL",
    pnlRange: { min: 0, max: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter trades based on current filters
  const filteredTrades = trades.filter(trade => {
    // Date filter
    if (filters.dateRange.from && trade.date < filters.dateRange.from) return false;
    if (filters.dateRange.to && trade.date > filters.dateRange.to) return false;
    
    // Symbol filter
    if (filters.symbols.length > 0 && !filters.symbols.includes(trade.symbol)) return false;
    
    // Side filter
    if (filters.side !== "ALL" && trade.side !== filters.side) return false;
    
    // P&L filter
    if (trade.pnl !== undefined) {
      if (trade.pnl < filters.pnlRange.min || trade.pnl > filters.pnlRange.max) return false;
    }
    
    return true;
  });

  const loadDemoData = () => {
    setTrades(demoTrades);
    setInsights(getDemoInsights());
    toast.success("Demo data loaded successfully!");
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    console.log('📁 Starting file upload:', file.name, file.type, file.size);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('🚀 Sending request to /api/parse-report...');
      const response = await fetch('/api/parse-report', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Parse error:', errorData);
        throw new Error(errorData.error || 'Failed to parse report');
      }
      
      const data = await response.json();
      console.log('✅ Parsed data received:', data);
      console.log('📊 Number of trades:', data.trades?.length);
      
      setTrades(data.trades);
      
      // Generate insights
      console.log('🧠 Generating insights for', data.trades.length, 'trades...');
      const insightsResponse = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades: data.trades }),
      });
      
      console.log('📥 Insights response status:', insightsResponse.status);
      
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        console.log('✅ Insights generated:', insightsData);
        setInsights(insightsData);
      } else {
        console.warn('⚠️ Insights generation failed but continuing...');
      }
      
      // Save to recent uploads
      if (typeof window !== 'undefined') {
        const { addRecentUpload } = await import('@/lib/localStorage');
        addRecentUpload({
          filename: file.name,
          timestamp: new Date().toISOString(),
          summary: `${data.trades.length} trades parsed`,
          tradesCount: data.trades.length
        });
      }
      
      toast.success(`Successfully parsed ${data.trades.length} trades`);
      console.log('🎉 Upload complete! Trades loaded into state.');
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Failed to parse report. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Upload process finished. Loading state:', false);
    }
  };

  const regenerateInsights = async () => {
    if (trades.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      setInsights(data);
      toast.success("Insights regenerated successfully!");
    } catch (error) {
      console.error('Insights error:', error);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = trades.length > 0;

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar 
        filters={filters}
        onFiltersChange={setFilters}
        trades={trades}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-auto p-6">
          {!hasData ? (
            <div className="h-full flex items-center justify-center">
              <UploadArea 
                onFileUpload={handleFileUpload}
                onLoadDemo={loadDemoData}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <SummaryCards trades={filteredTrades} />
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ChartsSection trades={filteredTrades} />
                  <TradesTable trades={filteredTrades} />
                </div>
                
                <div className="lg:col-span-1">
                  <InsightsPanel 
                    insights={insights}
                    onRegenerate={regenerateInsights}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}