# Stock Signal AI by Aditya Jadhav

Stock Signal AI fetches real-time news feeds, analyzes them using advanced AI models (DeepSeek/DeepRouter), and provides you with a buy, sell, or hold signal for any stock depending on the latest news sentiment and facts.

**How it works:**  
Stock Signal AI continuously gathers the latest news articles and financial reports about your chosen stock. It then sends this information to state-of-the-art AI models (DeepSeek/DeepRouter) that are specifically tuned for financial analysis. The AI reviews the news, fact-checks claims, and determines the likely impact on the stock price. Based on this, it gives you a clear, actionable signal: **Buy**, **Sell**, or **Hold**.

**Why is it created?**  
- **AI-Driven, Not Just Data-Driven:**  
  Unlike traditional stock screeners that rely only on historical price data or basic sentiment, Stock Signal AI uses advanced language models to understand the context, tone, and facts in real news articles.

- **Fact-Checking:**  
  The system doesn't just summarize news—it verifies claims and highlights which information is certain and which is speculative, giving you more confidence in the signals.

- **Real-Time, News-Based Signals:**  
  Instead of waiting for end-of-day or delayed data, you get insights as soon as news breaks, helping you act faster than the market.

- **No Hardcoded Rules:**  
  The AI adapts to new events, trends, and language, so it can catch signals that rule-based systems miss.

- **Purely Based on News:**  
  Stock Signal AI is purely driven by real-time financial news. It uses the News API and DeepRouter/DeepSeek to generate intelligent news-based stock predictions. No technical indicators or historical price data are used.

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/adityajadhav2004/stockprediticionai.git
cd stockprediticionai
```

### 2. Install Dependencies
```sh
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
OPENROUTER_API_KEY=your_real_openrouter_api_key
NEWS_API_KEY=your_real_news_api_key
API_SECRET_KEY=your_real_secret_key
```


### 4. Run the Development Server
```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
Deploy to Vercel, Netlify, or your own server. Set the same environment variables in your deployment dashboard.

## Security
- All API keys are loaded from `.env.local` and never exposed to the frontend.
- Only variables prefixed with `NEXT_PUBLIC_` are available to the browser.


## Contributing
Pull requests are welcome! For major changes, open an issue first.

## License
MIT

---

### Publishing Procedure
1. Ensure `.env.local` is **not** committed (check with `git status`).
2. Commit your code:
   ```sh
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. Your code will be published to [https://github.com/adityajadhav2004/stockprediticionai](https://github.com/adityajadhav2004/stockprediticionai)
4. **Never share your `.env.local` file or API keys.**

---

# Stock Signal AI – Robust Stock Search & Analysis

## Features

- **Accurate Stock Search:**
  - Supports both ticker and company name (e.g., "Tata Motors" or "TATAMOTORS.NS").
  - Fuzzy matching and typo correction for real stocks only.
  - Exchange and response method dropdowns in the UI.
- **Robust News & Analysis:**
  - Fetches news using ticker; if no news, retries with company name.
  - Feeds news to OpenRouter/DeepSeek for actionable AI analysis.
  - If OpenRouter fails or returns blank, falls back to Serper (Google), then OpenRouter summary, then AlphaVantage, then Finnhub.
  - Never returns a blank summary—always provides a company profile or a clear fallback message.
  - Logs the full response and provider to the terminal for every request.
- **Security:**
  - API keys are never exposed to the frontend or committed to the repo.
  - `.env.local` is gitignored and must be set up locally.
- **Stock List:**
  - Full, deduplicated, validated NASDAQ and NSE stock list from CSVs.
  - NSE tickers are auto-patched to include `.NS` for compatibility.
- **User Experience:**
  - Clear error and fallback messages for all edge cases.
  - Modern, user-friendly UI.

## How It Works

1. **User searches for a stock** (by name or ticker).
2. **Backend validates** the input and finds the correct ticker.
3. **News is fetched** using the ticker. If no news, tries company name.
4. **AI analysis** is performed on the news. If blank, falls back to Serper, then OpenRouter summary, then AlphaVantage, then Finnhub.
5. **Never blank:** If all else fails, a clear message is shown.
6. **Terminal logs** show the full response and which provider was used.

## Security: API Keys

- **Never commit your API keys!**
- All API keys must be set in `.env.local` (which is gitignored):

```
OPENROUTER_API_KEY=your_openrouter_key
NEWS_API_KEY=your_newsapi_key
FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_KEY=your_alphavantage_key
SERPER_API_KEY=your_serper_key
```

- If you see any API keys in the repo, **remove them immediately** and rotate the keys.

## Setup

1. Clone the repo.
2. Run `pnpm install` (or `npm install`).
3. Add your API keys to `.env.local` (see above).
4. Start the dev server: `pnpm dev` (or `npm run dev`).

## File Structure

- `components/stock-search.tsx` – Search bar, dropdowns, validation, fuzzy matching.
- `app/api/stock-insight/route.ts` – API endpoint, fallback logic, provider logging.
- `public/all_stocks.json` – Full validated stock list.
- `scripts/generate-stock-list.js` – CSV parsing and stock list generation.
- `stockdata/nasdaq_ticker.csv`, `nse_ticker.csv` – Raw stock data.

## Changelog (Latest)

- Robust fallback: If no news for ticker, fetches with company name.
- NSE tickers in all_stocks.json are auto-patched to include `.NS`.
- Multi-level fallback: OpenRouter → Serper → OpenRouter summary → AlphaVantage → Finnhub → never blank.
- Full API response is logged to the terminal for debugging.
- API keys are never exposed or committed.
- README and code are up to date and robust.

---

**For any issues, check the terminal logs for the full backend response and provider chain.**
