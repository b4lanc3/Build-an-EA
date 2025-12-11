export enum AssetType {
  FOREX = 'Forex',
  CRYPTO = 'Crypto',
  STOCK = 'Stock',
  COMMODITY = 'Commodity'
}

export interface Indicator {
  id: string;
  name: string; 
  period: number;
  shift: number;
  method?: string; 
  appliedTo?: string;
  condition: 'GREATER' | 'LESS' | 'CROSS_UP' | 'CROSS_DOWN';
  value: number;
}

export interface RiskManagement {
  lotSize: number;
  stopLossPoints: number;
  takeProfitPoints: number;
  trailingStopPoints: number;
  useCompoundInterest: boolean;
  riskPercent: number;
  // New Advanced Features
  managementType: 'FIXED' | 'MARTINGALE' | 'GRID';
  multiplier?: number; // For Martingale
  gridStep?: number; // For Grid
}

export interface StrategyConfig {
  name: string;
  asset: string;
  timeframe: string;
  description?: string;
  buyConditions: Indicator[];
  sellConditions: Indicator[];
  risk: RiskManagement;
}

export interface GeneratedCode {
  code: string;
  explanation: string;
}

export interface BacktestResult {
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  maxDrawdown: number;
  netProfit: number;
  equityCurve: number[]; // Array of equity points for charting
  analysis: string;
}

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  config: StrategyConfig;
}
