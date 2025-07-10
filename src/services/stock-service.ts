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
            // Handle cases where the API returns an empty object for a valid ticker but no data
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
