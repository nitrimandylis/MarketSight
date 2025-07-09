"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Stock } from "@/lib/mock-data";
import { BarChart, Briefcase, Boxes, Gauge, Scale } from "lucide-react";

interface StockDetailsProps {
  stock: Stock;
}

const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
};

export function StockDetails({ stock }: StockDetailsProps) {
  const details = [
    { label: "Market Cap", value: `$${formatNumber(stock.marketCap)}`, icon: Briefcase },
    { label: "Volume", value: formatNumber(stock.volume), icon: BarChart },
    { label: "P/E Ratio", value: stock.peRatio.toFixed(2), icon: Scale },
    { label: "52-Wk High", value: `$${stock.high52W.toFixed(2)}`, icon: Gauge },
    { label: "52-Wk Low", value: `$${stock.low52W.toFixed(2)}`, icon: Gauge },
    { label: "Dividend Yield", value: `${stock.dividendYield.toFixed(2)}%`, icon: Boxes },
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
