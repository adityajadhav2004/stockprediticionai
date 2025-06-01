"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StockInsight, NewsItem } from "@/types/stock"
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart4,
  Newspaper,
  AlertCircle,
} from "lucide-react"
import { FactChecker } from "@/components/fact-checker"
import { BuySignal } from "@/components/buy-signal"
import { SellSignal } from "@/components/sell-signal"
import { RelevanceIndicator } from "@/components/relevance-indicator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StockResultsProps {
  insight: StockInsight
}

export function StockResults({ insight }: StockResultsProps) {
  const { summary, signalType, impact, news, stockName, relevanceScore, isMockData } = insight
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP animation on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && containerRef.current) {
      // Animate the container
      window.gsap.fromTo(
        containerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      )

      // Animate each card with stagger
      const cards = containerRef.current.querySelectorAll(".result-card")
      window.gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        },
      )
    }
  }, [])

  const getImpactEmoji = () => {
    switch (impact.toLowerCase()) {
      case "up":
        return "🚀"
      case "down":
        return "📉"
      default:
        return "🤷"
    }
  }

  const getImpactColor = () => {
    switch (impact.toLowerCase()) {
      case "up":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "down":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    }
  }

  const getImpactIcon = () => {
    switch (impact.toLowerCase()) {
      case "up":
        return <TrendingUp className="h-5 w-5" />
      case "down":
        return <TrendingDown className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  return (
    <div ref={containerRef} className="py-4">
      {isMockData && (
        <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300">
            Using demo data. Add NEWS_API_KEY and OPENROUTER_API_KEY environment variables for real analysis.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart4 className="h-6 w-6 text-primary" />
          Analysis for {stockName || "Stock"}
        </h2>
        <p className="text-muted-foreground">Based on recent news and AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Main Prediction Card */}
        <Card className="md:col-span-8 result-card premium-shadow premium-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">AI Prediction</CardTitle>
                <CardDescription>Based on recent news analysis</CardDescription>
              </div>
              <Badge className={`text-lg px-4 py-1.5 flex items-center gap-1.5 ${getImpactColor()}`}>
                {getImpactIcon()} {getImpactEmoji()} {impact}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Signal Type
              </h3>
              <p className="text-sm bg-secondary/50 p-3 rounded-lg">{signalType}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Summary
              </h3>
              <p className="text-sm bg-secondary/50 p-4 rounded-lg leading-relaxed">{summary}</p>
            </div>

            {relevanceScore !== undefined && <RelevanceIndicator score={relevanceScore} />}
          </CardContent>
        </Card>

        {/* Fact Checker Card */}
        <Card className="md:col-span-4 result-card premium-shadow premium-border">
          <FactChecker insight={insight} />
        </Card>

        {/* Buy Signal Card */}
        <Card className="md:col-span-6 result-card premium-shadow premium-border">
          <BuySignal insight={insight} />
        </Card>

        {/* Sell Signal Card */}
        <Card className="md:col-span-6 result-card premium-shadow premium-border">
          <SellSignal insight={insight} />
        </Card>
      </div>

      {/* News Sources Card */}
      <Card className="result-card premium-shadow premium-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            News Sources
          </CardTitle>
          <CardDescription>Articles used for this analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {news.map((item: NewsItem, index: number) => (
              <li
                key={index}
                className="text-sm p-3 hover:bg-secondary/50 rounded-lg transition-colors border border-border/30"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start hover:underline group"
                >
                  <ExternalLink className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                  <div>
                    <span className="font-medium">{item.title}</span>
                    {item.source && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Source: {item.source.name} • {new Date(item.publishedAt || "").toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

