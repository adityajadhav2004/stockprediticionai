"use client"

import type React from "react"

import { useEffect } from "react"
import { initGSAP } from "@/lib/gsap"

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGSAP()
  }, [])

  return <>{children}</>
}

