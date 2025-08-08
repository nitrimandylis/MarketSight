"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { searchStocks } from "@/app/actions";
import { type SearchResult } from "@/lib/types";
import { useWatchlist } from "@/hooks/use-watchlist";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  query: z.string().min(1, "Please enter a search term."),
});

type FormValues = z.infer<typeof formSchema>;

export function SearchPage() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { watchlist, addStock, removeStock, isLoaded } = useWatchlist();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      setError(null);
      try {
        const searchResults = await searchStocks(data.query);
        setResults(searchResults);
        if (searchResults.length === 0) {
            setError("No results found for your query.");
        }
      } catch (e) {
        setError("An error occurred while searching.");
        console.error(e);
      }
    });
  };

  const handleToggleWatchlist = (ticker: string) => {
    if (watchlist.includes(ticker)) {
      removeStock(ticker);
      toast({
        description: `${ticker} removed from your watchlist.`,
      });
    } else {
      addStock(ticker);
      toast({
        description: `${ticker} added to your watchlist.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search for a Stock</CardTitle>
          <CardDescription>
            Find stocks by entering a company name or ticker symbol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Search Query</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AAPL, Apple, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && !isPending && (
         <Card>
            <CardContent className="p-6">
                <p className="text-center text-muted-foreground">{error}</p>
            </CardContent>
         </Card>
      )}

      {results.length > 0 && !isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((stock) => {
                  const isInWatchlist = watchlist.includes(stock.symbol);
                  return (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard?ticker=${stock.symbol}`} className="text-primary hover:underline">
                          {stock.symbol}
                        </Link>
                      </TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>{stock.stockExchange}</TableCell>
                      <TableCell>
                        <Button 
                          variant={isInWatchlist ? "secondary" : "outline"} 
                          size="sm"
                          onClick={() => handleToggleWatchlist(stock.symbol)}
                          disabled={!isLoaded}
                        >
                           {isInWatchlist ? <Check /> : <Plus />}
                          {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
