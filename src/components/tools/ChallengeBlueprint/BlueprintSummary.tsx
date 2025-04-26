import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BlueprintSummaryProps {
  risk: number;
  reward: number;
  drawdown: number;
  successRate: number;
  accountSize: number;
}

const BlueprintSummary: React.FC<BlueprintSummaryProps> = ({
  risk,
  reward,
  drawdown,
  successRate,
  accountSize
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 75) return 'text-neon-green';
    if (rate >= 50) return 'text-neon-blue';
    return 'text-red-500';
  };

  return (
    <Card className="border-2 border-neon-blue shadow-lg bg-black/40 backdrop-blur-md">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          <Trophy className="h-5 w-5 mr-2 text-neon-blue" />
          Blueprint Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="p-3 rounded-lg bg-black/60 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-neon-cyan mr-1.5" />
                      <span className="text-xs text-muted-foreground">RISK</span>
                    </div>
                    <div className="text-base font-bold">{risk}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(accountSize * risk / 100)}
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Maximum risk per trade based on account size</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="p-3 rounded-lg bg-black/60 border border-neon-green/30 hover:border-neon-green/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-neon-green mr-1.5" />
                      <span className="text-xs text-muted-foreground">REWARD</span>
                    </div>
                    <div className="text-base font-bold">{reward}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(accountSize * reward / 100)}
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Expected reward based on risk/reward ratio</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="p-3 rounded-lg bg-black/60 border border-red-500/30 hover:border-red-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-red-400 mr-1.5" />
                      <span className="text-xs text-muted-foreground">DRAWDOWN</span>
                    </div>
                    <div className="text-base font-bold">{drawdown.toFixed(1)}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Max Loss Limit
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Maximum drawdown allowed during challenge</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="p-3 rounded-lg bg-black/60 border border-neon-purple/30 hover:border-neon-purple/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className={`h-4 w-4 mr-1.5 ${getSuccessColor(successRate)}`} />
                      <span className="text-xs text-muted-foreground">SUCCESS</span>
                    </div>
                    <div className={`text-base font-bold ${getSuccessColor(successRate)}`}>
                      {successRate}%
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pass Probability
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Statistical probability of passing the challenge</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.div 
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-transparent border border-neon-cyan/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center text-sm text-neon-cyan">
            <Target className="h-4 w-4 mr-2" />
            Strategy Insight
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            {successRate >= 75 
              ? "Excellent risk-reward setup. Maintain discipline and follow your plan."
              : successRate >= 50
              ? "Solid foundation. Focus on consistency and risk management."
              : "Consider adjusting your parameters for better success probability."}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BlueprintSummary;
