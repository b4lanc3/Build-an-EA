import React, { useState } from 'react';
import { Header } from './components/Header';
import { StrategyBuilder } from './components/StrategyBuilder';
import { CodePreview } from './components/CodePreview';
import { BacktestPanel } from './components/BacktestPanel';
import { StrategyConfig, GeneratedCode, BacktestResult } from './types';
import { generateMQL5Code, runBacktestSimulation } from './services/geminiService';

function App() {
  const [view, setView] = useState<'BUILDER' | 'RESULT'>('BUILDER');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedCode | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  const [config, setConfig] = useState<StrategyConfig>({
    name: 'GoldRush_V1',
    asset: 'XAUUSD',
    timeframe: 'PERIOD_H1',
    buyConditions: [],
    sellConditions: [],
    risk: {
      lotSize: 0.1,
      stopLossPoints: 500,
      takeProfitPoints: 1000,
      trailingStopPoints: 200,
      useCompoundInterest: false,
      riskPercent: 1.0,
      managementType: 'FIXED',
      multiplier: 1.5,
      gridStep: 300
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Parallel execution: Generate Code AND Run Simulation
      const [codeResult, simResult] = await Promise.all([
        generateMQL5Code(config),
        runBacktestSimulation(config)
      ]);
      
      setGeneratedData(codeResult);
      setBacktestResult(simResult);
      setView('RESULT');
    } catch (error) {
      console.error(error);
      alert("Failed to generate code. Please ensure your API Key is set correctly and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Build Your Edge.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Create professional MetaTrader 5 algorithms for Gold, Crypto, and Stocks visually. 
            Now with <span className="text-gold-500 font-semibold">AI Simulation</span> and <span className="text-purple-400 font-semibold">Optimization</span>.
          </p>
        </div>

        {view === 'BUILDER' ? (
          <StrategyBuilder 
            config={config} 
            setConfig={setConfig} 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        ) : (
          <div className="space-y-6">
            {backtestResult && <BacktestPanel result={backtestResult} />}
            {generatedData && (
                <CodePreview 
                data={generatedData} 
                onBack={() => setView('BUILDER')} 
                />
            )}
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-slate-500 font-mono">
           <div className="flex items-center space-x-4">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> System Operational</span>
              <span>Gemini Pro 1.5</span>
           </div>
           <div>
              © 2024 QuantForge Inc.
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
