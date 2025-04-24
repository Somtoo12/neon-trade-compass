
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Brain } from "lucide-react";

interface CandlePattern {
  name: string;
  image: string;
  description: string;
}

const candlePatterns: CandlePattern[] = [
  { 
    name: "Doji", 
    image: "🕯️", 
    description: "Signals market indecision, equal opening and closing prices" 
  },
  { 
    name: "Hammer", 
    image: "🔨", 
    description: "Bullish reversal pattern after a downtrend" 
  },
  { 
    name: "Shooting Star", 
    image: "⭐", 
    description: "Bearish reversal pattern after an uptrend" 
  },
  { 
    name: "Bullish Engulfing", 
    image: "🟩", 
    description: "Bullish reversal pattern where current candle engulfs previous" 
  },
  { 
    name: "Bearish Engulfing", 
    image: "🟥", 
    description: "Bearish reversal pattern where current candle engulfs previous" 
  },
  { 
    name: "Morning Star", 
    image: "🌟", 
    description: "Bullish reversal pattern consisting of three candles" 
  },
  { 
    name: "Evening Star", 
    image: "🌠", 
    description: "Bearish reversal pattern consisting of three candles" 
  },
  { 
    name: "Harami", 
    image: "🔄", 
    description: "Reversal pattern where second candle is contained within first" 
  }
];

const ROUND_TIME = 5; // seconds
const MAX_ROUNDS = 10;

interface GameState {
  isPlaying: boolean;
  currentRound: number;
  score: number;
  streak: number;
  bestStreak: number;
  currentPattern: CandlePattern | null;
  options: CandlePattern[];
  timeLeft: number;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  showResults: boolean;
  correctAnswer: boolean | null;
}

const CandleMemoryGame: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentRound: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentPattern: null,
    options: [],
    timeLeft: ROUND_TIME,
    difficulty: 'beginner',
    showResults: false,
    correctAnswer: null
  });

  // Load best streak from localStorage
  useEffect(() => {
    const savedBestStreak = localStorage.getItem('candleGameBestStreak');
    if (savedBestStreak) {
      setGameState(prev => ({ ...prev, bestStreak: parseInt(savedBestStreak, 10) }));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timerId = window.setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            handleTimeout();
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      currentRound: 1,
      score: 0,
      streak: 0,
      bestStreak: gameState.bestStreak,
      currentPattern: null,
      options: [],
      timeLeft: ROUND_TIME,
      difficulty: gameState.difficulty,
      showResults: false,
      correctAnswer: null
    });
    
    nextRound();
  };

  const nextRound = () => {
    if (gameState.currentRound >= MAX_ROUNDS) {
      endGame();
      return;
    }
    
    // Select a random pattern
    const randomIndex = Math.floor(Math.random() * candlePatterns.length);
    const currentPattern = candlePatterns[randomIndex];
    
    // Create options (including the correct one)
    let options = [currentPattern];
    
    // Add random incorrect options
    while (options.length < 4) {
      const optionIndex = Math.floor(Math.random() * candlePatterns.length);
      const option = candlePatterns[optionIndex];
      
      if (!options.some(p => p.name === option.name)) {
        options.push(option);
      }
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      currentPattern,
      options,
      timeLeft: ROUND_TIME,
      showResults: false,
      correctAnswer: null
    }));
  };

  const handleTimeout = () => {
    setGameState(prev => ({
      ...prev,
      showResults: true,
      correctAnswer: false
    }));
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        streak: 0
      }));
      nextRound();
    }, 1500);
  };

  const handleAnswer = (pattern: CandlePattern) => {
    const isCorrect = pattern.name === gameState.currentPattern?.name;
    
    setGameState(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newScore = isCorrect ? prev.score + (100 * newStreak) : prev.score;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      
      // Save best streak to localStorage
      if (newBestStreak > prev.bestStreak) {
        localStorage.setItem('candleGameBestStreak', newBestStreak.toString());
      }
      
      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        showResults: true,
        correctAnswer: isCorrect
      };
    });
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `${pattern.name}: ${pattern.description}`,
      });
    } else {
      toast({
        title: "Wrong!",
        description: `The correct answer was: ${gameState.currentPattern?.name}`,
        variant: "destructive"
      });
    }
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1
      }));
      nextRound();
    }, 1500);
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      showResults: true
    }));
    
    toast({
      title: "Game Over!",
      description: `Final Score: ${gameState.score} | Best Streak: ${gameState.bestStreak}`,
    });
  };

  const setDifficulty = (difficulty: 'beginner' | 'intermediate' | 'pro') => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  return (
    <div className="space-y-4">
      {!gameState.isPlaying ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Candle Memory Game</h3>
              <p className="text-sm text-muted-foreground">Test your pattern recognition skills</p>
            </div>
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm mb-2">Best Streak: <span className="font-bold">{gameState.bestStreak}</span></p>
            <p className="text-sm">Identify candle patterns before time runs out!</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm mb-2">Choose difficulty:</p>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'pro'] as const).map((diff) => (
                  <Button
                    key={diff}
                    variant={gameState.difficulty === diff ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="text-sm">Round {gameState.currentRound}/{MAX_ROUNDS}</div>
              <div className="text-sm">Score: {gameState.score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Streak: {gameState.streak}</div>
              <div className="text-sm">Time: <span className="font-bold">{gameState.timeLeft}s</span></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            {gameState.currentPattern && (
              <>
                <div className="text-6xl mb-4">{gameState.currentPattern.image}</div>
                <div className="text-xl font-bold">Identify this pattern</div>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {gameState.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-auto py-3 ${
                  gameState.showResults
                    ? option.name === gameState.currentPattern?.name
                      ? "bg-green-500/20 border-green-500"
                      : "bg-red-500/10"
                    : ""
                }`}
                onClick={() => handleAnswer(option)}
                disabled={gameState.showResults}
              >
                {option.name}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={endGame}
            >
              End Game
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandleMemoryGame;
