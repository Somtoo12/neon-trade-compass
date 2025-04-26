
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Calculator, TrendingUp } from "lucide-react";

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
  // Determine badge status
  const getBadgeColor = () => {
    if (passProbability >= 85) return "bg-green-500/20 border-green-500/30 text-green-600";
    if (passProbability >= 60) return "bg-yellow-500/20 border-yellow-500/30 text-yellow-600";
    return "bg-red-500/20 border-red-500/30 text-red-600";
  };
  
  const getIcon = () => {
    if (passProbability >= 85) return <CheckCircle className="h-5 w-5" />;
    if (passProbability >= 60) return <TrendingUp className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-accent" />
          Pass Strategy Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Calculating...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className={`p-1.5 rounded-full mr-3 ${getBadgeColor()}`}>
                {getIcon()}
              </div>
              <div>
                <div className="font-medium">
                  {passProbability}% Probability of Success
                </div>
                <div className="text-muted-foreground text-sm">
                  Based on binomial probability distribution
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Winning Trades Required</div>
                <div className="text-2xl font-semibold">{winsNeeded}</div>
              </div>
              
              <div className="p-3 border border-border/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Trades Needed</div>
                <div className="text-2xl font-semibold">{tradesNeeded}</div>
              </div>
            </div>
            
            <div className="p-3 border border-border/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Trading Frequency</div>
              <div className="text-xl font-semibold">{dailyTrades} trades/day</div>
            </div>
            
            <div className="p-3 bg-accent/10 rounded-lg text-sm">
              <p>You need <span className="font-medium">{winsNeeded} winning trades</span> out of approximately {tradesNeeded} total trades. With your win rate, this gives you a {passProbability}% chance of success.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
