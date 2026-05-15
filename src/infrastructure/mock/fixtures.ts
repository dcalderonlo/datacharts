import type { Quote } from '@/core/domain/entities/Quote'
import type { MarketIndex } from '@/core/domain/entities/MarketIndex'
import type { CompanyProfile } from '@/core/domain/entities/CompanyProfile'
import type { VolatilityData } from '@/core/domain/entities/VolatilityData'
import type { SymbolSearchResult } from '@/core/domain/entities/SymbolSearchResult'

export const mockQuotes: Record<string, Quote> = {
  AAPL: {
    symbol: 'AAPL',
    open: 189.3,
    high: 191.05,
    low: 188.5,
    price: 190.42,
    volume: 52341200,
    latestTradingDay: '2025-05-07',
    previousClose: 188.9,
    change: 1.52,
    changePercent: 0.8,
  },
  GOOGL: {
    symbol: 'GOOGL',
    open: 171.2,
    high: 173.4,
    low: 170.1,
    price: 172.85,
    volume: 21543100,
    latestTradingDay: '2025-05-07',
    previousClose: 170.5,
    change: 2.35,
    changePercent: 1.38,
  },
  MSFT: {
    symbol: 'MSFT',
    open: 415.6,
    high: 419.2,
    low: 414.1,
    price: 418.3,
    volume: 18923400,
    latestTradingDay: '2025-05-07',
    previousClose: 413.8,
    change: 4.5,
    changePercent: 1.09,
  },
  TSLA: {
    symbol: 'TSLA',
    open: 172.4,
    high: 175.9,
    low: 170.2,
    price: 171.3,
    volume: 89234500,
    latestTradingDay: '2025-05-07',
    previousClose: 175.1,
    change: -3.8,
    changePercent: -2.17,
  },
  AMZN: {
    symbol: 'AMZN',
    open: 184.5,
    high: 186.3,
    low: 183.1,
    price: 185.7,
    volume: 31245600,
    latestTradingDay: '2025-05-07',
    previousClose: 183.9,
    change: 1.8,
    changePercent: 0.98,
  },
}

export const defaultMockQuote: Quote = {
  symbol: 'N/A',
  open: 100.0,
  high: 102.5,
  low: 99.1,
  price: 101.3,
  volume: 5000000,
  latestTradingDay: '2025-05-07',
  previousClose: 100.5,
  change: 0.8,
  changePercent: 0.8,
}

export const mockIndices: MarketIndex[] = [
  { name: 'S&P 500 (SPY)', value: 521.43, change: 4.21, changePercent: 0.81, region: 'US' },
  { name: 'NASDAQ (QQQ)', value: 441.87, change: 5.63, changePercent: 1.29, region: 'US' },
  { name: 'Dow Jones (DIA)', value: 398.52, change: -1.14, changePercent: -0.29, region: 'US' },
  { name: 'Russell 2000 (IWM)', value: 198.34, change: 2.07, changePercent: 1.05, region: 'US' },
]

export const mockCompanies: Record<string, CompanyProfile> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 2920000000000,
    peRatio: 31.2,
    dividendYield: 0.51,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    marketCap: 2140000000000,
    peRatio: 24.8,
    dividendYield: 0,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    description: 'Microsoft Corporation develops and supports software, services, devices and solutions worldwide.',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    marketCap: 3110000000000,
    peRatio: 35.4,
    dividendYield: 0.71,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    marketCap: 547000000000,
    peRatio: 48.6,
    dividendYield: 0,
  },
}

export const defaultMockCompany: CompanyProfile = {
  symbol: 'N/A',
  name: 'Unknown Company',
  description: 'No description available for this symbol in mock mode.',
  sector: 'Unknown',
  industry: 'Unknown',
  marketCap: 0,
  peRatio: 0,
  dividendYield: 0,
}

export const mockVolatility: Record<string, VolatilityData> = {
  AAPL: { symbol: 'AAPL', beta: 1.24, fiftyTwoWeekHigh: 199.62, fiftyTwoWeekLow: 164.08 },
  GOOGL: { symbol: 'GOOGL', beta: 1.05, fiftyTwoWeekHigh: 193.31, fiftyTwoWeekLow: 140.53 },
  MSFT: { symbol: 'MSFT', beta: 0.91, fiftyTwoWeekHigh: 468.35, fiftyTwoWeekLow: 385.58 },
  TSLA: { symbol: 'TSLA', beta: 2.31, fiftyTwoWeekHigh: 271.0, fiftyTwoWeekLow: 138.8 },
  AMZN: { symbol: 'AMZN', beta: 1.17, fiftyTwoWeekHigh: 230.0, fiftyTwoWeekLow: 151.61 },
}

export const defaultMockVolatility: VolatilityData = {
  symbol: 'N/A',
  beta: 1.0,
  fiftyTwoWeekHigh: 0,
  fiftyTwoWeekLow: 0,
}

export const mockSymbolSearch: Record<string, SymbolSearchResult[]> = {
  AAPL: [{ symbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' }],
  APPLE: [{ symbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' }],
  GOOGL: [{ symbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Common Stock' }],
  GOOGLE: [{ symbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Common Stock' }],
  MSFT: [{ symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' }],
  MICROSOFT: [{ symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' }],
  TSLA: [{ symbol: 'TSLA', description: 'Tesla, Inc.', type: 'Common Stock' }],
  TESLA: [{ symbol: 'TSLA', description: 'Tesla, Inc.', type: 'Common Stock' }],
  AMZN: [{ symbol: 'AMZN', description: 'Amazon.com Inc.', type: 'Common Stock' }],
  AMAZON: [{ symbol: 'AMZN', description: 'Amazon.com Inc.', type: 'Common Stock' }],
}

export const defaultMockSymbolSearch: SymbolSearchResult[] = []
