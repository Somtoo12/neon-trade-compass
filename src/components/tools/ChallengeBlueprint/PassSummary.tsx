
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface PassSummaryProps {
  tradesNeeded: number;
  passProbability: number;
  requiredWins: number;
  dailyTrades: number;
  isLoading?: boolean;
}

const PassSummary: React.FC<PassSummaryProps> = ({
  tradesNeeded, 
  passProbability, 
  requiredWins, 
  dailyTrades,
  isLoading = false,
}) => {
  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">
          Your Challenge Pass Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Trades Needed</div>
                <div className="text-xl font-semibold mt-1">{Math.ceil(tradesNeeded)}</div>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Pass Probability</div>
                <div className="text-xl font-semibold mt-1 flex items-center">
                  {passProbability.toFixed(0)}%
                  {passProbability >= 80 ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                  ) : passProbability >= 60 ? (
                    <TrendingUp className="h-4 w-4 text-amber-500 ml-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                  )}
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-accent/10 rounded-lg border border-accent/20"
            >
              <h4 className="font-medium">Your Pass Strategy</h4>
              <p className="text-sm mt-2">
                With your current settings, aim for <span className="font-semibold">{requiredWins} wins</span> in your next {Math.ceil(tradesNeeded)} trades.
                That's about <span className="font-semibold">{dailyTrades} trades per day</span> to stay on track.
              </p>
            </motion.div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Progress to Pass</span>
                <span className="font-medium">Target: {passProbability.toFixed(0)}% probability</span>
              </div>
              <Progress value={passProbability} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>High Risk</span>
                <span>Low Risk</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
