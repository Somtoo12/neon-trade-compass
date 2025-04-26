import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Shield, Gauge, Flame, HelpCircle } from 'lucide-react';
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
  metrics,
  onRiskPerTradeChange
}) => {
  // Calculate risk adjusted metrics
  const conservativeRisk = 0.5;
  const balancedRisk = 1.0;
  const aggressiveRisk = 2.0;
  
  let currentRisk = balancedRisk;
  if (currentStyle === 'conservative') currentRisk = conservativeRisk;
  if (currentStyle === 'aggressive') currentRisk = aggressiveRisk;
  
  const conservativeProbability = Math.min(99, metrics.passProbability + 5).toFixed(0);
  const balancedProbability = metrics.passProbability.toFixed(0);
  const aggressiveProbability = Math.max(1, metrics.passProbability - 15).toFixed(0);
  
  const conservativeDays = Math.round(metrics.tradesNeeded / 1.5);
  const balancedDays = Math.round(metrics.tradesNeeded / 2);
  const aggressiveDays = Math.round(metrics.tradesNeeded / 3);

  const handleRiskSliderChange = (values: number[]) => {
    if (onRiskPerTradeChange) {
      onRiskPerTradeChange(values[0]);
    }
  };

  return (
    <Card className="border-2 border-neon-cyan backdrop-blur-md bg-background/30 shadow-neon-cyan relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-blue/5 to-neon-cyan/10" />
      
      <CardContent className="p-5 relative z-10">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-neon-cyan" />
          Risk Style Selection
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('conservative')}
                  className={`relative group flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'conservative'
                      ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,179,0.3)] bg-gradient-to-b from-neon-green/10 to-transparent'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-neon-green/5 to-transparent transition-opacity rounded-lg" />
                  <Shield className={`h-8 w-8 mb-2 ${
                    currentStyle === 'conservative' ? 'text-neon-green' : 'text-muted-foreground'
                  } group-hover:text-neon-green/80 transition-colors`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'conservative' ? 'text-neon-green' : ''
                  } group-hover:text-neon-green/80`}>Low</span>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs ${
                    currentStyle === 'conservative' 
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    0.5% risk
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Lower risk with higher consistency. Better chance of passing.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('balanced')}
                  className={`relative group flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'balanced'
                      ? 'border-neon-blue shadow-[0_0_15px_rgba(0,194,255,0.3)] bg-gradient-to-b from-neon-blue/10 to-transparent'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-neon-blue/5 to-transparent transition-opacity rounded-lg" />
                  <Gauge className={`h-8 w-8 mb-2 ${
                    currentStyle === 'balanced' ? 'text-neon-blue' : 'text-muted-foreground'
                  } group-hover:text-neon-blue/80 transition-colors`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'balanced' ? 'text-neon-blue' : ''
                  } group-hover:text-neon-blue/80`}>Medium</span>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs ${
                    currentStyle === 'balanced' 
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    1.0% risk
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Moderate risk for steady growth. Suitable for most traders.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('aggressive')}
                  className={`relative group flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'aggressive'
                      ? 'border-neon-purple shadow-[0_0_15px_rgba(123,97,255,0.3)] bg-gradient-to-b from-neon-purple/10 to-transparent'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-neon-purple/5 to-transparent transition-opacity rounded-lg" />
                  <Flame className={`h-8 w-8 mb-2 ${
                    currentStyle === 'aggressive' ? 'text-neon-purple' : 'text-muted-foreground'
                  } group-hover:text-neon-purple/80 transition-colors`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'aggressive' ? 'text-neon-purple' : ''
                  } group-hover:text-neon-purple/80`}>High</span>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs ${
                    currentStyle === 'aggressive' 
                      ? 'bg-neon-purple/20 text-neon-purple'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    2.0% risk
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Higher risk for faster growth. Only for experienced traders.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.div 
          key={currentStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm rounded-lg border border-white/5">
              <div className="text-sm font-medium">Risk Setting</div>
              <div className="text-sm mt-1">
                {currentStyle === 'conservative' 
                  ? "Lower risk with higher consistency. Better chance of passing with more trading days."
                  : currentStyle === 'balanced'
                    ? "Balanced approach with moderate risk. Standard strategy for most traders."
                    : "Higher risk, faster challenge pace. For experienced traders with high win rates."
                }
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm rounded-lg border border-white/5">
              <div className="flex items-center text-sm font-medium">
                <span>Risk Per Trade</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px]">
                      <p className="text-xs">This is your risk % per trade, not the prop firm limit. It determines how much of your account you're willing to risk on a single position.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xl font-semibold">
                {currentRisk}% per trade
              </div>
              <div className="mt-3">
                <Slider
                  value={[currentRisk]}
                  max={3}
                  min={0.25}
                  step={0.25}
                  className="w-full opacity-50 cursor-not-allowed"
                  disabled
                  onValueChange={() => {}}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Risk level is view-only
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                <div className="text-sm font-medium">Trading Buffer</div>
                <div className="text-xl font-semibold">
                  {currentStyle === 'conservative' 
                    ? conservativeDays 
                    : currentStyle === 'balanced' 
                      ? balancedDays 
                      : aggressiveDays} trades
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                <div className="text-sm font-medium">Success Probability</div>
                <div className="text-xl font-semibold">
                  {currentStyle === 'conservative' 
                    ? conservativeProbability 
                    : currentStyle === 'balanced' 
                      ? balancedProbability 
                      : aggressiveProbability}%
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-4 border border-neon-cyan/30 rounded-lg bg-gradient-to-r from-neon-cyan/5 to-transparent relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 blur-2xl rounded-full"></div>
              <div className="text-sm font-medium text-neon-cyan">Strategy Blueprint</div>
              <div className="text-sm mt-1">
                {currentStyle === 'conservative' 
                  ? `With conservative risk, aim for ${Math.ceil(conservativeDays / 3)} wins in ${conservativeDays} trades for optimal results.`
                  : currentStyle === 'balanced'
                    ? `With balanced risk, target ${Math.ceil(balancedDays / 2.5)} wins in ${balancedDays} trades for steady progress.`
                    : `With aggressive risk, focus on ${Math.ceil(aggressiveDays / 2)} quality wins in ${aggressiveDays} trades.`
                }
              </div>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RiskStyleSelector;
