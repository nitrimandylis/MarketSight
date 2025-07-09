"use client";

import { useState, useMemo, useEffect } from "react";
import { DollarSign, LineChart, PanelLeft } from "lucide-react";

import { MOCK_STOCKS, MOCK_HISTORICAL_DATA, type Stock, type HistoricalData } from "@/lib/mock-data";
import { AIRecommender } from "@/components/ai-recommender";
import { StockChart } from "@/components/stock-chart";
import { StockDetails } from "@/components/stock-details";
import { ThemeToggle } from "@/components/theme-toggle";
import { Watchlist } from "@/components/watchlist";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function Dashboard() {
  const [watchlist] = useState<Stock[]>(MOCK_STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock>(MOCK_STOCKS[0]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    setHistoricalData(MOCK_HISTORICAL_DATA(new Date(), 90, selectedStock.price));
  }, [selectedStock]);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const userStockTickers = useMemo(() => watchlist.map((s) => s.ticker), [watchlist]);

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
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden"/>
              <h2 className="text-2xl font-headline font-bold">
                {selectedStock.name} ({selectedStock.ticker})
              </h2>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 space-y-6 md:p-6">
            <section>
              <StockChart data={historicalData} stock={selectedStock} />
            </section>
            <section>
              <StockDetails stock={selectedStock} />
            </section>
            <section>
              <AIRecommender userStocks={userStockTickers} />
            </section>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
