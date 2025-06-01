import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackgroundGradient } from "@/components/background-gradient"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundGradient />

      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-12 pt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">
              <span>📈 StockSignal</span>.ai
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              AI-Powered <span className="text-gradient">Stock Insights</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enter a stock name or ticker to get AI-generated insights from live news and predict potential movement
              with verified facts.
            </p>
          </div>

          <StockSearch />
        </section>
      </div>
    </main>
  )
}

