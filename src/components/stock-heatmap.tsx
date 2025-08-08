"use client"

import Link from 'next/link';
import { type Stock } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StockHeatmapProps {
    stocks: Stock[];
}

const getBackgroundColor = (changePercent: number) => {
    if (changePercent === 0) return 'bg-gray-500/20 hover:bg-gray-500/30';
    
    const isGain = changePercent > 0;
    const absPercent = Math.abs(changePercent);
    let intensity;

    if (absPercent > 5) intensity = 900;
    else if (absPercent > 3) intensity = 800;
    else if (absPercent > 2) intensity = 700;
    else if (absPercent > 1) intensity = 600;
    else if (absPercent > 0.5) intensity = 500;
    else intensity = 400;

    if(isGain) {
        return `bg-green-${intensity}/20 hover:bg-green-${intensity}/30 border-green-${intensity}/30`;
    } else {
        return `bg-red-${intensity}/20 hover:bg-red-${intensity}/30 border-red-${intensity}/30`;
    }
}

// Add dynamic classes to safelist in tailwind config if they are purged.
// For this use case, we can define them statically.
const COLOR_CLASSES = {
    gain: 'bg-green-400/20 hover:bg-green-400/30 border-green-400/30 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 bg-green-600/20 hover:bg-green-600/30 border-green-600/30 bg-green-700/20 hover:bg-green-700/30 border-green-700/30 bg-green-800/20 hover:bg-green-800/30 border-green-800/30 bg-green-900/20 hover:bg-green-900/30 border-green-900/30',
    loss: 'bg-red-400/20 hover:bg-red-400/30 border-red-400/30 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 bg-red-600/20 hover:bg-red-600/30 border-red-600/30 bg-red-700/20 hover:bg-red-700/30 border-red-700/30 bg-red-800/20 hover:bg-red-800/30 border-red-800/30 bg-red-900/20 hover:bg-red-900/30 border-red-900/30'
}


export function StockHeatmap({ stocks }: StockHeatmapProps) {
    if (!stocks || stocks.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No data available for the heatmap.</div>;
    }
    
    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {stocks.map(stock => {
                const change = stock.changePercent || 0;
                const bgColor = getBackgroundColor(change);
                const isGain = change > 0;
                
                return (
                    <Link key={stock.ticker} href={`/dashboard?ticker=${stock.ticker}`}>
                         <div
                            className={cn(
                                "h-20 flex flex-col justify-center items-center p-2 rounded-md transition-colors duration-200 border",
                                bgColor,
                                isGain ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'
                            )}
                        >
                            <div className="font-bold text-sm truncate">{stock.ticker}</div>
                            <div className="text-xs font-medium">{change.toFixed(2)}%</div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
