// Node.js script to parse NASDAQ and NSE CSVs and output all_stocks.json
// Run: node scripts/generate-stock-list.js

const fs = require('fs');
const path = require('path');
// Use correct import for csv-parse v5+
const { parse } = require('csv-parse/sync');

const nasdaqPath = path.join(__dirname, '../stockdata/nasdaq_ticker.csv');
const nsePath = path.join(__dirname, '../stockdata/nse_ticker.csv');
const outputPath = path.join(__dirname, '../public/all_stocks.json');

function parseNasdaq(csv) {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return records.map(r => ({
    name: r['Security Name']?.replace(/\s*-\s*Common Stock.*/, '')?.trim(),
    symbol: r['Symbol']?.trim(),
    exchange: 'NASDAQ',
  })).filter(r => r.name && r.symbol);
}

function parseNse(csv) {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return records.map(r => ({
    name: r['NAME OF COMPANY']?.trim(),
    symbol: r['SYMBOL']?.trim(),
    exchange: 'NSE',
  })).filter(r => r.name && r.symbol);
}

const nasdaqCsv = fs.readFileSync(nasdaqPath, 'utf8');
const nseCsv = fs.readFileSync(nsePath, 'utf8');
const nasdaqStocks = parseNasdaq(nasdaqCsv);
const nseStocks = parseNse(nseCsv);

const allStocks = [...nasdaqStocks, ...nseStocks];

// Remove duplicates (by symbol or name, case-insensitive)
const seen = new Set();
const uniqueStocks = allStocks.filter(stock => {
  const key = (stock.symbol + '|' + stock.name).toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

fs.writeFileSync(outputPath, JSON.stringify(uniqueStocks, null, 2));
console.log(`Wrote ${uniqueStocks.length} stocks to ${outputPath}`);
