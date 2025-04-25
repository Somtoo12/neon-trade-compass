
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Shield, Flame } from 'lucide-react';
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
}

const RiskStyleSelector: React.FC<RiskStyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  metrics
}) => {
  // Calculate risk adjusted metrics
  const conservativeRisk = 0.5;
  const aggressiveRisk = 2.0;
  const currentRisk = currentStyle === 'conservative' ? conservativeRisk : aggressiveRisk;
  
  const conservativeProbability = Math.min(99, metrics.passProbability + 5).toFixed(0);
  const aggressiveProbability = Math.max(1, metrics.passProbability - 15).toFixed(0);
  
  const conservativeDays = Math.round(metrics.tradesNeeded / 2);
  const aggressiveDays = Math.round(metrics.tradesNeeded / 4);

  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2">Choose Risk Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your trading risk style below to see your suggested strategy.
        </p>
        
        <div className="flex space-x-4 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onStyleChange('conservative')}
                  className={`flex flex-1 flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'conservative'
                      ? 'border-accent shadow-[0_0_10px_rgba(123,97,255,0.4)] bg-accent/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                >
                  <Shield className={`h-6 w-6 ${
                    currentStyle === 'conservative' ? 'text-accent' : 'text-foreground/70'
                  }`} />
                  <span className="mt-2 font-medium">Conservative</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lower risk per trade (0.25% to 0.5%). Slower but safer path to pass.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onStyleChange('aggressive')}
                  className={`flex flex-1 flex-col items-center p-4 rounded-lg border transition-all ${
                    currentStyle === 'aggressive'
                      ? 'border-accent shadow-[0_0_10px_rgba(123,97,255,0.4)] bg-accent/10'
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                  }`}
                >
                  <Flame className={`h-6 w-6 ${
                    currentStyle === 'aggressive' ? 'text-accent' : 'text-foreground/70'
                  }`} />
                  <span className="mt-2 font-medium">Aggressive</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Higher risk per trade (1% to 2%). Faster pass potential, but higher drawdown risk.</p>
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
                  : "Higher risk, faster challenge pace. Best for confident traders targeting quick results."
                }
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Risk Per Trade</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' ? conservativeRisk : aggressiveRisk}% per trade
              </div>
              <div className="mt-3">
                <Slider
                  defaultValue={[currentRisk]}
                  max={3}
                  min={0.25}
                  step={0.25}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Customize risk level (0.25% - 3%)
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Win/Loss Buffer</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' ? conservativeDays : aggressiveDays} trades
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Pass Probability</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' ? conservativeProbability : aggressiveProbability}%
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RiskStyleSelector;
