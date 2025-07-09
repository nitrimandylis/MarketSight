export interface Stock {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    peRatio: number | null;
    dividendYield: number | null;
    high52W: number;
    low52W: number;
  }
  
  export interface HistoricalData {
    date: string;
    price: number;
  }
  