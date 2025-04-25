
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-24 right-6 z-50 max-w-xs"
    >
      <Card className="border border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Info className="h-5 w-5 text-accent" />
            <h3>How It Works</h3>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              The Challenge Blueprint helps you design a winning prop firm challenge strategy in 4 steps:
            </p>
            
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li><span className="font-medium text-foreground">Trader Profile:</span> Input your trading style and account details</li>
              <li><span className="font-medium text-foreground">Strategy Blueprint:</span> Get customized metrics and risk analysis</li>
              <li><span className="font-medium text-foreground">Adaptive Simulator:</span> Test your strategy with real-time feedback</li>
              <li><span className="font-medium text-foreground">Export & Review:</span> Save your plan and track progress</li>
            </ol>
            
            <p className="mt-3 text-xs">
              Use the risk style selector to fine-tune your approach and the goal calculator to set realistic targets.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InfoCard;
