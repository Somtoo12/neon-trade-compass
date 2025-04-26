
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
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
  const createBinaryBlocks = (total: number, completed: number) => {
    return Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`binary-block ${i < completed ? 'binary-block-active' : 'binary-block-inactive'}`}
      >
        {i < completed ? '✓' : ''}
      </div>
    ));
  };

  return (
    <Card className="holographic-panel overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center p-4"
          >
            <Loader2 className="h-6 w-6 animate-spin text-neon-cyan" />
            <span className="ml-2 text-neon-cyan">Calculating strategy...</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col space-y-4">
              <h2 className="cyber-text text-2xl tracking-wider">
                CHALLENGE BLUEPRINT // TERMINAL v2050
              </h2>
              
              <div className="flex items-center space-x-2 text-neon-cyan">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Strategy Overview</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="holographic-panel p-4">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="mt-2 flex space-x-2">
                  {createBinaryBlocks(winsNeeded, Math.floor(winsNeeded * passProbability / 100))}
                </div>
                <div className="mt-2 text-sm text-neon-cyan">
                  {Math.floor(winsNeeded * passProbability / 100)}/{winsNeeded} wins completed
                </div>
              </div>

              <div className="holographic-panel p-4">
                <div className="text-sm text-muted-foreground">Daily Target</div>
                <div className="text-xl font-semibold text-neon-cyan mt-1">
                  {dailyTrades} trades/day
                </div>
              </div>
            </div>

            <div className="holographic-panel p-4">
              <div className="text-sm text-muted-foreground mb-2">Strategy Status</div>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span>Required Wins:</span>
                  <span className="text-neon-cyan">{winsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Trades:</span>
                  <span className="text-neon-cyan">{tradesNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="text-neon-cyan">{passProbability}%</span>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="text-sm font-medium text-destructive">Risk Warning</div>
              <p className="text-sm mt-1 text-muted-foreground">
                You need {winsNeeded} winning trades out of {tradesNeeded} total trades. Current probability of success: {passProbability}%.
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
