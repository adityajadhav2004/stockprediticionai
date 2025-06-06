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

## Recent Updates (June 2025)

- **Exchange Dropdown:** You can now select between NSE and NASDAQ stocks directly in the search bar for more accurate results and suggestions.
- **Response Method Selection:** Choose between OpenRouter AI and Serper (Google) as the response provider, blended into the search bar for convenience.
- **Robust AI Fallback:** If OpenRouter/DeepSeek cannot provide a summary, the backend will automatically try Serper (Google) to ensure you always get a real, fact-based summary for any valid stock.
- **Terminal Logging:** The backend logs which AI or API (OpenRouter, Serper) provided the response for each request.
- **Input Trimming:** Extra spaces in stock names are automatically removed before processing.
- **Security:** API keys (including Serper) are never pushed to the repo and must be set in `.env.local` (which is gitignored).
- **Bug Fixes:** Prevented runtime errors when no news is found by providing safe defaults for all result fields.

For any issues, contact [Aditya Jadhav](https://www.linkedin.com/in/aditya-jadhav-coder/).
