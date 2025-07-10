"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Stock } from "@/lib/types";
import { BarChart, Briefcase, Boxes, Gauge, Scale, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface StockDetailsProps {
  stock: Stock;
  isLoading?: boolean;
}

const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
};

export function StockDetails({ stock, isLoading = false }: StockDetailsProps) {
  
  if (isLoading) {
    return (
        <div>
            <h3 className="text-2xl font-headline font-bold mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="h-7 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
  }

  const details = [
    { label: "Market Cap", value: stock.marketCap ? `$${formatNumber(stock.marketCap)}` : 'N/A', icon: Briefcase },
    { label: "Volume", value: stock.volume ? formatNumber(stock.volume) : 'N/A', icon: BarChart },
    { label: "P/E Ratio", value: stock.peRatio?.toFixed(2) ?? 'N/A', icon: Scale },
    { label: "52-Wk High", value: stock.high52W ? `$${stock.high52W.toFixed(2)}` : 'N/A', icon: TrendingUp },
    { label: "52-Wk Low", value: stock.low52W ? `$${stock.low52W.toFixed(2)}` : 'N/A', icon: TrendingDown },
    { label: "Div Yield", value: stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A', icon: Boxes },
  ];

  return (
    <div>
        <h3 className="text-2xl font-headline font-bold mb-4">Key Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {details.map((detail) => (
            <Card key={detail.label} className="shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{detail.label}</CardTitle>
                <detail.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{detail.value}</div>
            </CardContent>
            </Card>
        ))}
        </div>
    </div>
  );
}
