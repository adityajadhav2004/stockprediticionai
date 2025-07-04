import { type NextRequest, NextResponse } from "next/server"
import allStocksRaw from "@/public/all_stocks.json";

// Define the structure of news API response
interface NewsApiResponse {
  articles: Array<{
    title: string
    description: string
    url: string
    publishedAt: string
    source: {
      name: string
    }
  }>
}

// Define the structure of OpenRouter response
interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Mapping of common stock names to their official ticker symbols
const STOCK_TICKER_MAP: Record<string, string> = {
  "tata motors": "TATAMOTORS.NS",
  "reliance industries": "RELIANCE.NS",
  "infosys": "INFY.NS",
  "hdfc bank": "HDFCBANK.NS",
  // Add more mappings as needed
}

// Patch for all_stocks.json NSE tickers: if symbol is NSE and does not end with .NS, add .NS
const allStocks = (allStocksRaw as any[]).map(stock => {
  if (stock.exchange === "NSE" && stock.symbol && !stock.symbol.endsWith(".NS")) {
    return { ...stock, symbol: stock.symbol + ".NS" };
  }
  return stock;
});

export async function GET(request: NextRequest) {
  try {
    // Get stock name from query parameters
    const searchParams = request.nextUrl.searchParams
    let stockName = searchParams.get("stock")

    if (!stockName) {
      return NextResponse.json({ error: "Stock name is required" }, { status: 400 })
    }

    stockName = stockName.trim().toLowerCase();
    const ticker = STOCK_TICKER_MAP[stockName] || stockName.toUpperCase();

    // Check if we have the required API keys
    const newsApiKey = process.env.NEWS_API_KEY
    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    // If either API key is missing, use the mock API
    if (!newsApiKey || !openRouterApiKey) {
      console.log("Missing API key(s), using mock data instead")
      // Redirect to the mock API
      return getMockStockInsight(ticker)
    }

    // Fetch news about the stock with more specific query
    let newsData = await fetchNewsData(ticker)
    let filteredArticles = filterRelevantNews(newsData.articles, stockName)
    // If no news found, try fetching with company name from allStocks
    if (!filteredArticles.length) {
      const stockEntry = allStocks.find(s => s.symbol.toLowerCase() === ticker.toLowerCase())
      if (stockEntry && stockEntry.name) {
        newsData = await fetchNewsData(stockEntry.name)
        filteredArticles = filterRelevantNews(newsData.articles, stockEntry.name)
      }
    }
    // Prepare news for AI analysis
    const newsArticles = filteredArticles.slice(0, 5) // Limit to 5 articles

    // Format news for the AI prompt
    const formattedNews = newsArticles
      .map((article, index) => {
        return `Article ${index + 1}: ${article.title}
Source: ${article.source.name}
Date: ${new Date(article.publishedAt).toLocaleDateString()}
${article.description || "No description available"}
URL: ${article.url}
---`
      })
      .join("\n\n")

    // Analyze news with OpenRouter
    let analysisResult, parsedResult, responder = "openrouter";
    try {
      analysisResult = await analyzeNewsWithAI(ticker, formattedNews)
      parsedResult = parseAIResponse(analysisResult)
    } catch (e) {
      responder = "openrouter-error"
      parsedResult = { summary: "Unable to generate summary from AI response", signalType: "Unknown", impact: "Neutral" }
    }

    // If summary is missing or generic, try fallbacks
    let summary = parsedResult.summary;
    // Special handling: if the original user input (stockName) contains a space, always use Serper first
    if (stockName.includes(" ")) {
      const serperSummary = await fetchSerperSummary(`${ticker} stock news`);
      summary = serperSummary || "";
      responder = "serper";
      // If Serper fails, try OpenRouter fallback
      if (!summary || summary.trim() === "") {
        try {
          const fallbackPrompt = `Summarize the following news articles about ${ticker} in 2-3 sentences. Only use the information in the articles.\n\n${formattedNews}`;
          const fallbackResult = await analyzeNewsWithAI(ticker, fallbackPrompt, true);
          summary = fallbackResult && fallbackResult.trim() !== "" ? fallbackResult : "";
          responder = "openrouter-fallback";
        } catch (e) {
          // If even fallback fails, leave summary blank
        }
      }
    } else if (!summary || summary.trim() === "" || summary.includes("Unable to generate summary") || summary.includes("No summary")) {
      // Fallback to Serper (Google) for all other cases
      const serperSummary = await fetchSerperSummary(`${ticker} stock news`);
      summary = serperSummary || "";
      responder = "serper";
      // If Serper also fails, try to re-feed the news directly to DeepSeek/OpenRouter with a simplified prompt
      if (!summary || summary.trim() === "") {
        try {
          const fallbackPrompt = `Summarize the following news articles about ${ticker} in 2-3 sentences. Only use the information in the articles.\n\n${formattedNews}`;
          const fallbackResult = await analyzeNewsWithAI(ticker, fallbackPrompt, true);
          summary = fallbackResult && fallbackResult.trim() !== "" ? fallbackResult : "";
          responder = "openrouter-fallback";
        } catch (e) {
          // If even fallback fails, leave summary blank
        }
      }
    }
    if (!summary || summary.trim() === "") {
      // Try AlphaVantage fallback
      let altSummary = await fetchAlphaVantageSummary(ticker);
      if (altSummary && altSummary.trim() !== "") {
        summary = altSummary;
        responder = "alphavantage";
      } else {
        // Try Finnhub fallback
        altSummary = await fetchFinnhubSummary(ticker);
        if (altSummary && altSummary.trim() !== "") {
          summary = altSummary;
          responder = "finnhub";
        } else {
          summary = "No data available for this stock at the moment.";
          responder = "none";
        }
      }
    }
    console.log(`[StockSignalAI] Response provider: ${responder}`);
    console.log(`[StockSignalAI] Response:`, JSON.stringify({
      ...parsedResult,
      summary,
      stockName: ticker,
      news: newsArticles.map((article) => ({
        title: article.title,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
      })),
      responder,
    }, null, 2));
    // Return the final result with news sources
    return NextResponse.json({
      ...parsedResult,
      summary,
      stockName: ticker,
      news: newsArticles.map((article) => ({
        title: article.title,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
      })),
      responder,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

// Function to get mock data when API keys are missing
async function getMockStockInsight(stockName: string) {
  try {
    // Use the mock API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/mock-stock-insight?stock=${encodeURIComponent(stockName)}`,
    )

    if (!response.ok) {
      throw new Error(`Mock API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({
      ...data,
      stockName: stockName,
      // Add a note that this is mock data
      isMockData: true,
    })
  } catch (error) {
    console.error("Error fetching mock data:", error)
    // If even the mock API fails, return a hardcoded response
    return NextResponse.json({
      summary: `Analysis for ${stockName} is currently unavailable. Using demo data.`,
      signalType: "Demo Data",
      impact: "Neutral",
      buyAnalysis:
        "This is demo data. In a real scenario, you would see an actual buy analysis here based on recent news.",
      sellAnalysis:
        "This is demo data. In a real scenario, you would see an actual sell analysis here based on recent news.",
      factCheck: {
        verifiedClaims: ["This is a demo claim", "API keys are required for real data"],
        uncertainClaims: ["This data is not based on real news"],
      },
      relevanceScore: 100,
      stockName: stockName,
      isMockData: true,
      news: [
        {
          title: `Demo News Article about ${stockName}`,
          url: "https://example.com/news/1",
          source: { name: "Demo Source" },
          publishedAt: new Date().toISOString(),
        },
        {
          title: `Another Demo Article about ${stockName}`,
          url: "https://example.com/news/2",
          source: { name: "Demo Source 2" },
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    })
  }
}

// Function to filter news articles for relevance to the stock
function filterRelevantNews(articles: any[], stockName: string) {
  const stockNameLower = stockName.toLowerCase()
  const stockNameWords = stockNameLower.split(/\s+/)

  return articles.filter((article) => {
    const titleLower = article.title.toLowerCase()
    const descLower = (article.description || "").toLowerCase()

    // Check if the stock name appears in the title or description
    const inTitle = stockNameWords.some((word) => titleLower.includes(word))
    const inDesc = stockNameWords.some((word) => descLower.includes(word))

    return inTitle || inDesc
  })
}

async function fetchNewsData(stockName: string): Promise<NewsApiResponse> {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not defined")
  }

  // Create a more specific query to ensure relevance
  const query = `"${stockName}" AND (earnings OR revenue OR stock OR shares OR company OR business OR financial OR quarterly OR annual)`

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }, // Cache for 1 hour
  )

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`)
  }

  return response.json()
}

async function analyzeNewsWithAI(stockName: string, newsContent: string, rawPrompt = false): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not defined")
  }

  const prompt = rawPrompt
    ? newsContent // Use the provided prompt directly
    : `You are a financial analyst specializing in stock market analysis. Analyze the following news articles about ${stockName} and predict if there's any signal of the stock moving up or down.

IMPORTANT: ONLY analyze information directly related to ${stockName}. Do NOT include analysis of other companies or general market trends unless they specifically impact ${stockName}.

Respond with ONLY a JSON object in this exact format:
{
  "summary": "A concise 1-2 sentence summary of the key insights specifically about ${stockName}",
  "signalType": "The type of signal (e.g. merger, earnings, product launch) for ${stockName}",
  "impact": "Up, Down, or Neutral",
  "buyAnalysis": "A brief analysis of whether this is a good time to buy ${stockName} and why",
  "sellAnalysis": "A brief analysis of whether this is a good time to sell ${stockName} and why",
  "factCheck": {
    "verifiedClaims": ["List of 2-3 key claims about ${stockName} that appear factual"],
    "uncertainClaims": ["List of 1-2 claims about ${stockName} that may need verification"]
  },
  "relevanceScore": 95
}

Here are the news articles about ${stockName}:

${newsContent}`

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://stocksignal.ai",
      "X-Title": "StockSignal.ai",
    },
    body: JSON.stringify({
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data = (await response.json()) as OpenRouterResponse
  return data.choices[0].message.content
}

function parseAIResponse(aiResponse: string): {
  summary: string
  signalType: string
  impact: "Up" | "Down" | "Neutral"
  buyAnalysis?: string
  sellAnalysis?: string
  factCheck?: {
    verifiedClaims: string[]
    uncertainClaims: string[]
  }
  relevanceScore?: number
} {
  try {
    // Extract JSON from the response (in case the AI included other text)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse
    const parsed = JSON.parse(jsonStr)
    return {
      summary: parsed.summary || "No summary available",
      signalType: parsed.signalType || "Unknown",
      impact: (parsed.impact as "Up" | "Down" | "Neutral") || "Neutral",
      buyAnalysis: parsed.buyAnalysis || "No buy analysis available",
      sellAnalysis: parsed.sellAnalysis || "No sell analysis available",
      factCheck: parsed.factCheck || {
        verifiedClaims: ["No verified claims available"],
        uncertainClaims: ["No uncertain claims available"],
      },
      relevanceScore: parsed.relevanceScore || 0,
    }
  } catch (error) {
    // If parsing fails, return empty summary so fallback logic triggers
    return {
      summary: "",
      signalType: "Unknown",
      impact: "Neutral",
      buyAnalysis: "No buy analysis available",
      sellAnalysis: "No sell analysis available",
      factCheck: {
        verifiedClaims: ["No verified claims available"],
        uncertainClaims: ["No uncertain claims available"],
      },
      relevanceScore: 0,
    }
  }
}

// Add fallback helpers
async function fetchSerperSummary(stockName: string): Promise<string | null> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return null
  // Use the ticker and a more specific query for better results
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ q: stockName + " stock news" }),
  })
  if (!res.ok) return null
  const data = await res.json()
  if (data && data.organic && data.organic.length > 0) {
    return data.organic[0].snippet || data.organic[0].title || null
  }
  return null
}

async function fetchAlphaVantageSummary(symbol: string): Promise<string | null> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY
  if (!apiKey) return null
  const res = await fetch(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  if (data && data.Description) return data.Description
  return null
}

async function fetchFinnhubSummary(symbol: string): Promise<string | null> {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) return null
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  if (data && data.name && data.finnhubIndustry) {
    return `${data.name} operates in the ${data.finnhubIndustry} sector.`
  }
  return null
}

