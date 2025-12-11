import React from 'react';
import { GeneratedCode } from '../types';
import { Download, ArrowLeft, CheckCircle, Copy } from 'lucide-react';

interface CodePreviewProps {
  data: GeneratedCode;
  onBack: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ data, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([data.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Strategy.mq5";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Builder</span>
        </button>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-gold-500 text-slate-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
          >
            <Download size={18} />
            <span>Download .mq5</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-500 font-mono text-sm">GeneratedExpertAdvisor.mq5</span>
        </div>
        
        <div className="relative">
          <pre className="p-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <code>{data.code}</code>
          </pre>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-2">Strategy Logic Summary</h3>
        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
          {data.explanation}
        </p>
      </div>
    </div>
  );
};
