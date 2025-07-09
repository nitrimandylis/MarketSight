"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  StockRecommendationInput,
  StockRecommendationOutput,
  recommendStocks,
} from "@/ai/flows/stock-recommendation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, BrainCircuit, TrendingUp, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  marketSentiment: z.enum(["bullish", "bearish", "neutral"]),
  newsSummary: z.string().min(10, "News summary must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

interface AIRecommenderProps {
  userStocks: string[];
}

const MOCK_NEWS = `Tech stocks rally on positive inflation data, with the NASDAQ jumping 2%.
Retail sales unexpectedly decline, raising concerns about consumer spending.
Federal Reserve hints at a slower pace of interest rate hikes.
Crude oil prices surge past $100 a barrel amid geopolitical tensions.
Biotech firm announces breakthrough in cancer treatment, stock soars 30%.`;

export function AIRecommender({ userStocks }: AIRecommenderProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketSentiment: "neutral",
      newsSummary: MOCK_NEWS,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const input: StockRecommendationInput = {
      ...data,
      userStocks,
    };

    try {
      const response = await recommendStocks(input);
      setResult(response);
    } catch (e) {
      setError("An error occurred while fetching recommendations.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-headline">AI-Powered Recommendations</CardTitle>
        </div>
        <CardDescription>
          Let our AI analyze your watchlist against market trends to suggest your next move.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="marketSentiment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Sentiment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market sentiment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bullish">Bullish</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="bearish">Bearish</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="newsSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Market News</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a summary of recent news..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 />
                  Generate Recommendations
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {result && (
              <Card className="w-full bg-background/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-headline text-lg mb-2 flex items-center gap-2">
                      <TrendingUp className="text-primary" /> Recommended Additions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.recommendations.map((stock) => (
                        <Badge key={stock} variant="secondary" className="text-base font-mono bg-primary/20 text-primary-foreground hover:bg-primary/30">
                          {stock}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-headline text-lg mb-2 flex items-center gap-2">
                      <BrainCircuit className="text-primary" /> AI Reasoning
                    </h4>
                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
