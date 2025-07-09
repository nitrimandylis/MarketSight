'use server';

/**
 * @fileOverview Genkit tools for fetching stock market data.
 */

import { ai } from '@/ai/genkit';
import * as stockService from '@/services/stock-service';
import { z } from 'zod';

const StockSchema = z.object({
    ticker: z.string(),
    name: z.string(),
    price: z.number(),
    change: z.number(),
    changePercent: z.number(),
    marketCap: z.number(),
    volume: z.number(),
    peRatio: z.number().nullable(),
    dividendYield: z.number().nullable(),
    high52W: z.number(),
    low52W: z.number(),
});

export const getStockDetails = ai.defineTool(
    {
        name: 'getStockDetails',
        description: 'Gets current price and key financial metrics for a stock ticker.',
        inputSchema: z.object({ ticker: z.string().describe('The stock ticker symbol, e.g., AAPL.') }),
        outputSchema: StockSchema.nullable(),
    },
    async ({ ticker }) => {
        const stockDetails = await stockService.fetchStockDetails(ticker);
        return stockDetails;
    }
);
