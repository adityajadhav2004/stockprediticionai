"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface RelevanceIndicatorProps {
  score: number
}

export function RelevanceIndicator({ score }: RelevanceIndicatorProps) {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && progressRef.current) {
      window.gsap.fromTo(
        progressRef.current,
        { width: 0 },
        {
          width: `${score}%`,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5,
        },
      )
    }
  }, [score])

  const getScoreColor = () => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const getScoreText = () => {
    if (score >= 90) return "High Relevance"
    if (score >= 70) return "Moderate Relevance"
    return "Low Relevance"
  }

  const getScoreIcon = () => {
    if (score >= 70) return <CheckCircle className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Relevance Score</h3>
      <div className="bg-secondary/50 rounded-full h-2 mb-2 overflow-hidden">
        <div ref={progressRef} className={`h-full ${getScoreColor()}`} style={{ width: "0%" }} />
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          {getScoreIcon()}
          <span>{getScoreText()}</span>
        </div>
        <span className="font-mono font-medium">{score}%</span>
      </div>
    </div>
  )
}

