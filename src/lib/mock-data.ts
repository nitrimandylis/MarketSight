export interface Stock {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    peRatio: number;
    dividendYield: number;
    high52W: number;
    low52W: number;
  }
  
  export interface HistoricalData {
    date: string;
    price: number;
  }
  
  export const MOCK_STOCKS: Stock[] = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 195.89,
      change: 1.23,
      changePercent: 0.63,
      marketCap: 3000000000000,
      volume: 52000000,
      peRatio: 32.5,
      dividendYield: 0.5,
      high52W: 200.0,
      low52W: 150.0,
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      price: 178.34,
      change: -0.56,
      changePercent: -0.31,
      marketCap: 2200000000000,
      volume: 28000000,
      peRatio: 28.9,
      dividendYield: 0.0,
      high52W: 185.0,
      low52W: 120.0,
    },
    {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      price: 184.88,
      change: 3.45,
      changePercent: 1.9,
      marketCap: 589000000000,
      volume: 95000000,
      peRatio: 45.1,
      dividendYield: 0.0,
      high52W: 300.0,
      low52W: 140.0,
    },
    {
      ticker: "AMZN",
      name: "Amazon.com, Inc.",
      price: 185.57,
      change: -2.1,
      changePercent: -1.12,
      marketCap: 1930000000000,
      volume: 41000000,
      peRatio: 55.2,
      dividendYield: 0.0,
      high52W: 190.0,
      low52W: 115.0,
    },
     {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      price: 447.67,
      change: 1.89,
      changePercent: 0.42,
      marketCap: 3320000000000,
      volume: 18000000,
      peRatio: 38.6,
      dividendYield: 0.66,
      high52W: 450.94,
      low52W: 309.49,
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corp.",
      price: 121.79,
      change: -4.31,
      changePercent: -3.42,
      marketCap: 2990000000000,
      volume: 550000000,
      peRatio: 70.3,
      dividendYield: 0.03,
      high52W: 140.76,
      low52W: 39.23,
    },
  ];
  
  export const MOCK_HISTORICAL_DATA = (
    endDate: Date,
    days: number,
    startPrice: number
  ): HistoricalData[] => {
    const data: HistoricalData[] = [];
    let currentPrice = startPrice;
  
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
  
      // Simulate some price volatility
      const changePercent = (Math.random() - 0.49) * 0.05; // -2.5% to +2.5%
      currentPrice *= 1 + changePercent;
      currentPrice = Math.max(currentPrice, startPrice * 0.5); // Prevent price from dropping too low
  
      data.push({
        date: date.toISOString(),
        price: parseFloat(currentPrice.toFixed(2)),
      });
    }
  
    return data;
  };
  