import React from 'react';
import { CandlestickChart, Code, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg shadow-lg shadow-gold-500/20">
              <CandlestickChart className="text-slate-900 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                QuantForge
              </h1>
              <p className="text-xs text-gold-500 font-mono tracking-wider">MQL5 STRATEGY BUILDER</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <div className="flex items-center space-x-2 text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">
              <Activity size={16} />
              <span>Builder</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">
              <Code size={16} />
              <span>MQL5 Reference</span>
            </div>
          </div>

          <div className="flex items-center">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                v2.0 Beta
              </span>
          </div>
        </div>
      </div>
    </header>
  );
};
