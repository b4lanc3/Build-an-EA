import React, { useState } from 'react';
import { ASSETS, TIMEFRAMES, RISK_TYPES, PREBUILT_TEMPLATES } from '../constants';
import { StrategyConfig, Indicator, StrategyTemplate } from '../types';
import { IndicatorForm } from './IndicatorForm';
import { optimizeStrategy } from '../services/geminiService';
import { Plus, Settings, TrendingUp, TrendingDown, DollarSign, Shield, Code, Library, Wand2, ArrowDownCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface StrategyBuilderProps {
  config: StrategyConfig;
  setConfig: React.Dispatch<React.SetStateAction<StrategyConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleLoadTemplate = (template: StrategyTemplate) => {
    setConfig(template.config);
    setShowTemplates(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
        const optimized = await optimizeStrategy(config);
        setConfig(optimized);
        alert('Strategy Optimized! Parameters have been tweaked by AI.');
    } catch(e) {
        alert('Optimization failed.');
    } finally {
        setIsOptimizing(false);
    }
  };

  const addBuyCondition = () => {
    const newIndicator: Indicator = {
      id: uuidv4(),
      name: 'RSI',
      period: 14,
      shift: 0,
      condition: 'LESS',
      value: 30
    };
    setConfig(prev => ({ ...prev, buyConditions: [...prev.buyConditions, newIndicator] }));
  };

  const addSellCondition = () => {
    const newIndicator: Indicator = {
      id: uuidv4(),
      name: 'RSI',
      period: 14,
      shift: 0,
      condition: 'GREATER',
      value: 70
    };
    setConfig(prev => ({ ...prev, sellConditions: [...prev.sellConditions, newIndicator] }));
  };

  const updateBuyCondition = (idx: number, updated: Indicator) => {
    const newConditions = [...config.buyConditions];
    newConditions[idx] = updated;
    setConfig(prev => ({ ...prev, buyConditions: newConditions }));
  };

  const updateSellCondition = (idx: number, updated: Indicator) => {
    const newConditions = [...config.sellConditions];
    newConditions[idx] = updated;
    setConfig(prev => ({ ...prev, sellConditions: newConditions }));
  };

  const removeBuyCondition = (idx: number) => {
    setConfig(prev => ({ ...prev, buyConditions: prev.buyConditions.filter((_, i) => i !== idx) }));
  };

  const removeSellCondition = (idx: number) => {
    setConfig(prev => ({ ...prev, sellConditions: prev.sellConditions.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-8 animate-fade-in-up relative">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Strategy Designer</h2>
            <p className="text-slate-400 text-sm">Visually construct your algorithm.</p>
        </div>
        <div className="flex space-x-3">
             <button 
                onClick={() => setShowTemplates(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
             >
                <Library size={18} />
                <span>Templates</span>
             </button>
             <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-all"
             >
                {isOptimizing ? <Wand2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                <span>AI Optimize</span>
             </button>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Col: Setup & Risk */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-2 mb-4 text-gold-500">
                    <Settings size={20} />
                    <h3 className="font-semibold text-white">Global Settings</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400">Strategy Name</label>
                        <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Asset</label>
                        <select value={config.asset} onChange={(e) => setConfig({...config, asset: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm">
                            {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs text-slate-400">Timeframe</label>
                        <select value={config.timeframe} onChange={(e) => setConfig({...config, timeframe: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm">
                            {TIMEFRAMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            <section className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-2 mb-4 text-blue-400">
                    <Shield size={20} />
                    <h3 className="font-semibold text-white">Risk Management</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400">Mode</label>
                        <select 
                            value={config.risk.managementType || 'FIXED'} 
                            onChange={(e) => setConfig(prev => ({ ...prev, risk: { ...prev.risk, managementType: e.target.value as any } }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                        >
                            {RISK_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="text-xs text-slate-400">Lots</label>
                            <input type="number" step="0.01" value={config.risk.lotSize} onChange={(e) => setConfig(prev => ({...prev, risk: {...prev.risk, lotSize: parseFloat(e.target.value)}}))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
                        </div>
                         <div>
                            <label className="text-xs text-slate-400">Stop Loss</label>
                            <input type="number" value={config.risk.stopLossPoints} onChange={(e) => setConfig(prev => ({...prev, risk: {...prev.risk, stopLossPoints: parseInt(e.target.value)}}))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
                        </div>
                         <div>
                            <label className="text-xs text-slate-400">Take Profit</label>
                            <input type="number" value={config.risk.takeProfitPoints} onChange={(e) => setConfig(prev => ({...prev, risk: {...prev.risk, takeProfitPoints: parseInt(e.target.value)}}))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
                        </div>
                         <div>
                            <label className="text-xs text-slate-400">Trail Stop</label>
                            <input type="number" value={config.risk.trailingStopPoints} onChange={(e) => setConfig(prev => ({...prev, risk: {...prev.risk, trailingStopPoints: parseInt(e.target.value)}}))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
                        </div>
                    </div>

                    {config.risk.managementType === 'MARTINGALE' && (
                        <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                            <label className="text-xs text-red-300">Multiplier</label>
                            <input type="number" step="0.1" value={config.risk.multiplier || 2.0} onChange={(e) => setConfig(prev => ({...prev, risk: {...prev.risk, multiplier: parseFloat(e.target.value)}}))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm mt-1" />
                        </div>
                    )}
                </div>
            </section>
        </div>

        {/* Right Col: Visual Logic Builder */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Buy Flow */}
            <div className="relative">
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-slate-700/50 -z-10"></div>
                <div className="flex items-center space-x-3 mb-6">
                     <div className="bg-trading-green/20 p-2 rounded-lg text-trading-green border border-trading-green/30">
                        <TrendingUp size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-white">Long (Buy) Signal Flow</h3>
                </div>

                <div className="space-y-6 pl-2">
                    {/* Start Node */}
                    <div className="flex justify-center">
                        <div className="bg-slate-700 text-xs font-mono py-1 px-3 rounded-full text-slate-300 border border-slate-600">Start: Market Tick</div>
                    </div>
                    <div className="flex justify-center h-4"><div className="w-0.5 h-full bg-slate-600"></div></div>

                    {config.buyConditions.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-800/50">
                            <p className="text-slate-500 mb-4">No logic blocks added.</p>
                            <button onClick={addBuyCondition} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                + Add Condition
                            </button>
                        </div>
                    ) : (
                        config.buyConditions.map((ind, idx) => (
                            <IndicatorForm 
                                key={ind.id} 
                                indicator={ind} 
                                onChange={(updated) => updateBuyCondition(idx, updated)}
                                onRemove={() => removeBuyCondition(idx)}
                                isFirst={idx === 0}
                                isLast={idx === config.buyConditions.length - 1}
                            />
                        ))
                    )}
                    
                    {config.buyConditions.length > 0 && (
                        <div className="flex justify-center pt-2">
                             <button onClick={addBuyCondition} className="bg-slate-700/50 hover:bg-slate-700 text-slate-400 p-2 rounded-full border border-slate-600 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-center h-4"><div className="w-0.5 h-full bg-slate-600"></div></div>
                    {/* Trigger Node */}
                    <div className="bg-trading-green/10 border border-trading-green/30 p-4 rounded-xl text-center">
                        <div className="text-trading-green font-bold text-sm uppercase tracking-widest mb-1">Trigger Buy Order</div>
                        <div className="text-xs text-trading-green/70">Executes when all blocks are valid</div>
                    </div>
                </div>
            </div>

             {/* Sell Flow */}
            <div className="relative pt-8 border-t border-slate-700/50 mt-8">
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-700/50 -z-10"></div>
                <div className="flex items-center space-x-3 mb-6">
                     <div className="bg-trading-red/20 p-2 rounded-lg text-trading-red border border-trading-red/30">
                        <TrendingDown size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-white">Short (Sell) Signal Flow</h3>
                </div>

                <div className="space-y-6 pl-2">
                    {config.sellConditions.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-800/50">
                            <p className="text-slate-500 mb-4">No logic blocks added.</p>
                            <button onClick={addSellCondition} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                + Add Condition
                            </button>
                        </div>
                    ) : (
                        config.sellConditions.map((ind, idx) => (
                            <IndicatorForm 
                                key={ind.id} 
                                indicator={ind} 
                                onChange={(updated) => updateSellCondition(idx, updated)}
                                onRemove={() => removeSellCondition(idx)}
                                isFirst={idx === 0}
                                isLast={idx === config.sellConditions.length - 1}
                            />
                        ))
                    )}
                    
                    {config.sellConditions.length > 0 && (
                        <div className="flex justify-center pt-2">
                             <button onClick={addSellCondition} className="bg-slate-700/50 hover:bg-slate-700 text-slate-400 p-2 rounded-full border border-slate-600 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                    
                    <div className="flex justify-center h-4"><div className="w-0.5 h-full bg-slate-600"></div></div>
                    <div className="bg-trading-red/10 border border-trading-red/30 p-4 rounded-xl text-center">
                        <div className="text-trading-red font-bold text-sm uppercase tracking-widest mb-1">Trigger Sell Order</div>
                        <div className="text-xs text-trading-red/70">Executes when all blocks are valid</div>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Floating Generate Button */}
      <div className="fixed bottom-12 right-8 z-30">
        <button
          onClick={onGenerate}
          disabled={isGenerating || (config.buyConditions.length === 0 && config.sellConditions.length === 0)}
          className={`
            px-8 py-4 rounded-full font-bold text-lg shadow-2xl flex items-center space-x-3 transition-all transform hover:scale-105 border border-white/10
            ${isGenerating 
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 hover:shadow-gold-500/40'
            }
          `}
        >
          {isGenerating ? (
            <>
              <ArrowDownCircle className="animate-bounce" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Code size={20} />
              <span>Generate EA</span>
            </>
          )}
        </button>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
                    <h2 className="text-xl font-bold text-white">Strategy Templates</h2>
                    <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-white">Close</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PREBUILT_TEMPLATES.map(t => (
                        <div key={t.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-gold-500/50 transition-colors group cursor-pointer" onClick={() => handleLoadTemplate(t)}>
                            <h3 className="text-lg font-bold text-white group-hover:text-gold-400 mb-2">{t.name}</h3>
                            <p className="text-sm text-slate-400 mb-4 h-12 overflow-hidden">{t.description}</p>
                            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                                <span className="px-2 py-1 bg-slate-800 rounded">{t.config.asset}</span>
                                <span className="px-2 py-1 bg-slate-800 rounded">{t.config.timeframe}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
