export interface NewsItem {
  title: string
  url: string
  description?: string
  publishedAt?: string
  source?: {
    name: string
  }
}

export interface FactCheck {
  verifiedClaims: string[]
  uncertainClaims: string[]
}

export interface StockInsight {
  summary: string
  signalType: string
  impact: "Up" | "Down" | "Neutral"
  buyAnalysis?: string
  sellAnalysis?: string
  factCheck?: FactCheck
  relevanceScore?: number
  stockName?: string
  isMockData?: boolean
  news: NewsItem[]
}

