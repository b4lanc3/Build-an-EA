import { AssetType, StrategyTemplate } from './types';
import { v4 as uuidv4 } from 'uuid';

export const ASSETS = [
  { symbol: 'XAUUSD', name: 'Gold vs US Dollar', type: AssetType.COMMODITY },
  { symbol: 'BTCUSD', name: 'Bitcoin', type: AssetType.CRYPTO },
  { symbol: 'ETHUSD', name: 'Ethereum', type: AssetType.CRYPTO },
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', type: AssetType.FOREX },
  { symbol: 'GBPUSD', name: 'Great Britain Pound', type: AssetType.FOREX },
  { symbol: 'US30', name: 'Dow Jones 30', type: AssetType.STOCK },
  { symbol: 'NDX100', name: 'Nasdaq 100', type: AssetType.STOCK },
  { symbol: 'AAPL', name: 'Apple Inc.', type: AssetType.STOCK },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: AssetType.STOCK },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: AssetType.STOCK },
];

export const TIMEFRAMES = [
  { label: 'M1 (1 Minute)', value: 'PERIOD_M1' },
  { label: 'M5 (5 Minutes)', value: 'PERIOD_M5' },
  { label: 'M15 (15 Minutes)', value: 'PERIOD_M15' },
  { label: 'H1 (1 Hour)', value: 'PERIOD_H1' },
  { label: 'H4 (4 Hours)', value: 'PERIOD_H4' },
  { label: 'D1 (Daily)', value: 'PERIOD_D1' },
];

export const INDICATOR_TYPES = [
  'RSI',
  'Moving Average',
  'Bollinger Bands',
  'MACD',
  'Stochastic',
  'CCI',
  'ADX',
  'ATR'
];

export const MA_METHODS = ['MODE_SMA', 'MODE_EMA', 'MODE_SMMA', 'MODE_LWMA'];
export const APPLIED_PRICES = ['PRICE_CLOSE', 'PRICE_OPEN', 'PRICE_HIGH', 'PRICE_LOW'];

export const RISK_TYPES = [
  { value: 'FIXED', label: 'Fixed Lot Size' },
  { value: 'MARTINGALE', label: 'Martingale (Risky)' },
  { value: 'GRID', label: 'Grid System (Range)' }
];

export const PREBUILT_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'gold-scalper',
    name: 'Gold M5 Scalper',
    description: 'High-frequency scalping strategy for XAUUSD using RSI and Stochastic.',
    config: {
      name: 'Gold_Scalper_Pro',
      asset: 'XAUUSD',
      timeframe: 'PERIOD_M5',
      buyConditions: [
        { id: uuidv4(), name: 'RSI', period: 14, shift: 0, condition: 'LESS', value: 30 },
        { id: uuidv4(), name: 'Stochastic', period: 5, shift: 0, condition: 'CROSS_UP', value: 20 }
      ],
      sellConditions: [
        { id: uuidv4(), name: 'RSI', period: 14, shift: 0, condition: 'GREATER', value: 70 },
        { id: uuidv4(), name: 'Stochastic', period: 5, shift: 0, condition: 'CROSS_DOWN', value: 80 }
      ],
      risk: {
        lotSize: 0.01,
        stopLossPoints: 300,
        takeProfitPoints: 600,
        trailingStopPoints: 150,
        useCompoundInterest: false,
        riskPercent: 1,
        managementType: 'FIXED'
      }
    }
  },
  {
    id: 'btc-trend',
    name: 'Bitcoin Trend Follower',
    description: 'Captures large moves in BTC using Moving Average crossovers.',
    config: {
      name: 'BTC_TrendMaster',
      asset: 'BTCUSD',
      timeframe: 'PERIOD_H4',
      buyConditions: [
        { id: uuidv4(), name: 'Moving Average', period: 50, shift: 0, method: 'MODE_EMA', condition: 'CROSS_UP', value: 200 } // Logic implying cross up 200 MA, simplified for builder
      ],
      sellConditions: [
         { id: uuidv4(), name: 'Moving Average', period: 50, shift: 0, method: 'MODE_EMA', condition: 'CROSS_DOWN', value: 200 }
      ],
      risk: {
        lotSize: 0.1,
        stopLossPoints: 5000,
        takeProfitPoints: 15000,
        trailingStopPoints: 2000,
        useCompoundInterest: true,
        riskPercent: 2,
        managementType: 'FIXED'
      }
    }
  },
  {
    id: 'martingale-grid',
    name: 'Forex Grid Recovery',
    description: 'Advanced grid strategy for EURUSD. WARNING: High Risk.',
    config: {
      name: 'EUR_Grid_System',
      asset: 'EURUSD',
      timeframe: 'PERIOD_M15',
      buyConditions: [
        { id: uuidv4(), name: 'CCI', period: 14, shift: 0, condition: 'LESS', value: -100 }
      ],
      sellConditions: [
        { id: uuidv4(), name: 'CCI', period: 14, shift: 0, condition: 'GREATER', value: 100 }
      ],
      risk: {
        lotSize: 0.01,
        stopLossPoints: 0, // No hard SL for grid usually
        takeProfitPoints: 200,
        trailingStopPoints: 0,
        useCompoundInterest: false,
        riskPercent: 1,
        managementType: 'MARTINGALE',
        multiplier: 1.5
      }
    }
  }
];
