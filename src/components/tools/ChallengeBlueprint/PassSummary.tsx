
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, TrendingUp, Trophy } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PassSummaryProps {
  tradesNeeded: number;
  winsNeeded: number;
  passProbability: number;
  requiredWins: number;
  dailyTrades: number;
  isLoading: boolean;
}

const PassSummary: React.FC<PassSummaryProps> = ({
  tradesNeeded,
  winsNeeded,
  passProbability,
  requiredWins,
  dailyTrades,
  isLoading
}) => {
  // Determine status based on probability
  const getStatusInfo = () => {
    if (passProbability >= 85) {
      return {
        label: "High Probability",
        color: "bg-green-500/20 border-green-500/30 text-green-600",
        icon: <CheckCircle className="h-5 w-5" />,
        description: "You're well-positioned to pass this challenge!"
      };
    }
    if (passProbability >= 60) {
      return {
        label: "Good Probability",
        color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-600",
        icon: <TrendingUp className="h-5 w-5" />,
        description: "Your strategy shows promise with some fine-tuning."
      };
    }
    return {
      label: "Needs Improvement",
      color: "bg-red-500/20 border-red-500/30 text-red-600",
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Consider adjusting your approach for better odds."
    };
  };

  const status = getStatusInfo();

  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/30">
        <CardTitle className="text-xl flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-accent" />
          Challenge Success Blueprint
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Calculating your success path...</span>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Probability Status */}
            <div className="flex items-center">
              <div className={cn("p-2 rounded-full mr-3", status.color)}>
                {status.icon}
              </div>
              <div>
                <div className="font-medium flex items-center">
                  <span className="text-lg">{passProbability}%</span>
                  <span className="ml-2 text-sm text-muted-foreground">{status.label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {status.description}
                </div>
              </div>
            </div>
            
            {/* Probability Bar */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Success Probability</div>
              <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${passProbability}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={cn(
                    "h-full rounded-full",
                    passProbability >= 85 ? "bg-green-500" : 
                    passProbability >= 60 ? "bg-yellow-500" : 
                    "bg-red-500"
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-3 border border-border/50 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
              >
                <div className="text-sm text-muted-foreground">Winning Trades Required</div>
                <div className="text-2xl font-semibold">{winsNeeded}</div>
                <div className="text-xs text-muted-foreground mt-1">To reach profit target</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-3 border border-border/50 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
              >
                <div className="text-sm text-muted-foreground">Total Trades Needed</div>
                <div className="text-2xl font-semibold">{tradesNeeded}</div>
                <div className="text-xs text-muted-foreground mt-1">Based on your win rate</div>
              </motion.div>
            </div>
            
            {/* Daily Trading Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="p-4 rounded-lg bg-accent/10 border border-accent/20"
            >
              <div className="font-medium mb-1">Daily Trading Plan</div>
              <div className="text-xl font-semibold">{dailyTrades} trades/day</div>
              <div className="text-sm mt-1">
                {dailyTrades === 1 ? (
                  "Take it steady - one high-quality trade per day."
                ) : dailyTrades <= 3 ? (
                  "Focus on quality over quantity for the best results."
                ) : (
                  "Active trading strategy - maintain discipline with each trade."
                )}
              </div>
            </motion.div>
            
            {/* Strategy Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-sm space-y-2"
            >
              <div className="font-medium">Your Blueprint Summary</div>
              <p>
                You need <span className="font-medium">{winsNeeded} winning trades</span> out of approximately {tradesNeeded} total trades. 
                With your current win rate and strategy, this gives you a <span className={cn(
                  "font-medium",
                  passProbability >= 85 ? "text-green-500" : 
                  passProbability >= 60 ? "text-yellow-500" : 
                  "text-red-500"
                )}>{passProbability}% chance of success</span>.
              </p>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
