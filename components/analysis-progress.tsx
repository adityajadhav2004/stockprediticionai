"use client"

import { useEffect, useState, useRef } from "react"
import { CheckCircle2, Loader2, Newspaper, Brain, ShieldCheck, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisProgressProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Fetching News", icon: Newspaper, description: "Gathering the latest news articles about this stock" },
  { id: 2, name: "AI Analysis", icon: Brain, description: "Processing news content with advanced AI models" },
  { id: 3, name: "Fact Checking", icon: ShieldCheck, description: "Verifying information against trusted sources" },
  {
    id: 4,
    name: "Generating Recommendations",
    icon: BarChart3,
    description: "Creating buy/sell signals and market insights",
  },
  { id: 5, name: "Complete", icon: CheckCircle2, description: "Analysis complete!" },
]

export function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Calculate progress percentage
    const percentage = currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100

    // Animate progress
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 100)

    // GSAP animation
    if (typeof window !== "undefined" && window.gsap && containerRef.current) {
      window.gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      )
    }

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto my-10 px-6 py-8 rounded-xl glass-card premium-shadow premium-border"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          Analyzing Stock Data
        </h3>
        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {steps.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10",
                isCompleted && "text-muted-foreground",
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isActive && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                {isCompleted && <step.icon className="h-5 w-5 text-primary" />}
                {!isActive && !isCompleted && <step.icon className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div>
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

