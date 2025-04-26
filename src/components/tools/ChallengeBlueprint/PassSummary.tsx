
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
        color: "bg-neon-green/20 border-neon-green/40 text-neon-green",
        icon: <CheckCircle className="h-5 w-5" />,
        description: "You're well-positioned to pass this challenge!"
      };
    }
    if (passProbability >= 60) {
      return {
        label: "Good Probability",
        color: "bg-neon-blue/20 border-neon-blue/40 text-neon-blue",
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
    <Card className="cyber-blueprint border-2 border-neon-blue shadow-lg bg-background/30 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-2 border-b border-neon-blue/30">
        <CardTitle className="text-xl flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-neon-blue" />
          <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            CHALLENGE WAR ROOM v9.12
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />
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
              <div className={cn("p-2 rounded-md mr-3", status.color)}>
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
            
            {/* Tactical Status Board */}
            <div className="bg-black/50 border border-neon-blue/30 rounded-md p-3">
              <div className="text-sm text-neon-blue mb-2">TACTICAL STATUS</div>
              <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${passProbability}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={cn(
                    "h-full rounded-full",
                    passProbability >= 85 ? "bg-neon-green" : 
                    passProbability >= 60 ? "bg-neon-blue" : 
                    "bg-red-500"
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            {/* Combat Matrix */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-3 border border-neon-green/40 rounded-md bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="text-sm text-neon-green">WINNING STRIKES</div>
                <div className="text-2xl font-semibold">{winsNeeded}</div>
                <div className="text-xs text-muted-foreground mt-1">To reach profit target</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-3 border border-neon-blue/40 rounded-md bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="text-sm text-neon-blue">BATTLE COUNT</div>
                <div className="text-2xl font-semibold">{tradesNeeded}</div>
                <div className="text-xs text-muted-foreground mt-1">Total engagements needed</div>
              </motion.div>
            </div>
            
            {/* Deployment Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="p-4 rounded-md bg-neon-purple/10 border border-neon-purple/40"
            >
              <div className="font-medium text-neon-purple mb-1">DAILY DEPLOYMENT</div>
              <div className="text-xl font-semibold">{dailyTrades} trades/day</div>
              <div className="text-sm mt-1">
                {dailyTrades === 1 ? (
                  "RECON MODE: One precision strike per day."
                ) : dailyTrades <= 3 ? (
                  "STRIKE MODE: Focus on quality over quantity for best results."
                ) : (
                  "SIEGE MODE: High frequency strategy - maintain strict discipline."
                )}
              </div>
            </motion.div>
            
            {/* Strategic Intelligence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-sm space-y-2"
            >
              <div className="font-medium text-neon-blue">MISSION BLUEPRINT</div>
              <p className="bg-black/40 border border-neon-blue/20 rounded-md p-3">
                Strategic objective: <span className="font-medium">{winsNeeded} winning engagements</span> out of approximately {tradesNeeded} total trades. 
                Current tactical assessment: <span className={cn(
                  "font-medium",
                  passProbability >= 85 ? "text-neon-green" : 
                  passProbability >= 60 ? "text-neon-blue" : 
                  "text-red-500"
                )}>{passProbability}% success probability</span>.
              </p>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
