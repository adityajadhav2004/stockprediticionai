"use client"

import { useEffect, useRef } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockInsight } from "@/types/stock"
import { TrendingDown, Clock, DollarSign, ArrowDownRight } from "lucide-react"

interface SellSignalProps {
  insight: StockInsight
}

export function SellSignal({ insight }: SellSignalProps) {
  const { impact, sellAnalysis } = insight
  const progressRef = useRef<HTMLDivElement>(null)

  // Generate sell recommendation based on impact
  const getSellRecommendation = () => {
    if (impact.toLowerCase() === "down") {
      return {
        signal: "Strong Sell",
        timing: "Now",
        reason:
          sellAnalysis || "Negative news momentum and weak market indicators suggest potential downward movement.",
        confidence: 85,
      }
    } else if (impact.toLowerCase() === "neutral") {
      return {
        signal: "Hold",
        timing: "Wait",
        reason: sellAnalysis || "Mixed signals in the market. Consider waiting for clearer indicators before selling.",
        confidence: 60,
      }
    } else {
      return {
        signal: "Keep",
        timing: "Not Recommended",
        reason: sellAnalysis || "Positive news and market sentiment suggest holding this stock for potential gains.",
        confidence: 75,
      }
    }
  }

  const recommendation = getSellRecommendation()

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && progressRef.current) {
      window.gsap.fromTo(
        progressRef.current,
        { width: 0 },
        {
          width: `${recommendation.confidence}%`,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.8,
        },
      )
    }
  }, [recommendation.confidence])

  const getSignalColor = () => {
    switch (recommendation.signal) {
      case "Strong Sell":
        return "text-red-600"
      case "Hold":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  const getProgressColor = () => {
    switch (recommendation.signal) {
      case "Strong Sell":
        return "bg-red-500"
      case "Hold":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1.5">
          <TrendingDown className="h-5 w-5 text-primary" /> Sell Signal
        </CardTitle>
        <CardDescription>When to sell this stock</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Signal</span>
              <span className={`font-bold flex items-center gap-1 ${getSignalColor()}`}>
                {recommendation.signal === "Strong Sell" && <ArrowDownRight className="h-4 w-4" />}
                {recommendation.signal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Timing
              </span>
              <span className="font-medium">{recommendation.timing}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Confidence
                </span>
                <span className="font-medium">{recommendation.confidence}%</span>
              </div>
              <div className="bg-secondary rounded-full h-1.5 overflow-hidden">
                <div ref={progressRef} className={`h-full ${getProgressColor()}`} style={{ width: "0%" }} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Analysis</h4>
            <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">{recommendation.reason}</p>
          </div>
        </div>
      </CardContent>
    </>
  )
}

