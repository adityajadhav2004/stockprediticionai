"use client"

import { useEffect, useRef } from "react"

export function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create gradient points
    const points = [
      { x: width * 0.1, y: height * 0.2, radius: width * 0.15, color: "rgba(59, 130, 246, 0.15)" },
      { x: width * 0.8, y: height * 0.3, radius: width * 0.2, color: "rgba(139, 92, 246, 0.1)" },
      { x: width * 0.3, y: height * 0.7, radius: width * 0.25, color: "rgba(59, 130, 246, 0.08)" },
      { x: width * 0.9, y: height * 0.8, radius: width * 0.15, color: "rgba(139, 92, 246, 0.05)" },
    ]

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      time += 0.001

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update points position with subtle movement
      points.forEach((point, i) => {
        point.x += Math.sin(time + i) * 0.5
        point.y += Math.cos(time + i) * 0.5

        // Draw gradient
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)

        gradient.addColorStop(0, point.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.03), rgba(30, 41, 59, 0.1))",
      }}
    />
  )
}

