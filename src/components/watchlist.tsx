"use client";

import Image from "next/image";
import { type Stock } from "@/lib/mock-data";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

interface WatchlistProps {
  stocks: Stock[];
  selectedStock: Stock;
  onSelectStock: (stock: Stock) => void;
}

export function Watchlist({ stocks, selectedStock, onSelectStock }: WatchlistProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Watchlist</SidebarGroupLabel>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <SidebarMenu>
          {stocks.map((stock) => {
            const isUp = stock.change > 0;
            return (
              <SidebarMenuItem key={stock.ticker}>
                <SidebarMenuButton
                  onClick={() => onSelectStock(stock)}
                  isActive={selectedStock.ticker === stock.ticker}
                  className="h-14 justify-start"
                  tooltip={stock.name}
                >
                  <Image
                    src={`https://placehold.co/32x32.png`}
                    data-ai-hint={`${stock.name} logo`}
                    alt={`${stock.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
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
      </ScrollArea>
    </SidebarGroup>
  );
}
