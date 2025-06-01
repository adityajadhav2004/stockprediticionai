# Stock Signal AI by Aditya Jadhav

AI-powered stock insights and predictions using live news and advanced algorithms.

## Features
- AI-generated stock insights from real-time news
- Secure API key management (no secrets in code)
- Modern Next.js, React, and Tailwind CSS stack
- Fact-checking and signal confidence

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
**Never commit `.env.local` to git. It is already in `.gitignore`.**

You can use `.env.example` as a template:
```sh
cp .env.example .env.local
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
- `.env.local` is in `.gitignore` and will not be pushed to GitHub.

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

For any issues, contact [Aditya Jadhav](https://www.linkedin.com/in/aditya-jadhav-coder/).