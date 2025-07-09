'use server';

import * as stockService from '@/services/stock-service';
import type { Stock } from '@/lib/types';

const INITIAL_WATCHLIST = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT", "NVDA"];

export async function getInitialDashboardData() {
    const watchlistPromises = INITIAL_WATCHLIST.map(ticker => stockService.fetchStockDetails(ticker));
    const watchlistResults = await Promise.all(watchlistPromises);
    const watchlist = watchlistResults.filter(Boolean) as Stock[];
    
    if (watchlist.length === 0) {
        // If API fails, return empty state. The UI will show an error message.
        return { watchlist: [], selectedStock: null, historicalData: [] };
    }

    const selectedStock = watchlist[0];
    const historicalData = await stockService.fetchHistoricalData(selectedStock.ticker);

    return {
        watchlist,
        selectedStock,
        historicalData
    };
}

export async function getStockDataForTicker(ticker: string) {
    const [selectedStock, historicalData] = await Promise.all([
        stockService.fetchStockDetails(ticker),
        stockService.fetchHistoricalData(ticker),
    ]);

    if (!selectedStock) {
        // Handle case where a single stock fetch fails
        return { selectedStock: null, historicalData: [] };
    }

    return { selectedStock, historicalData };
}
