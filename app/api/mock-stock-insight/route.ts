import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get stock name from query parameters
  const searchParams = request.nextUrl.searchParams
  const stockName = searchParams.get("stock") || "Unknown Stock"

  // Create a mock response for testing
  const mockResponse = {
    summary: `${stockName} shows positive momentum due to strong quarterly earnings and new product announcements. Analysts have upgraded their price targets.`,
    signalType: "Earnings Beat & Product Launch",
    impact: "Up",
    buyAnalysis:
      "This appears to be a good time to buy as the company has shown strong financial performance and positive market sentiment. The recent product announcements could drive further growth.",
    sellAnalysis:
      "Selling is not recommended at this time as the stock shows strong upward momentum and positive catalysts that could drive further price appreciation.",
    factCheck: {
      verifiedClaims: [
        "The company reported earnings above analyst expectations",
        "New product line was announced on the specified date",
        "Multiple analysts have upgraded their price targets",
      ],
      uncertainClaims: [
        "Long-term impact of new products on revenue",
        "Competitive response to the new product announcements",
      ],
    },
    news: [
      {
        title: `${stockName} Reports Record Q3 Earnings, Beats Analyst Expectations`,
        url: "https://example.com/news/1",
        source: { name: "Financial Times" },
        publishedAt: new Date().toISOString(),
      },
      {
        title: `${stockName} Announces New Product Line, Shares Jump 5%`,
        url: "https://example.com/news/2",
        source: { name: "Bloomberg" },
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: `Analysts Upgrade ${stockName} Following Strong Performance`,
        url: "https://example.com/news/3",
        source: { name: "CNBC" },
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return NextResponse.json(mockResponse)
}

