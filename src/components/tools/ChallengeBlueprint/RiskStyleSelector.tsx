
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
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2">Choose Risk Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your trading risk style to see your custom strategy.
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('conservative')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    currentStyle === 'conservative'
                      ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className={`h-5 w-5 ${
                    currentStyle === 'conservative' ? 'text-accent' : 'text-foreground/70'
                  }`} />
                  <span className="mt-1 text-sm font-medium">Conservative</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lower risk per trade (0.25% to 0.5%). Slower but safer path to pass.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('balanced')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    currentStyle === 'balanced'
                      ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Gauge className={`h-5 w-5 ${
                    currentStyle === 'balanced' ? 'text-accent' : 'text-foreground/70'
                  }`} />
                  <span className="mt-1 text-sm font-medium">Balanced</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Moderate risk per trade (0.75% to 1.25%). Balanced approach between safety and speed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onStyleChange('aggressive')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    currentStyle === 'aggressive'
                      ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flame className={`h-5 w-5 ${
                    currentStyle === 'aggressive' ? 'text-accent' : 'text-foreground/70'
                  }`} />
                  <span className="mt-1 text-sm font-medium">Aggressive</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Higher risk per trade (1.5% to 2.5%). Faster pass potential, but higher drawdown risk.</p>
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
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Risk Profile</div>
              <div className="text-sm mt-1">
                {currentStyle === 'conservative' 
                  ? "Lower risk with higher consistency. Best for careful traders aiming to pass steadily."
                  : currentStyle === 'balanced'
                    ? "Balanced approach with moderate risk. Good for most traders seeking reliable results."
                    : "Higher risk, faster challenge pace. Best for confident traders targeting quick results."
                }
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
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
                      <p>This is your risk % per trade, not the prop firm limit. It determines how much of your account you're willing to risk on a single position.</p>
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
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Win/Loss Buffer</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' 
                  ? conservativeDays 
                  : currentStyle === 'balanced' 
                    ? balancedDays 
                    : aggressiveDays} trades
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Pass Probability</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' 
                  ? conservativeProbability 
                  : currentStyle === 'balanced' 
                    ? balancedProbability 
                    : aggressiveProbability}%
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-3 bg-accent/10 rounded-lg border border-accent/20"
            >
              <div className="text-sm font-medium">Pass Strategy</div>
              <div className="text-sm mt-1">
                {currentStyle === 'conservative' 
                  ? `With conservative risk, you'll need approximately ${Math.ceil(conservativeDays / 3)} wins in ${conservativeDays} trades to stay on track.`
                  : currentStyle === 'balanced'
                    ? `With balanced risk, you'll need approximately ${Math.ceil(balancedDays / 2.5)} wins in ${balancedDays} trades to maintain progress.`
                    : `With aggressive risk, you'll need approximately ${Math.ceil(aggressiveDays / 2)} wins in ${aggressiveDays} trades to reach your target quickly.`
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
