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

const StockRecommendationInputSchema = z.object({
  userStocks: z.array(z.string()).describe('A list of stock tickers in the user\'s portfolio.'),
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
  prompt: `You are an AI investment advisor. Analyze the user's current stock picks, current market sentiment, and recent news to provide stock recommendations.

User's current stocks: {{userStocks}}
Market sentiment: {{marketSentiment}}
Recent news: {{newsSummary}}

Based on this information, provide a list of stock recommendations and explain your reasoning.

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
