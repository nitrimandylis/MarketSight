'use server';

import * as stockService from '@/services/stock-service';
import type { Stock, HistoricalData, TimeSpan } from '@/lib/types';

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
    const historicalData = await stockService.fetchHistoricalData(selectedStock.ticker, '1Y');

    return {
        watchlist,
        selectedStock,
        historicalData
    };
}

export async function getStockDataForTicker(ticker: string, timeSpan: TimeSpan) {
    const [selectedStock, historicalData] = await Promise.all([
        stockService.fetchStockDetails(ticker),
        stockService.fetchHistoricalData(ticker, timeSpan),
    ]);

    if (!selectedStock) {
        // Handle case where a single stock fetch fails
        return { selectedStock: null, historicalData: [] };
    }

    return { selectedStock, historicalData };
}

export async function getHistoricalDataForTicker(ticker: string, timeSpan: TimeSpan) {
    const historicalData = await stockService.fetchHistoricalData(ticker, timeSpan);
    return { historicalData };
}
