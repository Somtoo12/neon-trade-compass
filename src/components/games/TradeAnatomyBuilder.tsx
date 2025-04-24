import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TradeSetup {
  structure: 'trending' | 'ranging';
  session: 'asia' | 'london' | 'ny';
  entry: 'breakout' | 'pullback' | 'fakeout';
  pattern: 'doji' | 'engulfing' | 'pin';
  risk: 1 | 2 | 3 | 4 | 5;
}

interface SavedSetup extends TradeSetup {
  result: 'win' | 'loss';
  date: string;
}

interface WeeklyPerformance {
  wins: number;
  losses: number;
  mostUsedEntry: string;
  avgRisk: number;
}

// Define winning combinations
const winningCombinations = [
  // Trending market setups
  { structure: 'trending', session: 'london', entry: 'pullback', pattern: 'engulfing' },
  { structure: 'trending', session: 'ny', entry: 'pullback', pattern: 'pin' },
  { structure: 'trending', session: 'london', entry: 'breakout', pattern: 'engulfing' },
  { structure: 'trending', session: 'ny', entry: 'breakout', pattern: 'engulfing' },
  
  // Ranging market setups
  { structure: 'ranging', session: 'asia', entry: 'fakeout', pattern: 'doji' },
  { structure: 'ranging', session: 'london', entry: 'fakeout', pattern: 'pin' },
  { structure: 'ranging', session: 'asia', entry: 'pullback', pattern: 'pin' },
];

const TradeAnatomyBuilder: React.FC = () => {
  const { toast } = useToast();
  const [currentSetup, setCurrentSetup] = useState<TradeSetup>({
    structure: 'trending',
    session: 'london',
    entry: 'pullback',
    pattern: 'engulfing',
    risk: 2,
  });
  
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>(() => {
    const saved = localStorage.getItem('tradeBuilderSetups');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weeklyPerformance, setWeeklyPerformance] = useState<WeeklyPerformance>(() => {
    const saved = localStorage.getItem('tradeBuilderWeekly');
    return saved ? JSON.parse(saved) : {
      wins: 0,
      losses: 0,
      mostUsedEntry: '',
      avgRisk: 0,
    };
  });
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tradeBuilderSetups', JSON.stringify(savedSetups));
  }, [savedSetups]);
  
  useEffect(() => {
    localStorage.setItem('tradeBuilderWeekly', JSON.stringify(weeklyPerformance));
  }, [weeklyPerformance]);

  const evaluateSetup = () => {
    // Check if the current setup matches any winning combination
    const isWinning = winningCombinations.some(combo => 
      combo.structure === currentSetup.structure &&
      combo.session === currentSetup.session &&
      combo.entry === currentSetup.entry &&
      combo.pattern === currentSetup.pattern
    );
    
    const result = isWinning ? 'win' : 'loss';
    
    // Create new saved setup
    const newSetup: SavedSetup = {
      ...currentSetup,
      result,
      date: new Date().toISOString(),
    };
    
    // Update saved setups (keep only last 5)
    setSavedSetups(prev => {
      const updated = [newSetup, ...prev];
      return updated.slice(0, 5);
    });
    
    // Update weekly performance
    setWeeklyPerformance(prev => {
      // Count entries
      const entryCounts: Record<string, number> = {};
      [...savedSetups, newSetup].forEach(setup => {
        entryCounts[setup.entry] = (entryCounts[setup.entry] || 0) + 1;
      });
      
      // Find most used entry
      let mostUsedEntry = prev.mostUsedEntry;
      let maxCount = 0;
      Object.entries(entryCounts).forEach(([entry, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostUsedEntry = entry;
        }
      });
      
      // Calculate average risk
      const totalRisk = [...savedSetups, newSetup].reduce((sum, setup) => sum + setup.risk, 0);
      const avgRisk = totalRisk / ([...savedSetups, newSetup].length);
      
      return {
        wins: prev.wins + (result === 'win' ? 1 : 0),
        losses: prev.losses + (result === 'loss' ? 1 : 0),
        mostUsedEntry,
        avgRisk,
      };
    });
    
    // Show toast with result
    toast({
      title: result === 'win' ? "Trade Won! 📈" : "Trade Lost 📉",
      description: getResultExplanation(currentSetup, result),
    });
  };
  
  const getResultExplanation = (setup: TradeSetup, result: 'win' | 'loss'): string => {
    if (result === 'win') {
      return `${setup.entry} entry on ${setup.pattern} pattern in ${setup.session} session was profitable!`;
    } else {
      return `This combination of factors didn't align with market conditions.`;
    }
  };
  
  const handleReset = () => {
    setCurrentSetup({
      structure: 'trending',
      session: 'london',
      entry: 'pullback',
      pattern: 'engulfing',
      risk: 2,
    });
  };
  
  const handleResetHistory = () => {
    if (confirm("Are you sure you want to reset all your trade history?")) {
      setSavedSetups([]);
      setWeeklyPerformance({
        wins: 0,
        losses: 0,
        mostUsedEntry: '',
        avgRisk: 0,
      });
      toast({
        title: "History Reset",
        description: "All trade history has been cleared.",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const winRate = (weeklyPerformance.wins + weeklyPerformance.losses) > 0 
    ? ((weeklyPerformance.wins / (weeklyPerformance.wins + weeklyPerformance.losses)) * 100).toFixed(1)
    : "0.0";
  
  const formatOption = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Trade Anatomy Builder</h3>
          <p className="text-xs text-muted-foreground">Build your perfect trade setup</p>
        </div>
        <ChartLine className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* Market Structure */}
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Market Structure</p>
            <div className="flex gap-2">
              <Button
                variant={currentSetup.structure === 'trending' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, structure: 'trending' }))}
              >
                Trending
              </Button>
              <Button
                variant={currentSetup.structure === 'ranging' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, structure: 'ranging' }))}
              >
                Ranging
              </Button>
            </div>
          </div>
          
          {/* Session */}
          <div className="space-y-2">
            <p className="text-sm font-medium">2. Trading Session</p>
            <div className="flex gap-2">
              <Button
                variant={currentSetup.session === 'asia' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, session: 'asia' }))}
              >
                Asia
              </Button>
              <Button
                variant={currentSetup.session === 'london' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, session: 'london' }))}
              >
                London
              </Button>
              <Button
                variant={currentSetup.session === 'ny' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, session: 'ny' }))}
              >
                NY
              </Button>
            </div>
          </div>
          
          {/* Entry Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium">3. Entry Type</p>
            <div className="flex gap-2">
              <Button
                variant={currentSetup.entry === 'breakout' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, entry: 'breakout' }))}
              >
                Breakout
              </Button>
              <Button
                variant={currentSetup.entry === 'pullback' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, entry: 'pullback' }))}
              >
                Pullback
              </Button>
              <Button
                variant={currentSetup.entry === 'fakeout' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, entry: 'fakeout' }))}
              >
                Fakeout
              </Button>
            </div>
          </div>
          
          {/* Candle Pattern */}
          <div className="space-y-2">
            <p className="text-sm font-medium">4. Candle Pattern</p>
            <div className="flex gap-2">
              <Button
                variant={currentSetup.pattern === 'doji' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, pattern: 'doji' }))}
              >
                Doji
              </Button>
              <Button
                variant={currentSetup.pattern === 'engulfing' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, pattern: 'engulfing' }))}
              >
                Engulfing
              </Button>
              <Button
                variant={currentSetup.pattern === 'pin' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setCurrentSetup(prev => ({ ...prev, pattern: 'pin' }))}
              >
                Pin Bar
              </Button>
            </div>
          </div>
          
          {/* Risk Size */}
          <div className="space-y-2">
            <p className="text-sm font-medium">5. Risk Size: {currentSetup.risk}%</p>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as const).map(risk => (
                <Button
                  key={risk}
                  variant={currentSetup.risk === risk ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setCurrentSetup(prev => ({ ...prev, risk }))}
                >
                  {risk}%
                </Button>
              ))}
            </div>
          </div>
          
          <div className="pt-2 flex gap-2">
            <Button
              onClick={evaluateSetup}
              className="flex-1"
            >
              Test Setup
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {savedSetups.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="history">
            <AccordionTrigger>Trade History</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {savedSetups.map((setup, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md border ${
                      setup.result === 'win' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-xs rounded-full px-2 py-0.5 ${
                          setup.result === 'win' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {setup.result.toUpperCase()}
                        </span>
                        <p className="text-sm mt-1">
                          {formatOption(setup.structure)} • {formatOption(setup.entry)} • {formatOption(setup.pattern)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatOption(setup.session)} session • {setup.risk}% risk
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(setup.date)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetHistory}
                  className="w-full mt-2 text-muted-foreground"
                >
                  Reset History
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="performance">
            <AccordionTrigger>Weekly Performance</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-2 pt-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Win Rate</span>
                    <span className="font-bold">{winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">W/L Ratio</span>
                    <span className="font-bold">
                      {weeklyPerformance.wins} W / {weeklyPerformance.losses} L
                    </span>
                  </div>
                  {weeklyPerformance.mostUsedEntry && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Favorite Entry</span>
                      <span className="font-bold">{formatOption(weeklyPerformance.mostUsedEntry)}</span>
                    </div>
                  )}
                  {weeklyPerformance.avgRisk > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Avg Risk Size</span>
                      <span className="font-bold">{weeklyPerformance.avgRisk.toFixed(1)}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default TradeAnatomyBuilder;
