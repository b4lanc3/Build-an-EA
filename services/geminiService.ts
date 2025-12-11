import { GoogleGenAI, Type } from "@google/genai";
import { StrategyConfig, BacktestResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMQL5Code = async (config: StrategyConfig): Promise<{ code: string; explanation: string }> => {
  const prompt = `
    You are an expert MQL5 (MetaQuotes Language 5) developer. 
    Your task is to write a COMPLETE, COMPILABLE, and ROBUST Expert Advisor (EA) for MetaTrader 5 based on the following strategy configuration.

    STRATEGY CONFIGURATION:
    -----------------------
    EA Name: ${config.name}
    Symbol: ${config.asset}
    Timeframe: ${config.timeframe}
    
    RISK MANAGEMENT:
    - Type: ${config.risk.managementType}
    - Base Lot Size: ${config.risk.lotSize}
    - Stop Loss (Points): ${config.risk.stopLossPoints}
    - Take Profit (Points): ${config.risk.takeProfitPoints}
    - Trailing Stop (Points): ${config.risk.trailingStopPoints}
    ${config.risk.managementType === 'MARTINGALE' ? `- Martingale Multiplier: ${config.risk.multiplier}` : ''}
    ${config.risk.managementType === 'GRID' ? `- Grid Step (Points): ${config.risk.gridStep}` : ''}

    BUY ENTRY LOGIC (All must be true):
    ${config.buyConditions.map((c, i) => `${i + 1}. ${c.name} (Period: ${c.period}) is ${c.condition} value ${c.value} ${c.method ? `(${c.method})` : ''}`).join('\n')}

    SELL ENTRY LOGIC (All must be true):
    ${config.sellConditions.map((c, i) => `${i + 1}. ${c.name} (Period: ${c.period}) is ${c.condition} value ${c.value} ${c.method ? `(${c.method})` : ''}`).join('\n')}

    REQUIREMENTS:
    1. Include standard MQL5 libraries (\`#include <Trade\\Trade.mqh>\`).
    2. Use \`CTrade\` class for execution.
    3. Implement \`OnInit\`, \`OnDeinit\`, and \`OnTick\` functions.
    4. Implement logic for ${config.risk.managementType} money management.
    5. Handle new bar detection to avoid tick spamming (unless scalper).
    6. Include comments explaining the code logic.
    
    OUTPUT FORMAT:
    Return valid MQL5 code inside a Markdown code block. 
    Followed by a brief textual summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });

    const text = response.text || "";
    const codeMatch = text.match(/```(?:mql5|c\+\+|c)?\s*([\s\S]*?)```/i);
    const code = codeMatch ? codeMatch[1].trim() : "// Error: Could not parse code.";
    const explanation = text.replace(/```[\s\S]*?```/g, "").trim();

    return { code, explanation };

  } catch (error) {
    console.error("Error generating MQL5 code:", error);
    throw new Error("Failed to generate Expert Advisor code.");
  }
};

export const runBacktestSimulation = async (config: StrategyConfig): Promise<BacktestResult> => {
  const prompt = `
    Act as a high-frequency trading simulation engine.
    Analyze the following trading strategy logic for ${config.asset} on ${config.timeframe}.
    
    STRATEGY:
    Buy: ${JSON.stringify(config.buyConditions)}
    Sell: ${JSON.stringify(config.sellConditions)}
    Risk: ${JSON.stringify(config.risk)}

    Task:
    1. Evaluate the mathematical probability of this strategy working based on historical market behavior of ${config.asset}.
    2. SIMULATE a backtest over the last 12 months.
    3. Generate realistic metrics (Profit Factor, Win Rate, Drawdown).
    4. Generate a 20-point equity curve array representing the balance over time (starting at 10000).

    Output JSON Format:
    {
      "profitFactor": number,
      "winRate": number,
      "totalTrades": number,
      "maxDrawdown": number,
      "netProfit": number,
      "equityCurve": [number, ...],
      "analysis": "string summary"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                profitFactor: { type: Type.NUMBER },
                winRate: { type: Type.NUMBER },
                totalTrades: { type: Type.NUMBER },
                maxDrawdown: { type: Type.NUMBER },
                netProfit: { type: Type.NUMBER },
                equityCurve: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                analysis: { type: Type.STRING }
            }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as BacktestResult;
  } catch (error) {
    console.error("Backtest simulation failed", error);
    // Return dummy data on failure to prevent crash
    return {
        profitFactor: 0,
        winRate: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        netProfit: 0,
        equityCurve: [10000, 10000],
        analysis: "Simulation failed. Please try again."
    };
  }
};

export const optimizeStrategy = async (config: StrategyConfig): Promise<StrategyConfig> => {
    // A simplified optimizer that tweaks one parameter slightly
    const cloned = JSON.parse(JSON.stringify(config));
    // Simple heuristic tweaks for the demo
    if (cloned.risk.stopLossPoints > 0) cloned.risk.stopLossPoints = Math.floor(cloned.risk.stopLossPoints * 0.9);
    if (cloned.risk.takeProfitPoints > 0) cloned.risk.takeProfitPoints = Math.floor(cloned.risk.takeProfitPoints * 1.1);
    
    // Tweak indicator periods
    cloned.buyConditions.forEach((c: any) => {
        if(c.period) c.period = c.period + 1;
    });
     cloned.sellConditions.forEach((c: any) => {
        if(c.period) c.period = c.period + 1;
    });

    cloned.name = cloned.name + "_Optimized";
    return cloned;
};
