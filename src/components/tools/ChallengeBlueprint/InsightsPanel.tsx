
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Quote, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const mentalHacks = [
  "Trade the plan, not the P&L. Focus on executing your strategy perfectly.",
  "Start each day with a mental rehearsal of executing perfect trades.",
  "Take a 10-minute break after every losing trade to reset your mindset.",
  "Use timeboxing to limit your exposure during volatile market conditions.",
  "Practice deep breathing before entering trades to maintain emotional control.",
  "Keep a trading journal focused on your process, not just outcomes.",
  "Set a clear daily stop-loss amount and honor it without exception.",
  "Only trade during your historically profitable market hours.",
];

const tacticalTips = [
  "Focus on fewer, higher-quality trades rather than trading volume.",
  "Reduce position size by 30% after a losing streak of 3 trades.",
  "Scale into positions with 50% initial capital then add as the trade proves itself.",
  "When in drawdown, trade at 50% of your normal risk until you regain confidence.",
  "Remove problematic pairs/symbols from your trading plan during challenging periods.",
  "After reaching 75% of your profit target, reduce risk per trade by half.",
  "Use time stops to exit trades that haven't performed within your expected timeframe.",
  "Implement a 'rule of three' – wait for three confirming signals before entering.",
];

const motivationalQuotes = [
  "The challenge isn't in the market, it's in your mind. - Mark Douglas",
  "Amateur traders focus on making money. Professional traders focus on protecting it.",
  "Winners take small losses early; losers hope things will change.",
  "The market is a device for transferring money from the impatient to the patient. - Warren Buffett",
  "Great traders aren't great because they win. They're great because they manage losing trades well.",
  "Your edge is not your trading strategy. Your edge is your ability to execute that strategy.",
  "To become a better trader, trade better, not more.",
  "Discipline is doing what you know needs to be done, even when you don't want to do it.",
];

const InsightsPanel: React.FC = () => {
  const [currentHack, setCurrentHack] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Rotate insights every 24 hours or on first load
  useEffect(() => {
    const randomHack = Math.floor(Math.random() * mentalHacks.length);
    const randomTip = Math.floor(Math.random() * tacticalTips.length);
    const randomQuote = Math.floor(Math.random() * motivationalQuotes.length);
    
    setCurrentHack(randomHack);
    setCurrentTip(randomTip);
    setCurrentQuote(randomQuote);
  }, []);
  
  const nextHack = () => {
    setCurrentHack((prev) => (prev + 1) % mentalHacks.length);
  };
  
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tacticalTips.length);
  };
  
  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
  };
  
  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-4">Daily Insights</h3>
        
        <div className="space-y-4">
          {/* Mental Hack */}
          <motion.div 
            key={`hack-${currentHack}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1 text-neon-blue" />
                Mental Hack
              </div>
              <button 
                onClick={nextHack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm mt-1">
              {mentalHacks[currentHack]}
            </div>
          </motion.div>
          
          {/* Tactical Tip */}
          <motion.div 
            key={`tip-${currentTip}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center">
                <span className="text-neon-green mr-1">🎯</span>
                Tactical Tip
              </div>
              <button 
                onClick={nextTip}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm mt-1">
              {tacticalTips[currentTip]}
            </div>
          </motion.div>
          
          {/* Motivational Quote */}
          <motion.div 
            key={`quote-${currentQuote}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center">
                <Quote className="h-4 w-4 mr-1 text-neon-purple" />
                Today's Quote
              </div>
              <button 
                onClick={nextQuote}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm mt-1 italic">
              "{motivationalQuotes[currentQuote]}"
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
