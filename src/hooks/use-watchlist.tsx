"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

const WATCHLIST_STORAGE_KEY = 'marketsight-watchlist';

interface WatchlistContextType {
    watchlist: string[];
    addStock: (ticker: string) => void;
    removeStock: (ticker: string) => void;
    isLoaded: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedWatchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
            if (storedWatchlist) {
                setWatchlist(JSON.parse(storedWatchlist));
            }
        } catch (error) {
            console.error("Failed to parse watchlist from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
        }
    }, [watchlist, isLoaded]);

    const addStock = useCallback((ticker: string) => {
        setWatchlist(prev => {
            if (prev.includes(ticker)) return prev;
            return [...prev, ticker];
        });
    }, []);

    const removeStock = useCallback((ticker: string) => {
        setWatchlist(prev => prev.filter(t => t !== ticker));
    }, []);

    const value = { watchlist, addStock, removeStock, isLoaded };

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist(): WatchlistContextType {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
}
