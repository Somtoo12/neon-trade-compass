
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
        <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-neon-cyan" />
          Risk Style Selection
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred trading risk approach for optimal strategy.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('conservative')}
                  className={`relative flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'conservative'
                      ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,179,0.3)] bg-gradient-to-b from-neon-green/10 to-neon-green/5'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className={`h-6 w-6 mb-2 ${
                    currentStyle === 'conservative' ? 'text-neon-green' : 'text-foreground/70'
                  }`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'conservative' ? 'text-neon-green' : ''
                  }`}>Conservative</span>
                  <span className="mt-1 text-xs text-muted-foreground">{conservativeRisk}% risk</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Lower risk per trade (0.25% to 0.5%). Slower but safer path to pass.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('balanced')}
                  className={`relative flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'balanced'
                      ? 'border-neon-blue shadow-[0_0_15px_rgba(0,194,255,0.3)] bg-gradient-to-b from-neon-blue/10 to-neon-blue/5'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Gauge className={`h-6 w-6 mb-2 ${
                    currentStyle === 'balanced' ? 'text-neon-blue' : 'text-foreground/70'
                  }`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'balanced' ? 'text-neon-blue' : ''
                  }`}>Balanced</span>
                  <span className="mt-1 text-xs text-muted-foreground">{balancedRisk}% risk</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Moderate risk per trade (0.75% to 1.25%). Balanced approach between safety and speed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('aggressive')}
                  className={`relative flex flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'aggressive'
                      ? 'border-neon-purple shadow-[0_0_15px_rgba(123,97,255,0.3)] bg-gradient-to-b from-neon-purple/10 to-neon-purple/5'
                      : 'border-border/50 bg-black/30 hover:bg-black/40'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flame className={`h-6 w-6 mb-2 ${
                    currentStyle === 'aggressive' ? 'text-neon-purple' : 'text-foreground/70'
                  }`} />
                  <span className={`text-base font-medium ${
                    currentStyle === 'aggressive' ? 'text-neon-purple' : ''
                  }`}>Aggressive</span>
                  <span className="mt-1 text-xs text-muted-foreground">{aggressiveRisk}% risk</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">Higher risk per trade (1.5% to 2.5%). Faster pass potential, but higher drawdown risk.</p>
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
              <div className="text-sm font-medium">Risk Profile</div>
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
                  className="w-full"
                  onValueChange={handleRiskSliderChange}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Customize risk level (0.25% - 3%)
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

