"use client"

import Link from "next/link"
import { DollarSign, BarChart, BrainCircuit, Zap, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline">MarketSight</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Navigate the Markets with AI-Powered Clarity
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MarketSight provides real-time stock data, advanced charting, and intelligent recommendations to help you invest smarter.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      <Zap className="mr-2 h-5 w-5" />
                      Launch App
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                data-ai-hint="stock market app"
                alt="MarketSight Dashboard Screenshot"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Everything You Need to Analyze the Market</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From real-time data to AI-driven insights, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-1 text-center">
                <BarChart className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline">Live Stock Data</h3>
                <p className="text-sm text-muted-foreground">
                  Track your favorite stocks with up-to-the-minute price information and key financial metrics.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <BrainCircuit className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent stock suggestions based on your portfolio and current market trends, powered by Genkit.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Zap className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline">Advanced Charting</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize historical performance with interactive charts and multiple time-span options.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                Ready to Dive In?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Launch the MarketSight dashboard and start exploring the market with confidence. No sign-up required.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg">
                    <Link href="/dashboard">
                      Launch App
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MarketSight. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
