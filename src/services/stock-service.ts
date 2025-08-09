'use server';

import type { Stock, HistoricalData, TimeSpan, SearchResult } from '@/lib/types';
import { format, subDays, startOfYear, parseISO } from 'date-fns';

const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
  console.warn("FMP_API_KEY is not set. Using placeholder data. Get a free key from https://site.financialmodelingprep.com/developer/docs/ and add it to your .env file to use live data.");
}

// --- Placeholder Data Generation ---

const generateRandomNumber = (min: number, max: number) => Math.random() * (max - min) + min;
const generateRandomInt = (min: number, max: number) => Math.floor(generateRandomNumber(min, max));

const createPlaceholderStock = (ticker: string): Stock => {
    const price = generateRandomNumber(50, 500);
    const changePercent = generateRandomNumber(-5, 5);
    const change = price * (changePercent / 100);

    return {
        ticker: ticker.toUpperCase(),
        name: `${ticker.toUpperCase()} Company Inc.`,
        price,
        change,
        changePercent,
        marketCap: generateRandomNumber(1e11, 2e12),
        volume: generateRandomNumber(1e6, 20e6),
        peRatio: generateRandomNumber(15, 40),
        dividendYield: generateRandomNumber(0.005, 0.04),
        high52W: price * generateRandomNumber(1.1, 1.5),
        low52W: price * generateRandomNumber(0.7, 0.9),
    };
};

const createPlaceholderHistoricalData = (timeSpan: TimeSpan): HistoricalData[] => {
    const data: HistoricalData[] = [];
    let days: number;
    let interval: 'day' | 'minute' = 'day';

    switch (timeSpan) {
        case '1D': days = 1; interval = 'minute'; break;
        case '5D': days = 5; break;
        case '1M': days = 30; break;
        case '6M': days = 180; break;
        case '1Y': days = 365; break;
        case 'YTD': 
            days = (new Date().getTime() - startOfYear(new Date()).getTime()) / (1000 * 60 * 60 * 24);
            break;
        case 'ALL': days = 365 * 5; break;
        default: days = 365;
    }

    let lastPrice = generateRandomNumber(100, 400);
    const now = new Date();

    for (let i = 0; i < (interval === 'minute' ? 8 * 60 : days); i++) { // 8 hours of 1min data for 1D
        const date = new Date(now);
        if (interval === 'minute') {
            date.setMinutes(now.getMinutes() - i);
        } else {
            date.setDate(now.getDate() - i);
        }

        const change = lastPrice * generateRandomNumber(-0.02, 0.02);
        lastPrice += change;
        if(lastPrice < 0) lastPrice = 0;

        data.push({
            date: date.toISOString(),
            price: lastPrice,
        });
    }

    return data.reverse();
};

// --- Service Functions ---

export async function fetchStockDetails(ticker: string): Promise<Stock | null> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
      return createPlaceholderStock(ticker);
    }
    try {
      const [quoteRes, metricsRes] = await Promise.all([
        fetch(`${BASE_URL}/quote/${ticker}?apikey=${API_KEY}`),
        fetch(`${BASE_URL}/key-metrics-ttm/${ticker}?apikey=${API_KEY}`),
      ]);
  
      if (!quoteRes.ok || !metricsRes.ok) {
          console.error(`Failed to fetch data for ${ticker}: Quote=${quoteRes.status}, Metrics=${metricsRes.status}`);
          return null;
      }
  
      const quoteData: any[] = await quoteRes.json();
      const metricsData: any[] = await metricsRes.json();
  
      if (!quoteData || quoteData.length === 0) {
        return null;
      }
      const quote = quoteData[0];
      const metrics = metricsData && metricsData.length > 0 ? metricsData[0] : { dividendYieldTTM: 0 };
      
      return {
        ticker: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changesPercentage,
        marketCap: quote.marketCap,
        volume: quote.volume,
        peRatio: quote.pe,
        dividendYield: metrics?.dividendYieldTTM || null,
        high52W: quote.yearHigh,
        low52W: quote.yearLow,
      };
    } catch (error) {
      console.error(`Error fetching stock details for ${ticker}:`, error);
      return null;
    }
}

export async function fetchHistoricalData(ticker: string, timeSpan: TimeSpan = '1Y'): Promise<HistoricalData[]> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
      return createPlaceholderHistoricalData(timeSpan);
    }
    try {
        if (timeSpan === '1D') {
            const res = await fetch(`${BASE_URL}/historical-chart/15min/${ticker}?apikey=${API_KEY}`);
            if (!res.ok) {
                console.error(`Failed to fetch 1D historical data for ${ticker}: ${res.status}`);
                return [];
            }
            const data: any[] = await res.json();
            if (!data) return [];
            return data.map(item => ({
                date: item.date,
                price: item.close,
            })).reverse();
        }
        
        let url: string;
        const today = new Date();
        
        const getUrlForTimespan = (from: Date, to: Date) => `${BASE_URL}/historical-price-full/${ticker}?from=${format(from, 'yyyy-MM-dd')}&to=${format(to, 'yyyy-MM-dd')}&apikey=${API_KEY}`;

        switch (timeSpan) {
            case '5D':
                url = getUrlForTimespan(subDays(today, 5), today);
                break;
            case '1M':
                url = getUrlForTimespan(subDays(today, 30), today);
                break;
            case '6M':
                 url = getUrlForTimespan(subDays(today, 182), today);
                break;
            case 'YTD':
                url = getUrlForTimespan(startOfYear(today), today);
                break;
            case '1Y':
                 url = getUrlForTimespan(subDays(today, 365), today);
                 break;
            case 'ALL':
                 url = `${BASE_URL}/historical-price-full/${ticker}?apikey=${API_KEY}`;
                 break;
            default:
                 url = getUrlForTimespan(subDays(today, 365), today);
        }

        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Failed to fetch historical data for ${ticker} with timespan ${timeSpan}: ${res.status}`);
            return [];
        }

        const data = await res.json();
        
        if (!data.historical) {
             if (data.symbol) {
                 return [];
             }
            console.error(`Unexpected response format for ${ticker} with timespan ${timeSpan}:`, data);
            return [];
        }

        return data.historical.map((item: any) => ({
            date: item.date,
            price: item.close,
        })).reverse();
    } catch(error) {
        console.error(`Error fetching historical data for ${ticker} with timespan ${timeSpan}:`, error);
        return [];
    }
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
        if (!query) return [];
        const results: SearchResult[] = [];
        const q = query.toLowerCase();

        // Simulate finding by ticker
        if (q.length <= 5) {
            results.push({ symbol: q.toUpperCase(), name: `${q.toUpperCase()} Company`, currency: 'USD', stockExchange: 'NASDAQ', exchangeShortName: 'NASDAQ' });
        }
        
        // Simulate finding by name
        if (q.includes('apple')) results.push({ symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD', stockExchange: 'NASDAQ', exchangeShortName: 'NASDAQ' });
        if (q.includes('google')) results.push({ symbol: 'GOOGL', name: 'Alphabet Inc.', currency: 'USD', stockExchange: 'NASDAQ', exchangeShortName: 'NASDAQ' });
        if (q.includes('microsoft')) results.push({ symbol: 'MSFT', name: 'Microsoft Corporation', currency: 'USD', stockExchange: 'NASDAQ', exchangeShortName: 'NASDAQ' });
        if (q.includes('amazon')) results.push({ symbol: 'AMZN', name: 'Amazon.com, Inc.', currency: 'USD', stockExchange: 'NASDAQ', exchangeShortName: 'NASDAQ' });

        return [...new Map(results.map(item => [item.symbol, item])).values()];
    }
    try {
        const url = `${BASE_URL}/search-ticker?query=${query}&limit=10&apikey=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Failed to search stocks for query "${query}": ${res.status}`);
            return [];
        }
        const data: SearchResult[] = await res.json();
        return data;
    } catch (error) {
        console.error(`Error searching stocks for query "${query}":`, error);
        return [];
    }
}

async function fetchFullStockDetails(tickers: string[]): Promise<Stock[]> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
        return tickers.map(createPlaceholderStock);
    }
    try {
        const results = await Promise.all(tickers.map(ticker => fetchStockDetails(ticker)));
        return results.filter(Boolean) as Stock[];
    } catch (error) {
        console.error('Error fetching full stock details:', error);
        return [];
    }
}


export async function fetchSP500Movers(): Promise<{ gainers: Stock[], losers: Stock[] }> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
      const createMover = (isGainer: boolean): Stock => {
        const ticker = `${String.fromCharCode(65 + generateRandomInt(0, 25))}${String.fromCharCode(65 + generateRandomInt(0, 25))}${String.fromCharCode(65 + generateRandomInt(0, 25))}`;
        const stock = createPlaceholderStock(ticker);
        const changePercent = generateRandomNumber(isGainer ? 1 : -5, isGainer ? 5 : -1);
        stock.changePercent = changePercent;
        stock.change = stock.price * (changePercent / 100);
        return stock;
      };
      const gainers = Array.from({ length: 50 }, () => createMover(true));
      const losers = Array.from({ length: 50 }, () => createMover(false));
      return { gainers, losers };
    }
    try {
      const [gainersRes, losersRes] = await Promise.all([
        fetch(`${BASE_URL}/stock_market/gainers?apikey=${API_KEY}`),
        fetch(`${BASE_URL}/stock_market/losers?apikey=${API_KEY}`),
      ]);
  
      if (!gainersRes.ok || !losersRes.ok) {
        console.error(`Failed to fetch S&P 500 movers: Gainers=${gainersRes.status}, Losers=${losersRes.status}`);
        return { gainers: [], losers: [] };
      }
  
      const gainersData: any[] = await gainersRes.json();
      const losersData: any[] = await losersRes.json();
      
      const gainerTickers = gainersData.slice(0, 50).map(s => s.symbol);
      const loserTickers = losersData.slice(0, 50).map(s => s.symbol);

      const [fullGainers, fullLosers] = await Promise.all([
        fetchFullStockDetails(gainerTickers),
        fetchFullStockDetails(loserTickers),
      ]);
      
      return { gainers: fullGainers, losers: fullLosers };
  
    } catch (error) {
      console.error('Error fetching S&P 500 movers:', error);
      return { gainers: [], losers: [] };
    }
  }