# MarketSight 📈

Welcome to MarketSight, an AI-powered stock analysis and recommendation platform designed to provide you with the tools and insights needed to make informed investment decisions. Built with a modern tech stack, MarketSight offers a seamless and intuitive user experience for tracking your favorite stocks.

![MarketSight Dashboard](https://placehold.co/1200x600.png?text=MarketSight+App+Screenshot)

## ✨ Core Features

-   **Live Data Display**: Get real-time and historical stock data powered by the [Financial Modeling Prep API](https://site.financialmodelingprep.com/developer/docs).
-   **Interactive Watchlist**: Create and manage a personalized stock watchlist. Click on any stock to see its detailed performance.
-   **Advanced Charting Tools**: Visualize stock price history with interactive charts. Switch between different time spans (1D, 5D, 1M, 6M, YTD, 1Y, ALL) to analyze trends.
-   **Stock Search**: Easily search for stocks by ticker symbol or company name to get the latest data or add them to your dashboard.
-   **AI-Powered Recommendations**: Leverage the power of Google's Gemini model through Genkit. The AI agent analyzes your current portfolio against market sentiment and news to provide intelligent stock recommendations.

## 🚀 Tech Stack

MarketSight is built with a modern, robust, and scalable technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit (by Google)](https://firebase.google.com/docs/genkit)
-   **Data Source**: [Financial Modeling Prep API](https://site.financialmodelingprep.com/developer/docs)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🛠️ Getting Started

Follow these steps to get a local copy of MarketSight up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v20 or later recommended)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A free API key from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new file named `.env` in the root of your project.
    -   Add your Financial Modeling Prep API key to this file:
        ```env
        FMP_API_KEY="YOUR_FINANCIAL_MODELING_PREP_API_KEY"
        ```
    -   You may also need to set up your Google AI credentials for Genkit if they are not already configured in your environment.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## 📂 Project Structure

Here is a brief overview of the key directories in the project:

```
/
├── src/
│   ├── app/                # Next.js App Router: pages and routes
│   │   ├── dashboard/      # Main dashboard page
│   │   ├── search/         # Stock search page
│   │   ├── actions.ts      # Server Actions for data fetching
│   │   └── layout.tsx      # Root layout
│   ├── ai/                 # Genkit AI configuration
│   │   ├── flows/          # AI-driven workflows (e.g., stock recommendations)
│   │   └── tools/          # Genkit tools (e.g., stock API wrapper)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # ShadCN UI components
│   │   └── *.tsx           # App-specific components (Chart, Watchlist, etc.)
│   ├── lib/                # Utility functions and type definitions
│   └── services/           # Services for interacting with external APIs
├── .env                    # Environment variables (API keys)
└── next.config.ts          # Next.js configuration
```

## Deploying to GitHub Pages

This project includes a landing page and can be configured for static export, making it suitable for deployment on services like GitHub Pages or Vercel.

To generate a static build, you can modify your `next.config.ts` to include `output: 'export'` and then run `npm run build`. This will create an `out` folder that you can deploy as a static site.
