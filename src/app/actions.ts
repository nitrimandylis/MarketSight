'use server';

import * as stockService from '@/services/stock-service';
import type { Stock, HistoricalData, TimeSpan, SearchResult } from '@/lib/types';

// This is now a fallback if localStorage is empty
const INITIAL_WATCHLIST = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT", "NVDA"];

export async function getWatchlistData(tickers: string[]): Promise<Stock[]> {
    const watchlistPromises = tickers.map(ticker => stockService.fetchStockDetails(ticker));
    const watchlistResults = await Promise.all(watchlistPromises);
    return watchlistResults.filter(Boolean) as Stock[];
}


export async function getInitialDashboardData(tickers: string[] | null) {
    const targetWatchlist = tickers && tickers.length > 0 ? tickers : INITIAL_WATCHLIST;
    
    const watchlist = await getWatchlistData(targetWatchlist);
    
    if (watchlist.length === 0) {
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
        return { selectedStock: null, historicalData: [] };
    }

    return { selectedStock, historicalData };
}

export async function getHistoricalDataForTicker(ticker: string, timeSpan: TimeSpan) {
    const historicalData = await stockService.fetchHistoricalData(ticker, timeSpan);
    return { historicalData };
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
    if (!query) return [];
    const results = await stockService.searchStocks(query);
    return results;
}

export async function getDashboardForTicker(ticker: string, currentWatchlist: string[] | null) {
    const stock = await stockService.fetchStockDetails(ticker);
    if (!stock) {
        return null;
    }

    let watchlistTickers = currentWatchlist || INITIAL_WATCHLIST;
    if (!watchlistTickers.includes(ticker)) {
        watchlistTickers = [ticker, ...watchlistTickers];
    }
    
    const watchlist = await getWatchlistData(watchlistTickers);
    const historicalData = await stockService.fetchHistoricalData(ticker, '1Y');

    return {
        watchlist,
        selectedStock: stock,
        historicalData,
        updatedWatchlist: watchlistTickers
    };
}

export async function getSP500Movers(): Promise<{ gainers: Stock[], losers: Stock[] }> {
    return stockService.fetchSP500Movers();
}
