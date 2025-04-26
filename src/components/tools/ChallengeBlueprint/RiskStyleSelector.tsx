
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Gauge, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StrategyMetrics, RiskStyle } from './index';

interface RiskStyleSelectorProps {
  currentStyle: RiskStyle;
  onStyleChange: (style: RiskStyle) => void;
  metrics: StrategyMetrics;
  onRiskPerTradeChange?: (value: number) => void;
}

const RiskStyleSelector: React.FC<RiskStyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  metrics
}) => {
  // Fixed risk parameters
  const riskStyles = {
    conservative: {
      riskPerTrade: 0.5,
      winBuffer: 8,
      probability: '99%',
      description: "Lower risk with higher consistency. Perfect for methodical traders prioritizing account safety."
    },
    balanced: {
      riskPerTrade: 1.5,
      winBuffer: 5,
      probability: '75%',
      description: "Optimal balance of risk and speed. Recommended for experienced traders with proven strategies."
    },
    aggressive: {
      riskPerTrade: 3.0,
      winBuffer: 2,
      probability: '48%',
      description: "Maximum velocity approach. Only for expert traders with exceptional win rates and mental discipline."
    }
  };

  return (
    <Card className="border border-[#00FEFC]/20 shadow-lg bg-[#0F1A2A]/80 backdrop-blur-lg">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-4 font-['Space_Grotesk',sans-serif] text-[#00FEFC]">🔒 Choose Risk Style</h3>
        
        <div className="grid grid-cols-1 gap-3 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('conservative')}
                  className={`flex items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'conservative'
                      ? 'border-[#00FEFC] shadow-[0_0_15px_rgba(0,254,252,0.3)] bg-gradient-to-r from-[#0F1A2A] to-[#132436]'
                      : 'border-[#00FEFC]/20 bg-[#0F1A2A] hover:bg-[#132436]'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                    currentStyle === 'conservative' ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      currentStyle === 'conservative' ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${
                      currentStyle === 'conservative' ? 'text-[#00FEFC]' : 'text-white'
                    }`}>Conservative</div>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Risk/Trade:</span>
                        <span className="block text-white">{riskStyles.conservative.riskPerTrade}%</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Win Buffer:</span>
                        <span className="block text-white">{riskStyles.conservative.winBuffer} trades</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Pass Odds:</span>
                        <span className="block text-white">{riskStyles.conservative.probability}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0F1A2A] border border-[#00FEFC]/30 text-white max-w-md">
                <p>{riskStyles.conservative.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('balanced')}
                  className={`flex items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'balanced'
                      ? 'border-[#00FEFC] shadow-[0_0_15px_rgba(0,254,252,0.3)] bg-gradient-to-r from-[#0F1A2A] to-[#132436]'
                      : 'border-[#00FEFC]/20 bg-[#0F1A2A] hover:bg-[#132436]'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                    currentStyle === 'balanced' ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'
                  }`}>
                    <Gauge className={`h-5 w-5 ${
                      currentStyle === 'balanced' ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${
                      currentStyle === 'balanced' ? 'text-[#00FEFC]' : 'text-white'
                    }`}>Balanced</div>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Risk/Trade:</span>
                        <span className="block text-white">{riskStyles.balanced.riskPerTrade}%</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Win Buffer:</span>
                        <span className="block text-white">{riskStyles.balanced.winBuffer} trades</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Pass Odds:</span>
                        <span className="block text-white">{riskStyles.balanced.probability}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0F1A2A] border border-[#00FEFC]/30 text-white max-w-md">
                <p>{riskStyles.balanced.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('aggressive')}
                  className={`flex items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'aggressive'
                      ? 'border-[#00FEFC] shadow-[0_0_15px_rgba(0,254,252,0.3)] bg-gradient-to-r from-[#0F1A2A] to-[#132436]'
                      : 'border-[#00FEFC]/20 bg-[#0F1A2A] hover:bg-[#132436]'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                    currentStyle === 'aggressive' ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'
                  }`}>
                    <Flame className={`h-5 w-5 ${
                      currentStyle === 'aggressive' ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${
                      currentStyle === 'aggressive' ? 'text-[#00FEFC]' : 'text-white'
                    }`}>Aggressive</div>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Risk/Trade:</span>
                        <span className="block text-white">{riskStyles.aggressive.riskPerTrade}%</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Win Buffer:</span>
                        <span className="block text-white">{riskStyles.aggressive.winBuffer} trades</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#8A9CB0]">Pass Odds:</span>
                        <span className="block text-white">{riskStyles.aggressive.probability}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0F1A2A] border border-[#00FEFC]/30 text-white max-w-md">
                <p>{riskStyles.aggressive.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.div 
          key={currentStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="p-4 bg-[#00FEFC]/5 rounded-lg border border-[#00FEFC]/20 backdrop-blur-md">
            <div className="text-sm font-medium font-['Space_Grotesk',sans-serif] text-[#00FEFC]">AI Strategy Analysis</div>
            <div className="text-sm mt-2 text-white">
              {currentStyle === 'conservative' 
                ? `With the Conservative approach, focus on high-quality setups only. Target ${Math.ceil(metrics.tradesNeeded / 3.5)} wins in ${Math.ceil(metrics.tradesNeeded)} trades to maximize your probability of success.`
                : currentStyle === 'balanced'
                  ? `The Balanced approach requires disciplined trade selection. Aim for ${Math.ceil(metrics.tradesNeeded / 2.8)} wins in ${Math.ceil(metrics.tradesNeeded)} trades while maintaining drawdown control.`
                  : `This Aggressive approach demands exceptional execution. You'll need ${Math.ceil(metrics.tradesNeeded / 2.2)} wins in ${Math.ceil(metrics.tradesNeeded)} trades with minimal errors to succeed.`
              }
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RiskStyleSelector;
