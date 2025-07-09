"use client";

import { useState, useMemo, useEffect } from "react";
import { DollarSign, AlertCircle } from "lucide-react";

import type { Stock, HistoricalData, TimeSpan } from "@/lib/types";
import { getInitialDashboardData, getStockDataForTicker, getHistoricalDataForTicker } from "@/app/actions";

import { AIRecommender } from "@/components/ai-recommender";
import { StockChart } from "@/components/stock-chart";
import { StockDetails } from "@/components/stock-details";
import { ThemeToggle } from "@/components/theme-toggle";
import { Watchlist } from "@/components/watchlist";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function Dashboard() {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingStock, setIsSwitchingStock] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeSpan, setSelectedTimeSpan] = useState<TimeSpan>('1Y');

  useEffect(() => {
    async function loadInitialData() {
      try {
        setError(null);
        setIsLoading(true);
        const data = await getInitialDashboardData();
        if(data.watchlist.length === 0) {
          setError("Could not fetch stock data. Please ensure your FMP_API_KEY is set correctly in the .env file.");
        } else {
          setWatchlist(data.watchlist);
          setSelectedStock(data.selectedStock);
          setHistoricalData(data.historicalData);
        }
      } catch (e) {
        console.error(e);
        setError("An unexpected error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleSelectStock = async (stock: Stock) => {
    if (selectedStock?.ticker === stock.ticker) return;

    try {
        setIsSwitchingStock(true);
        setSelectedStock(stock);
        const data = await getStockDataForTicker(stock.ticker, selectedTimeSpan);
        if(data.selectedStock) {
          setSelectedStock(data.selectedStock);
          setHistoricalData(data.historicalData);
        } else {
            console.error(`Could not load data for ${stock.ticker}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSwitchingStock(false);
    }
  };

  const handleTimeSpanChange = async (timeSpan: TimeSpan) => {
    if (!selectedStock || timeSpan === selectedTimeSpan) return;

    try {
        setIsChartLoading(true);
        setSelectedTimeSpan(timeSpan);
        const { historicalData: newHistoricalData } = await getHistoricalDataForTicker(selectedStock.ticker, timeSpan);
        setHistoricalData(newHistoricalData);
    } catch (e) {
        console.error(e);
    } finally {
        setIsChartLoading(false);
    }
};

  const userStockTickers = useMemo(() => watchlist.map((s) => s.ticker), [watchlist]);
  
  const DashboardSkeleton = () => (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  const ApiKeyError = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 text-center">
        <Card className="max-w-md">
            <CardHeader className="items-center">
                <AlertCircle className="w-12 h-12 text-destructive"/>
            </CardHeader>
            <CardContent className="space-y-2">
                <h3 className="text-xl font-semibold">API Key Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <p className="text-sm text-muted-foreground pt-2">Get a free API key from <a href="https://site.financialmodelingprep.com/developer/docs" target="_blank" rel="noopener noreferrer" className="underline text-primary">Financial Modeling Prep</a> and add it to your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file.</p>
            </CardContent>
        </Card>
    </div>
  );


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="bg-primary/10 hover:bg-primary/20">
                <DollarSign className="w-6 h-6 text-primary" />
            </Button>
            <h1 className="text-xl font-headline font-semibold">MarketSight</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Watchlist
            stocks={watchlist}
            onSelectStock={handleSelectStock}
            selectedStock={selectedStock}
            isLoading={isLoading}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden"/>
              <h2 className="text-2xl font-headline font-bold">
                {isLoading ? <Skeleton className="h-8 w-48" /> : (selectedStock ? `${selectedStock.name} (${selectedStock.ticker})` : "Dashboard")}
              </h2>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1">
            {isLoading ? <DashboardSkeleton /> : 
             error ? <ApiKeyError /> :
             selectedStock ? (
              <div className="p-4 md:p-6 space-y-6">
                <section>
                  <StockChart 
                    data={historicalData} 
                    stock={selectedStock} 
                    isLoading={isSwitchingStock || isChartLoading} 
                    selectedTimeSpan={selectedTimeSpan}
                    onTimeSpanChange={handleTimeSpanChange}
                  />
                </section>
                <section>
                  <StockDetails stock={selectedStock} isLoading={isSwitchingStock} />
                </section>
                <section>
                  <AIRecommender userStocks={userStockTickers} />
                </section>
              </div>
            ) : null}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
