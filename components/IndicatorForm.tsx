import React from 'react';
import { Indicator } from '../types';
import { INDICATOR_TYPES, MA_METHODS } from '../constants';
import { Trash2, GripVertical, Activity } from 'lucide-react';

interface IndicatorFormProps {
  indicator: Indicator;
  onChange: (updated: Indicator) => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const IndicatorForm: React.FC<IndicatorFormProps> = ({ indicator, onChange, onRemove, isFirst, isLast }) => {
  return (
    <div className="relative group">
      {/* Visual Connector Line Above */}
      {!isFirst && (
        <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-slate-600 group-hover:bg-gold-500 transition-colors z-0"></div>
      )}
      
      <div className="relative z-10 bg-slate-800 p-0 rounded-xl border border-slate-700 shadow-lg hover:border-gold-500/50 hover:shadow-gold-500/10 transition-all duration-300">
        {/* Header Node */}
        <div className="bg-slate-900/50 p-3 rounded-t-xl border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gold-400">
                <GripVertical size={14} className="text-slate-600 cursor-grab" />
                <Activity size={14} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Logic Block</span>
            </div>
            <button onClick={onRemove} className="text-slate-600 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 rounded">
                <Trash2 size={14} />
            </button>
        </div>

        <div className="p-4 grid grid-cols-12 gap-3">
            {/* Main Indicator Select */}
            <div className="col-span-12 md:col-span-4">
                <label className="text-[10px] uppercase text-slate-500 font-semibold mb-1 block">Indicator</label>
                <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-gold-500 focus:outline-none"
                    value={indicator.name}
                    onChange={(e) => onChange({ ...indicator, name: e.target.value })}
                >
                    {INDICATOR_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Params Row */}
            <div className="col-span-6 md:col-span-2">
                <label className="text-[10px] uppercase text-slate-500 font-semibold mb-1 block">Period</label>
                <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-gold-500 focus:outline-none font-mono"
                    value={indicator.period}
                    onChange={(e) => onChange({ ...indicator, period: parseInt(e.target.value) || 14 })}
                />
            </div>

            <div className="col-span-6 md:col-span-3">
                 <label className="text-[10px] uppercase text-slate-500 font-semibold mb-1 block">Logic</label>
                 <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-gold-500 focus:outline-none"
                    value={indicator.condition}
                    onChange={(e) => onChange({ ...indicator, condition: e.target.value as any })}
                >
                    <option value="GREATER">Greater Than</option>
                    <option value="LESS">Less Than</option>
                    <option value="CROSS_UP">Crosses Up</option>
                    <option value="CROSS_DOWN">Crosses Down</option>
                </select>
            </div>

            <div className="col-span-12 md:col-span-3">
                <label className="text-[10px] uppercase text-slate-500 font-semibold mb-1 block">Value/Level</label>
                <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-gold-500 focus:outline-none font-mono"
                    value={indicator.value}
                    onChange={(e) => onChange({ ...indicator, value: parseFloat(e.target.value) || 0 })}
                />
            </div>

            {/* Extra Options for MA */}
            {indicator.name.includes('Moving Average') && (
                <div className="col-span-12 pt-2 border-t border-slate-700 mt-2">
                     <label className="text-[10px] uppercase text-slate-500 font-semibold mb-1 block">MA Method</label>
                    <select 
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:border-gold-500 focus:outline-none"
                        value={indicator.method}
                        onChange={(e) => onChange({ ...indicator, method: e.target.value })}
                    >
                        {MA_METHODS.map(m => <option key={m} value={m}>{m.replace('MODE_', '')}</option>)}
                    </select>
                </div>
            )}
        </div>
      </div>

      {/* Visual Connector Line Below */}
      {!isLast && (
        <div className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-slate-600 group-hover:bg-gold-500 transition-colors z-0"></div>
      )}
    </div>
  );
};
