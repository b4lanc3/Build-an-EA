import React from 'react';
import { BacktestResult } from '../types';
import { TrendingUp, Activity, AlertTriangle, BarChart2 } from 'lucide-react';

interface BacktestPanelProps {
  result: BacktestResult;
}

export const BacktestPanel: React.FC<BacktestPanelProps> = ({ result }) => {
    // Generate simple SVG path for equity curve
    const max = Math.max(...result.equityCurve);
    const min = Math.min(...result.equityCurve);
    const range = max - min;
    const height = 150;
    const width = 100; // Percentage
    
    const points = result.equityCurve.map((val, i) => {
        const x = (i / (result.equityCurve.length - 1)) * 100;
        const y = height - ((val - min) / range) * height; // Invert Y for SVG
        return `${x},${y}`;
    }).join(' ');

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6 animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-6">
            <BarChart2 className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">AI Backtest Simulation</h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">Estimated Performance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase mb-1">Profit Factor</div>
                <div className={`text-2xl font-bold ${result.profitFactor >= 1.5 ? 'text-green-400' : result.profitFactor >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.profitFactor.toFixed(2)}
                </div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-white">{result.winRate}%</div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase mb-1">Net Profit</div>
                <div className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${result.netProfit.toLocaleString()}
                </div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase mb-1">Max Drawdown</div>
                <div className="text-2xl font-bold text-red-400">{result.maxDrawdown}%</div>
             </div>
        </div>

        {/* Equity Chart */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 mb-6 relative overflow-hidden h-[200px]">
            <div className="absolute top-2 left-4 text-xs text-slate-500">Equity Curve (Simulated)</div>
            <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full h-full pt-6">
                <polyline
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    points={points}
                />
                {/* Fill Area */}
                <polygon 
                    fill="url(#gradient)" 
                    points={`0,${height} ${points} 100,${height}`} 
                    opacity="0.2"
                />
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg border-l-4 border-gold-500">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center">
                <Activity size={14} className="mr-2" /> AI Analysis
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{result.analysis}</p>
        </div>

        <div className="mt-4 flex items-center text-xs text-slate-500 space-x-2">
            <AlertTriangle size={12} />
            <span>Disclaimer: Results are probabilistic simulations based on logic analysis, not historical tick data. Use for educational purposes.</span>
        </div>
    </div>
  );
};
