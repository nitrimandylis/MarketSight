"use client";

import { useEffect, useState } from 'react';
import { getSP500Movers } from '@/app/actions';
import { StockHeatmap } from '@/components/stock-heatmap';
import { type Stock } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ExplorePage() {
    const [data, setData] = useState<{ gainers: Stock[]; losers: Stock[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setError(null);
                setIsLoading(true);
                const movers = await getSP500Movers();
                if (movers.gainers.length === 0 && movers.losers.length === 0) {
                    setError("Could not fetch market data. The API may be unavailable or the API key may be missing.");
                }
                setData(movers);
            } catch (e) {
                console.error(e);
                setError("An unexpected error occurred while fetching market data.");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const HeatmapSkeleton = () => (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {[...Array(20)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </div>
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {[...Array(20)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </div>
        </div>
    );

    const ApiKeyError = () => (
        <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 text-center">
            <Card className="max-w-md">
                <CardHeader className="items-center">
                    <AlertCircle className="w-12 h-12 text-destructive"/>
                </CardHeader>
                <CardContent className="space-y-2">
                    <h3 className="text-xl font-semibold">API Error</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <p className="text-sm text-muted-foreground pt-2">Get a free API key from <a href="https://site.financialmodelingprep.com/developer/docs" target="_blank" rel="noopener noreferrer" className="underline text-primary">Financial Modeling Prep</a> and add it to your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file.</p>
                </CardContent>
            </Card>
        </div>
      );

    if (isLoading) {
        return <HeatmapSkeleton />;
    }

    if (error) {
        return <ApiKeyError />;
    }

    return (
        <div className="space-y-8">
            <section>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Top Gainers</CardTitle>
                        <CardDescription>Top 50 performing stocks in the S&P 500 today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StockHeatmap stocks={data?.gainers ?? []} />
                    </CardContent>
                </Card>
            </section>
            <section>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Top Losers</CardTitle>
                        <CardDescription>Bottom 50 performing stocks in the S&P 500 today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StockHeatmap stocks={data?.losers ?? []} />
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
