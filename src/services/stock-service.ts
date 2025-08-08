'use server';

import type { Stock, HistoricalData, TimeSpan, SearchResult } from '@/lib/types';
import { format, subDays, startOfYear } from 'date-fns';

const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") {
  console.warn("FMP_API_KEY is not set. Stock API calls will not work. Get a free key from https://site.financialmodelingprep.com/developer/docs/ and add it to your .env file.");
}

// FMP API types
interface FmpQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  marketCap: number;
  volume: number;
  pe: number;
  yearHigh: number;
  yearLow: number;
}

interface FmpKeyMetrics {
    dividendYieldTTM: number;
}

interface FmpHistorical {
    date: string;
    close: number;
}

interface FmpIntraday {
    date: string;
    close: number;
}

interface FmpMover {
    symbol: string;
    name: string;
    change: number;
    price: number;
    changesPercentage: number;
}

const fmpMoverToStock = (mover: FmpMover): Partial<Stock> => ({
    ticker: mover.symbol,
    name: mover.name,
    price: mover.price,
    change: mover.change,
    changePercent: mover.changesPercentage,
});


export async function fetchStockDetails(ticker: string): Promise<Stock | null> {
  if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") return null;
  try {
    const [quoteRes, metricsRes] = await Promise.all([
      fetch(`${BASE_URL}/quote/${ticker}?apikey=${API_KEY}`),
      fetch(`${BASE_URL}/key-metrics-ttm/${ticker}?apikey=${API_KEY}`),
    ]);

    if (!quoteRes.ok || !metricsRes.ok) {
        console.error(`Failed to fetch data for ${ticker}: Quote=${quoteRes.status}, Metrics=${metricsRes.status}`);
        return null;
    }

    const quoteData: FmpQuote[] = await quoteRes.json();
    const metricsData: FmpKeyMetrics[] = await metricsRes.json();

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
      low52W: quote.low52W,
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${ticker}:`, error);
    return null;
  }
}

export async function fetchHistoricalData(ticker: string, timeSpan: TimeSpan = '1Y'): Promise<HistoricalData[]> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY") return [];
    try {
        if (timeSpan === '1D') {
            const res = await fetch(`${BASE_URL}/historical-chart/15min/${ticker}?apikey=${API_KEY}`);
            if (!res.ok) {
                console.error(`Failed to fetch 1D historical data for ${ticker}: ${res.status}`);
                return [];
            }
            const data: FmpIntraday[] = await res.json();
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

        return data.historical.map((item: FmpHistorical) => ({
            date: item.date,
            price: item.close,
        })).reverse();
    } catch(error) {
        console.error(`Error fetching historical data for ${ticker} with timespan ${timeSpan}:`, error);
        return [];
    }
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY" || !query) {
        return [];
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
    if (!API_KEY || API_KEY === "YOUR_FINANCIAL_MODELING_PREP_API_KEY" || tickers.length === 0) {
        return [];
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
      return { gainers: [], losers: [] };
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
  
      const gainersData: FmpMover[] = await gainersRes.json();
      const losersData: FmpMover[] = await losersRes.json();
      
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