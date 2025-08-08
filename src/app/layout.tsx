import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/providers/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { WatchlistProvider } from '@/hooks/use-watchlist.tsx';

export const metadata: Metadata = {
  title: 'MarketSight',
  description: 'AI-powered stock analysis and recommendations.',
};

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontHeading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontHeading.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WatchlistProvider>
            {children}
            <Toaster />
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
