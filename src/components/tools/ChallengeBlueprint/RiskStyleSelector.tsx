
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Shield, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const conservativeDrawdown = (metrics.drawdownRisk * 0.8).toFixed(1);
  const aggressiveDrawdown = (metrics.drawdownRisk * 1.2).toFixed(1);
  
  const conservativeProbability = Math.min(99, metrics.passProbability + 5).toFixed(0);
  const aggressiveProbability = Math.max(1, metrics.passProbability - 15).toFixed(0);
  
  const conservativeDays = Math.round(metrics.tradesNeeded / 2);
  const aggressiveDays = Math.round(metrics.tradesNeeded / 4);
  
  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-4">Choose Risk Style</h3>
        
        <div className="flex space-x-4 mb-6">
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
                {currentStyle === 'conservative' ? (
                  "Lower risk, longer timeframe approach with emphasis on capital preservation."
                ) : (
                  "Higher risk, accelerated approach with emphasis on rapid challenge completion."
                )}
              </div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm font-medium">Max Drawdown</div>
              <div className="text-xl font-semibold">
                {currentStyle === 'conservative' ? conservativeDrawdown : aggressiveDrawdown}%
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
