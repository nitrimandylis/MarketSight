import { SearchPage } from "@/components/search-page";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarInset,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
  } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DollarSign, LayoutDashboard, Search, Grid } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";


export default function SearchRoutePage() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="bg-primary/10 hover:bg-primary/20">
                            <DollarSign className="w-6 h-6 text-primary" />
                        </Button>
                        <h1 className="text-xl font-headline font-semibold">MarketSight</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <div className="p-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/" className="w-full">
                                    <SidebarMenuButton>
                                        <Grid />
                                        Explore
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/dashboard" className="w-full">
                                    <SidebarMenuButton>
                                        <LayoutDashboard />
                                        Dashboard
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/search" className="w-full">
                                    <SidebarMenuButton isActive={true}>
                                        <Search />
                                        Search
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                    <SidebarSeparator />
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="md:hidden"/>
                            <h2 className="text-2xl font-headline font-bold">
                                Search Stocks
                            </h2>
                        </div>
                        <ThemeToggle />
                    </header>
                    <main className="flex-1 p-4 md:p-6">
                        <SearchPage />
                    </main>
                </div>
            </SidebarInset>
      </SidebarProvider>
    );
}
