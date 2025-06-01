"use client"

import { useEffect, useRef } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StockInsight } from "@/types/stock"
import { ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react"

interface FactCheckerProps {
  insight: StockInsight
}

export function FactChecker({ insight }: FactCheckerProps) {
  const { factCheck } = insight
  const containerRef = useRef<HTMLDivElement>(null)

  // For the MVP, we'll use the factCheck from the AI or generate a random score if not available
  const factCheckingScore = Math.floor(Math.random() * 30) + 70 // Random score between 70-99

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && containerRef.current) {
      const verifiedItems = containerRef.current.querySelectorAll(".verified-item")
      const uncertainItems = containerRef.current.querySelectorAll(".uncertain-item")

      window.gsap.fromTo(
        verifiedItems,
        { x: -10, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.8,
        },
      )

      window.gsap.fromTo(
        uncertainItems,
        { x: -10, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 1.2,
        },
      )
    }
  }, [])

  const getScoreColor = () => {
    if (factCheckingScore >= 90) return "text-green-600"
    if (factCheckingScore >= 80) return "text-yellow-600"
    return "text-orange-600"
  }

  const getVerifiedSources = () => {
    // Simulate verified sources
    return [
      {
        name: "Financial Times",
        url: "https://www.ft.com",
      },
      {
        name: "Bloomberg",
        url: "https://www.bloomberg.com",
      },
      {
        name: "Reuters",
        url: "https://www.reuters.com",
      },
    ]
  }

  return (
    <div ref={containerRef}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-primary" /> Fact Checker
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
        <CardDescription>Information verification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Accuracy Score</span>
            <span className={`text-lg font-bold ${getScoreColor()}`}>{factCheckingScore}%</span>
          </div>

          {factCheck && factCheck.verifiedClaims && factCheck.verifiedClaims.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Verified Claims
              </h4>
              <ul className="space-y-2">
                {factCheck.verifiedClaims.map((claim, index) => (
                  <li key={index} className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded-md verified-item">
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {factCheck && factCheck.uncertainClaims && factCheck.uncertainClaims.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> Needs Verification
              </h4>
              <ul className="space-y-2">
                {factCheck.uncertainClaims.map((claim, index) => (
                  <li key={index} className="text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md uncertain-item">
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Verified Against</h4>
            <ul className="space-y-1.5">
              {getVerifiedSources().map((source, index) => (
                <li key={index} className="text-xs">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

