// Stock Recommendation Flow
'use server';

/**
 * @fileOverview Provides AI-driven stock recommendations based on market sentiments, news, and user's current stock picks.
 *
 * - recommendStocks - A function that generates stock recommendations.
 * - StockRecommendationInput - The input type for the recommendStocks function.
 * - StockRecommendationOutput - The return type for the recommendStocks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getStockDetails } from '@/ai/tools/stock-api';

const StockRecommendationInputSchema = z.object({
  userStocks: z.array(z.string()).describe("A list of stock tickers in the user's portfolio."),
  marketSentiment: z.string().describe('Current market sentiment (bullish, bearish, neutral).'),
  newsSummary: z.string().describe('A summary of recent news headlines relevant to the stock market.'),
});
export type StockRecommendationInput = z.infer<typeof StockRecommendationInputSchema>;

const StockRecommendationOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of stock tickers recommended for the user.'),
  reasoning: z.string().describe('The AI reasoning behind the recommendations.'),
});
export type StockRecommendationOutput = z.infer<typeof StockRecommendationOutputSchema>;

export async function recommendStocks(input: StockRecommendationInput): Promise<StockRecommendationOutput> {
  return recommendStocksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockRecommendationPrompt',
  input: {schema: StockRecommendationInputSchema},
  output: {schema: StockRecommendationOutputSchema},
  tools: [getStockDetails],
  prompt: `You are an AI investment advisor. Your goal is to provide actionable stock recommendations.

Analyze the provided information:
1. The user's current portfolio of stocks: {{userStocks}}.
2. The current market sentiment: {{marketSentiment}}.
3. A summary of recent financial news: {{newsSummary}}.

Your task:
- Use the 'getStockDetails' tool to fetch real-time financial data (like P/E ratio, dividend yield, market cap) for the user's stocks and any other stocks you are considering. This is crucial for your analysis.
- Based on a comprehensive analysis of all data points, provide a list of 2-3 stock tickers you recommend adding to the portfolio.
- Provide a clear, concise reasoning for your recommendations, referencing the data you've analyzed.

Format your response as a JSON object with "recommendations" (an array of stock tickers) and "reasoning" (a string explanation).
`,
});

const recommendStocksFlow = ai.defineFlow(
  {
    name: 'recommendStocksFlow',
    inputSchema: StockRecommendationInputSchema,
    outputSchema: StockRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
