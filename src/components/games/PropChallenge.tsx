
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Sword } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  balance: number;
  dailyRisk: number;
  currentDay: number;
  isGameOver: boolean;
  hasWon: boolean;
  history: number[];
}

const INITIAL_BALANCE = 100000;
const WIN_TARGET = INITIAL_BALANCE * 1.10; // 10% profit target
const MAX_DRAWDOWN = INITIAL_BALANCE * 0.08; // 8% max drawdown

const PropChallenge: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    balance: INITIAL_BALANCE,
    dailyRisk: 2,
    currentDay: 1,
    isGameOver: false,
    hasWon: false,
    history: [INITIAL_BALANCE],
  });
  
  const [highScore, setHighScore] = useState<number>(() => {
    return parseFloat(localStorage.getItem('propChallengeHighScore') || '0');
  });

  const simulateTrade = () => {
    const riskAmount = gameState.balance * (gameState.dailyRisk / 100);
    const volatility = 1 + (gameState.dailyRisk / 100);
    const winChance = Math.random();
    let pnl = 0;

    if (winChance > 0.45) { // 55% win rate
      pnl = riskAmount * (1 + Math.random() * volatility);
    } else {
      pnl = -riskAmount * (0.8 + Math.random() * 0.4);
    }

    const newBalance = gameState.balance + pnl;
    const drawdown = INITIAL_BALANCE - newBalance;
    
    // Check win/loss conditions
    const hasWon = newBalance >= WIN_TARGET;
    const hasLost = drawdown >= MAX_DRAWDOWN || newBalance <= INITIAL_BALANCE * 0.92;

    if (Math.random() > 0.8) {
      const events = [
        "FOMC minutes released — volatility increasing!",
        "Major bank earnings ahead — stay cautious!",
        "NFP tomorrow — risk levels elevated!",
        "CPI data incoming — markets uncertain!"
      ];
      toast({
        title: "Market Event!",
        description: events[Math.floor(Math.random() * events.length)],
      });
    }

    setGameState(prev => ({
      ...prev,
      balance: newBalance,
      currentDay: prev.currentDay + 1,
      isGameOver: hasWon || hasLost,
      hasWon,
      history: [...prev.history, newBalance],
    }));

    if (hasWon || hasLost) {
      const finalReturn = ((newBalance - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;
      if (finalReturn > highScore) {
        setHighScore(finalReturn);
        localStorage.setItem('propChallengeHighScore', finalReturn.toString());
      }
    }
  };

  const skipDay = () => {
    setGameState(prev => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      history: [...prev.history, prev.balance],
    }));
  };

  const resetGame = () => {
    setGameState({
      balance: INITIAL_BALANCE,
      dailyRisk: 2,
      currentDay: 1,
      isGameOver: false,
      hasWon: false,
      history: [INITIAL_BALANCE],
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const currentReturn = ((gameState.balance - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Account Balance</p>
          <h3 className={`text-2xl font-bold ${
            gameState.balance > INITIAL_BALANCE ? 'text-green-500' : 
            gameState.balance < INITIAL_BALANCE ? 'text-red-500' : ''
          }`}>
            {formatCurrency(gameState.balance)}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Day {gameState.currentDay}</p>
          <p className="text-sm text-muted-foreground">
            Best: {highScore.toFixed(2)}%
          </p>
        </div>
      </div>

      <Progress 
        value={(currentReturn / 10) * 100} 
        className="h-2"
        indicatorClassName={currentReturn >= 0 ? "bg-green-500" : "bg-red-500"}
      />

      {!gameState.isGameOver ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={simulateTrade}
            >
              Trade
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={skipDay}
            >
              Skip Day
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Daily Risk:</span>
            {[1, 2, 3, 4, 5].map((risk) => (
              <Button
                key={risk}
                variant={gameState.dailyRisk === risk ? "default" : "outline"}
                size="sm"
                onClick={() => setGameState(prev => ({ ...prev, dailyRisk: risk }))}
              >
                {risk}%
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">
            {gameState.hasWon 
              ? "🎉 Congratulations! You passed the challenge!" 
              : "💔 Challenge failed. Try a different strategy!"}
          </p>
          <Button onClick={resetGame} className="w-full">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropChallenge;
