"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type HistoricalData, type Stock } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "./ui/skeleton";

interface StockChartProps {
  data: HistoricalData[];
  stock: Stock;
  isLoading?: boolean;
}

export function StockChart({ data, stock, isLoading = false }: StockChartProps) {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [data]);

  const isUp = stock.change > 0;
  const chartColor = isUp ? "hsl(var(--success))" : "hsl(var(--destructive))";

  const chartConfig = {
    price: {
      label: "Price",
      color: chartColor,
    },
  };

  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Price History (90 Days)</CardTitle>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${stock.price.toFixed(2)}</span>
            <span className={`text-sm font-semibold ${isUp ? 'text-success' : 'text-destructive'}`}>
                {isUp ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
        </div>
        <CardDescription>
          Last updated: {lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColor}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={["dataMin - 10", "dataMax + 10"]}
                hide
              />
              <Tooltip
                cursor={{
                  stroke: "hsl(var(--border))",
                  strokeWidth: 2,
                  strokeDasharray: "3 3",
                }}
                content={<ChartTooltipContent indicator="line" formatter={(value) => `$${(value as number).toFixed(2)}`}/>}
              />
              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
