"use client";

import Image from "next/image";
import { type Stock } from "@/lib/types";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

interface WatchlistProps {
  stocks: Stock[];
  selectedStock: Stock | null;
  onSelectStock: (stock: Stock) => void;
  isLoading: boolean;
}

export function Watchlist({ stocks, selectedStock, onSelectStock, isLoading }: WatchlistProps) {
  
  const WatchlistSkeleton = () => (
    <SidebarMenu>
      {[...Array(6)].map((_, i) => (
         <SidebarMenuItem key={i}>
            <div className="flex items-center gap-2 p-2 h-14 w-full">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
         </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Watchlist</SidebarGroupLabel>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {isLoading ? <WatchlistSkeleton /> : (
            <SidebarMenu>
            {stocks.map((stock) => {
                const isUp = stock.change > 0;
                return (
                <SidebarMenuItem key={stock.ticker}>
                    <SidebarMenuButton
                    onClick={() => onSelectStock(stock)}
                    isActive={selectedStock?.ticker === stock.ticker}
                    className="h-14 justify-start"
                    tooltip={stock.name}
                    >
                    <Image
                        src={`https://financialmodelingprep.com/image-stock/${stock.ticker}.png`}
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/32x32.png` }}
                        data-ai-hint={`${stock.name} logo`}
                        alt={`${stock.name} logo`}
                        width={32}
                        height={32}
                        className="rounded-full bg-muted"
                    />
                    <div className="flex flex-col items-start">
                        <span className="font-semibold">{stock.ticker}</span>
                        <span className="text-xs text-muted-foreground">{stock.name}</span>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                        <span className="font-semibold">${stock.price.toFixed(2)}</span>
                        <span
                        className={cn(
                            "text-xs font-semibold",
                            isUp ? "text-success" : "text-destructive"
                        )}
                        >
                        {isUp ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                );
            })}
            </SidebarMenu>
        )}
      </ScrollArea>
    </SidebarGroup>
  );
}
