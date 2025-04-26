
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Calculator, TrendingUp } from "lucide-react";
import { motion } from 'framer-motion';

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
  
  // Loading states for calculations
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#00FEFC]" />
      <motion.span 
        className="text-sm font-medium text-[#00FEFC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Calculating optimal pass strategy...
      </motion.span>
      <div className="w-full h-1 bg-[#0F1A2A] overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-[#00FEFC]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
  
  // Render result data
  const renderResults = () => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <div className={`p-1.5 rounded-full mr-3 border ${getBadgeColor()}`}>
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
        <div className="p-3 border border-[#00FEFC]/20 rounded-lg bg-[#00FEFC]/5 backdrop-blur-md">
          <div className="text-sm text-[#8A9CB0]">Winning Trades Required</div>
          <div className="text-2xl font-semibold text-white">{winsNeeded}</div>
        </div>
        
        <div className="p-3 border border-[#00FEFC]/20 rounded-lg bg-[#00FEFC]/5 backdrop-blur-md">
          <div className="text-sm text-[#8A9CB0]">Total Trades Needed</div>
          <div className="text-2xl font-semibold text-white">{tradesNeeded}</div>
        </div>
      </div>
      
      <div className="p-3 border border-[#00FEFC]/20 rounded-lg bg-[#00FEFC]/5 backdrop-blur-md">
        <div className="text-sm text-[#8A9CB0]">Trading Frequency</div>
        <div className="text-xl font-semibold text-white">{dailyTrades} trades/day</div>
      </div>
      
      <div className="p-3 bg-[#0F1A2A] border border-[#00FEFC]/30 rounded-lg text-sm text-white">
        <p>You need <span className="font-medium text-[#00FEFC]">{winsNeeded} winning trades</span> out of approximately {tradesNeeded} total trades. With your win rate, this gives you a {passProbability}% chance of success.</p>
      </div>
    </motion.div>
  );

  return (
    <Card className="border border-[#00FEFC]/20 shadow-lg bg-[#0F1A2A]/80 backdrop-blur-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center text-[#00FEFC] font-['Space_Grotesk',sans-serif]">
          <Calculator className="h-5 w-5 mr-2 text-[#00FEFC]" />
          Pass Strategy Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? renderLoading() : renderResults()}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
