import { NextResponse } from "next/server"

export async function GET() {
  const newsApiKey = process.env.NEWS_API_KEY
  const openRouterApiKey = process.env.OPENROUTER_API_KEY

  const apiKeysAvailable = !!newsApiKey && !!openRouterApiKey

  return NextResponse.json({ apiKeysAvailable })
}

