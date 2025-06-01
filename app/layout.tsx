import type React from "react"
import type { Metadata } from "next"
import { Outfit, Manrope } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GSAPProvider } from "@/components/gsap-provider"

// Premium font setup
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Stock Signal AI by Aditya Jadhav - AI-Powered Stock Insights",
  description: "Get AI-generated insights from live news to predict potential stock movement. Created by Aditya Jadhav, Stock Signal AI leverages advanced algorithms for smarter investing.",
  generator: 'Stock Signal AI by Aditya Jadhav',
  keywords: [
    "Stock Signal AI",
    "Aditya Jadhav",
    "AI stock prediction",
    "AI investing",
    "stock insights",
    "AI news analysis",
    "stock market AI",
    "Aditya Jadhav AI"
  ],
  authors: [{ name: "Aditya Jadhav", url: "https://www.linkedin.com/in/adityajadhav-ai/" }],
  creator: "Aditya Jadhav",
  openGraph: {
    title: "Stock Signal AI by Aditya Jadhav",
    description: "AI-powered stock insights and predictions by Aditya Jadhav.",
    url: "https://stocksignal.ai/",
    siteName: "Stock Signal AI by Aditya Jadhav",
    type: "website",
    locale: "en_US"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GSAPProvider>{children}</GSAPProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'