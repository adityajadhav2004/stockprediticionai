"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { Search, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StockResults } from "@/components/stock-results"
import { AnalysisProgress } from "@/components/analysis-progress"
import { useToast } from "@/hooks/use-toast"
import type { StockInsight } from "@/types/stock"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Remove hardcoded STOCK_LIST and add type for stock
interface StockEntry {
  name: string;
  symbol: string;
  exchange: string;
}

export function StockSearch() {
  const [stockName, setStockName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StockInsight | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKeysAvailable, setApiKeysAvailable] = useState(true);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [allStocks, setAllStocks] = useState<StockEntry[]>([]);
  const [exchange, setExchange] = useState<'NASDAQ' | 'NSE'>('NSE');
  const { toast } = useToast()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all_stocks.json on mount
  useEffect(() => {
    fetch("/all_stocks.json")
      .then((res) => res.json())
      .then((data) => setAllStocks(data))
      .catch((err) => {
        console.error("Failed to load stock list", err)
        setAllStocks([])
      })
  }, [])

  // GSAP animation on mount
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).gsap &&
      formRef.current
    ) {
      (window as any).gsap.from(formRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      })
    }

    // Check if we're in demo mode (no API keys)
    const checkApiKeys = async () => {
      try {
        const response = await fetch("/api/check-api-keys")
        const data = await response.json()
        setApiKeysAvailable(data.apiKeysAvailable)
      } catch (error) {
        console.error("Failed to check API keys:", error)
        // Assume we're in demo mode if we can't check
        setApiKeysAvailable(false)
      }
    }

    checkApiKeys()
  }, [])

  // Memoized list of all names and tickers (lowercase for matching), filtered by exchange
  const stockNamesAndSymbols = useMemo(() => {
    return allStocks
      .filter((s) => s.exchange === exchange)
      .flatMap((s) => [s.name, s.symbol])
      .filter(Boolean);
  }, [allStocks, exchange]);

  // Levenshtein distance for fuzzy matching
  function levenshtein(a: string, b: string) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          )
        }
      }
    }
    return matrix[a.length][b.length]
  }

  function getClosestStockName(input: string) {
    let minDist = Infinity
    let bestMatch = ""
    for (const stock of stockNamesAndSymbols) {
      const dist = levenshtein(input, stock)
      if (dist < minDist) {
        minDist = dist
        bestMatch = stock
      }
    }
    return minDist <= 2 ? bestMatch : null // Only suggest if close enough
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuggestion(null)
    const trimmed = stockName.trim()
    if (!trimmed) {
      toast({
        title: "Please enter a stock name",
        description: "Enter a company name or stock ticker to get insights",
        variant: "destructive",
      })
      return
    }
    // Only allow if input matches a known stock or is a close typo
    const isValidStock = stockNamesAndSymbols.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    )
    const closeMatch = getClosestStockName(trimmed)
    if (!isValidStock && !closeMatch) {
      toast({
        title: "Not a valid stock",
        description: "Please enter a valid stock market company name or ticker.",
        variant: "destructive",
      })
      return
    }
    // If typo, auto-correct to the closest match
    const searchName = isValidStock ? trimmed : closeMatch!
    if (!isValidStock && closeMatch) {
      setSuggestion(closeMatch)
      toast({
        title: "Did you mean?",
        description: `Did you mean '${closeMatch}'? Searching for it...`,
        variant: "default",
      })
    }
    setIsLoading(true)
    setResults(null)
    setCurrentStep(1)
    try {
      setCurrentStep(1)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(3)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(4)
      const normalizedStockName = searchName.toLowerCase()
      const response = await fetch(`/api/stock-insight?stock=${encodeURIComponent(normalizedStockName)}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "No news found",
            description: "No current news found for this stock. Try another company or check back later.",
            variant: "destructive",
          })
          setResults({
            symbol: searchName,
            news: [],
            message: "No current news found for this stock.",
            summary: "No news or analysis available for this stock at the moment.",
            signalType: "Neutral",
            impact: "Neutral",
            buyAnalysis: "Not enough data to provide a buy signal.",
            sellAnalysis: "Not enough data to provide a sell signal.",
            relevanceScore: 0,
            stockName: searchName,
          } as any)
          setCurrentStep(5)
          return
        } else {
          toast({
            title: "No results found",
            description: "No matching stock found. Please check your input.",
            variant: "destructive",
          })
          throw new Error(`Error: ${response.status}`)
        }
      }
      const data = await response.json()
      setResults(data)
      setCurrentStep(5)
    } catch (error) {
      console.error("Failed to fetch stock insights:", error)
      toast({
        title: "Failed to get insights",
        description: "There was an error fetching stock insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setCurrentStep(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Exchange Dropdown */}
      <div className="max-w-xl mx-auto mb-2 flex gap-3 items-center">
        <label htmlFor="exchange-select" className="font-medium text-sm">Exchange:</label>
        <select
          id="exchange-select"
          value={exchange}
          onChange={e => setExchange(e.target.value as 'NASDAQ' | 'NSE')}
          className="border rounded-lg px-3 py-2 bg-background text-foreground"
        >
          <option value="NSE">NSE</option>
          <option value="NASDAQ">NASDAQ</option>
        </select>
      </div>

      {suggestion && (
        <Alert className="max-w-xl mx-auto mb-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300">
            Did you mean <b>{suggestion}</b>?
          </AlertDescription>
        </Alert>
      )}

      {!apiKeysAvailable && (
        <Alert className="max-w-xl mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            Running in demo mode. Add NEWS_API_KEY and OPENROUTER_API_KEY environment variables for real analysis.
          </AlertDescription>
        </Alert>
      )}

      <form
        ref={formRef}
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row w-full max-w-xl mx-auto gap-3 premium-shadow premium-border p-1 rounded-xl bg-card/50 backdrop-blur-sm"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter stock name or ticker (e.g., Apple, AAPL)"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            className="pl-11 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-12 px-6 rounded-lg font-medium">
          {isLoading ? (
            "Analyzing..."
          ) : (
            <span className="flex items-center gap-2">
              Analyze <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {isLoading && <AnalysisProgress currentStep={currentStep} />}

      {results && <StockResults insight={results} />}
    </div>
  )
}

