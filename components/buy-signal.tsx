"use client"

import { useEffect, useRef } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockInsight } from "@/types/stock"
import { TrendingUp, Clock, DollarSign, ArrowUpRight } from "lucide-react"

interface BuySignalProps {
  insight: StockInsight
}

export function BuySignal({ insight }: BuySignalProps) {
  const { impact, buyAnalysis } = insight
  const progressRef = useRef<HTMLDivElement>(null)

  // Generate buy recommendation based on impact
  const getBuyRecommendation = () => {
    if (impact.toLowerCase() === "up") {
      return {
        signal: "Strong Buy",
        timing: "Now",
        reason: buyAnalysis || "Positive news momentum and strong market indicators suggest potential upward movement.",
        confidence: 85,
      }
    } else if (impact.toLowerCase() === "neutral") {
      return {
        signal: "Hold",
        timing: "Wait",
        reason: buyAnalysis || "Mixed signals in the market. Consider waiting for clearer indicators before buying.",
        confidence: 60,
      }
    } else {
      return {
        signal: "Avoid",
        timing: "Not Recommended",
        reason: buyAnalysis || "Negative news and market sentiment suggest avoiding this stock for now.",
        confidence: 75,
      }
    }
  }

  const recommendation = getBuyRecommendation()

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
      case "Strong Buy":
        return "text-green-600"
      case "Hold":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const getProgressColor = () => {
    switch (recommendation.signal) {
      case "Strong Buy":
        return "bg-green-500"
      case "Hold":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1.5">
          <TrendingUp className="h-5 w-5 text-primary" /> Buy Signal
        </CardTitle>
        <CardDescription>When to buy this stock</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Signal</span>
              <span className={`font-bold flex items-center gap-1 ${getSignalColor()}`}>
                {recommendation.signal === "Strong Buy" && <ArrowUpRight className="h-4 w-4" />}
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

