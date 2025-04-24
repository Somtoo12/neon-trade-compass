
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GameState {
  isPlaying: boolean;
  currentSession: string;
  score: number;
  misses: number;
  timeLeft: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reactionTimes: number[];
}

const SESSIONS = [
  { name: 'Asia', isKillZone: false },
  { name: 'London Open', isKillZone: true },
  { name: 'London Session', isKillZone: false },
  { name: 'NY Open', isKillZone: true },
  { name: 'London/NY Overlap', isKillZone: true },
  { name: 'NY Close', isKillZone: false },
];

const DIFFICULTIES = {
  easy: { speed: 1500, points: 1 },
  medium: { speed: 1000, points: 2 },
  hard: { speed: 700, points: 3 },
};

const KillZoneReflex: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentSession: SESSIONS[0].name,
    score: 0,
    misses: 0,
    timeLeft: 30,
    difficulty: 'medium',
    reactionTimes: [],
  });
  
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('killZoneReflexBestScore') || '0');
  });
  
  const [lastFiveReactions, setLastFiveReactions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('killZoneReflexReactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const sessionInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<number>(0);

  // Initialize or load gameState from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('killZoneReflexState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(prev => ({ ...prev, difficulty: parsed.difficulty }));
      } catch (e) {
        console.error("Failed to parse saved game state");
      }
    }
  }, []);

  // Save game state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('killZoneReflexState', JSON.stringify({
      difficulty: gameState.difficulty
    }));
  }, [gameState.difficulty]);

  // Save best score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('killZoneReflexBestScore', bestScore.toString());
  }, [bestScore]);

  // Save last five reactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('killZoneReflexReactions', JSON.stringify(lastFiveReactions));
  }, [lastFiveReactions]);

  const startGame = () => {
    stopGame();
    
    setGameState({
      isPlaying: true,
      currentSession: SESSIONS[0].name,
      score: 0,
      misses: 0,
      timeLeft: 30,
      difficulty: gameState.difficulty,
      reactionTimes: [],
    });
    
    // Start session rotation
    rotateSessions();
    
    // Start countdown timer
    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          endGame();
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    toast({
      title: "Game Started!",
      description: "Tap only during London Open, NY Open, or Overlap sessions.",
    });
  };
  
  const rotateSessions = () => {
    let currentIndex = 0;
    
    const rotateSession = () => {
      currentIndex = (currentIndex + 1) % SESSIONS.length;
      sessionStartTime.current = Date.now();
      
      setGameState(prev => ({
        ...prev,
        currentSession: SESSIONS[currentIndex].name
      }));
    };
    
    // Immediately set first session
    sessionStartTime.current = Date.now();
    
    // Set up interval for session rotation
    const speed = DIFFICULTIES[gameState.difficulty].speed;
    sessionInterval.current = setInterval(rotateSession, speed);
  };
  
  const stopGame = () => {
    if (sessionInterval.current) {
      clearInterval(sessionInterval.current);
      sessionInterval.current = null;
    }
    
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };
  
  const endGame = () => {
    stopGame();
    
    const finalScore = gameState.score;
    
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      toast({
        title: "New High Score!",
        description: `You scored ${finalScore} points!`,
      });
    }
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
    }));
    
    // Save last 5 reaction times
    if (gameState.reactionTimes.length > 0) {
      setLastFiveReactions(prev => {
        const combined = [...gameState.reactionTimes, ...prev].slice(0, 5);
        return combined;
      });
    }
  };

  const handleTap = () => {
    if (!gameState.isPlaying) return;
    
    const currentSession = SESSIONS.find(session => session.name === gameState.currentSession);
    if (!currentSession) return;
    
    const reactionTime = Date.now() - sessionStartTime.current;
    
    if (currentSession.isKillZone) {
      // Correct tap during kill zone
      const points = DIFFICULTIES[gameState.difficulty].points;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        reactionTimes: [...prev.reactionTimes, reactionTime]
      }));
      
      toast({
        title: "Good!",
        description: `+${points} Points`,
      });
    } else {
      // Incorrect tap outside kill zone
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 1),
        misses: prev.misses + 1
      }));
      
      toast({
        title: "Miss!",
        description: "Not a Kill Zone session. -1 Point",
        variant: "destructive"
      });
    }
  };
  
  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({ ...prev, difficulty }));
  };
  
  const missRate = gameState.misses + gameState.score > 0
    ? ((gameState.misses / (gameState.misses + gameState.score)) * 100).toFixed(1)
    : "0.0";
    
  const avgReactionTime = lastFiveReactions.length > 0
    ? (lastFiveReactions.reduce((sum, time) => sum + time, 0) / lastFiveReactions.length).toFixed(0)
    : "N/A";

  const getCurrentSessionColor = () => {
    const currentSession = SESSIONS.find(session => session.name === gameState.currentSession);
    return currentSession?.isKillZone ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="relative h-10 w-full rounded-md overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-semibold text-white z-10">
              {gameState.currentSession}
            </span>
          </div>
          <div className={`absolute inset-0 ${getCurrentSessionColor()} opacity-80`}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Score</p>
            <h3 className="text-2xl font-bold">{gameState.score}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Time Left</p>
            <h3 className="text-2xl font-bold">{gameState.timeLeft}s</h3>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Misses: {gameState.misses}</span>
          <span>High Score: {bestScore}</span>
        </div>
      </div>
      
      <div className="pt-2">
        {gameState.isPlaying ? (
          <Button 
            variant="default" 
            size="lg" 
            className="w-full py-8 text-xl"
            onClick={handleTap}
          >
            TAP WHEN KILL ZONE
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={startGame}
            >
              <Zap className="mr-2" />
              Start Game
            </Button>
            
            <div className="flex gap-2 justify-between">
              <Button 
                variant={gameState.difficulty === 'easy' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => changeDifficulty('easy')}
              >
                Easy
              </Button>
              <Button 
                variant={gameState.difficulty === 'medium' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => changeDifficulty('medium')}
              >
                Medium
              </Button>
              <Button 
                variant={gameState.difficulty === 'hard' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => changeDifficulty('hard')}
              >
                Hard
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="performance">
          <AccordionTrigger>Performance Stats</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Best Score</span>
                    <span className="font-bold">{bestScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Miss Rate</span>
                    <span className="font-bold">{missRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Avg. Reaction Time</span>
                    <span className="font-bold">{avgReactionTime} ms</span>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-1">Last 5 Reaction Times (ms)</h4>
                    <div className="flex gap-1">
                      {lastFiveReactions.length > 0 ? (
                        lastFiveReactions.map((time, i) => (
                          <div 
                            key={i} 
                            className="flex-1 text-center p-1 bg-secondary rounded text-xs"
                          >
                            {time}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No data yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default KillZoneReflex;
