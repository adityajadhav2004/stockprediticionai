"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StockResults } from "@/components/stock-results"
import { AnalysisProgress } from "@/components/analysis-progress"
import { useToast } from "@/hooks/use-toast"
import type { StockInsight } from "@/types/stock"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function StockSearch() {
  const [stockName, setStockName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<StockInsight | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [apiKeysAvailable, setApiKeysAvailable] = useState(true)
  const { toast } = useToast()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stockName.trim()) {
      toast({
        title: "Please enter a stock name",
        description: "Enter a company name or stock ticker to get insights",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResults(null)
    setCurrentStep(1) // Start progress

    try {
      // Step 1: Fetching news
      setCurrentStep(1)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

      // Step 2: Analyzing with AI
      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

      // Step 3: Fact checking
      setCurrentStep(3)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

      // Step 4: Generating recommendations
      setCurrentStep(4)

      // Always send stockName in lowercase to the API for case-insensitive search
      const normalizedStockName = stockName.trim().toLowerCase()
      const response = await fetch(`/api/stock-insight?stock=${encodeURIComponent(normalizedStockName)}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)

      // Step 5: Complete
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
      setCurrentStep(0) // Reset progress
    }
  }

  return (
    <div className="space-y-6">
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

