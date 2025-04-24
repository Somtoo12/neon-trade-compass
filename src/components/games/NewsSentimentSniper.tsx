
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface NewsItem {
  headline: string;
  subtext: string;
  correctAnswer: 'buy' | 'sell' | 'stay';
  explanation: string;
  category: 'inflation' | 'employment' | 'growth' | 'central-bank' | 'political';
}

interface GameState {
  isPlaying: boolean;
  currentRound: number;
  totalRounds: number;
  score: number;
  timeLeft: number;
  answers: Array<{
    isCorrect: boolean;
    reactionTime: number;
    category: string;
  }>;
  currentNews?: NewsItem;
}

interface GameStats {
  bestScore: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalAnswered: number;
  averageTime: number;
  weakestCategory: string;
}

// Define news items database
const NEWS_ITEMS: NewsItem[] = [
  {
    headline: "US CPI jumps 0.7% MoM. Core beats forecast.",
    subtext: "Inflation higher than expected across all categories",
    correctAnswer: 'buy',
    explanation: "Higher inflation typically leads to expectations of Fed rate hikes, strengthening USD",
    category: 'inflation'
  },
  {
    headline: "Fed holds rates, signals more patience on cuts",
    subtext: "Powell: 'Need more confidence inflation is sustainably moving toward 2%'",
    correctAnswer: 'buy',
    explanation: "Hawkish Fed stance maintains higher rates for longer, supporting USD",
    category: 'central-bank'
  },
  {
    headline: "US Unemployment rises to 4.1%, wage growth slows",
    subtext: "Job additions below consensus at 120K vs 180K expected",
    correctAnswer: 'sell',
    explanation: "Weakening labor market suggests Fed might cut rates sooner, weakening USD",
    category: 'employment'
  },
  {
    headline: "ECB cuts rates by 25bps, signals further easing",
    subtext: "Lagarde: 'Economic data warrants accommodative stance'",
    correctAnswer: 'buy',
    explanation: "Rate differential widens as ECB cuts while Fed holds, strengthening USD against EUR",
    category: 'central-bank'
  },
  {
    headline: "US Retail Sales drop 0.8%, consumer sentiment dims",
    subtext: "Third consecutive month of declining consumer spending",
    correctAnswer: 'sell',
    explanation: "Weak consumer activity signals economic slowdown, bearish for USD",
    category: 'growth'
  },
  {
    headline: "China GDP growth beats expectations at 5.3%",
    subtext: "Industrial production surges as exports recover",
    correctAnswer: 'stay',
    explanation: "Strong Chinese growth typically supports global risk sentiment but impact on USD isn't direct",
    category: 'growth'
  },
  {
    headline: "US-China announce new trade talks, tariff pause",
    subtext: "Officials signal potential resolution to trade tensions",
    correctAnswer: 'sell',
    explanation: "Reduction in trade tensions improves risk sentiment, typically negative for safe-haven USD",
    category: 'political'
  },
  {
    headline: "BoJ surprises with 15bp rate hike, yen surges",
    subtext: "First rate increase since 2007 amid inflation concerns",
    correctAnswer: 'sell',
    explanation: "JPY strengthens against USD as interest rate differential narrows",
    category: 'central-bank'
  },
  {
    headline: "US Manufacturing PMI contracts to 48.2",
    subtext: "New orders component hits 18-month low",
    correctAnswer: 'sell',
    explanation: "Manufacturing contraction signals economic weakness, negative for USD",
    category: 'growth'
  },
  {
    headline: "Middle East tensions escalate, oil jumps 4%",
    subtext: "Supply disruption fears grip energy markets",
    correctAnswer: 'buy',
    explanation: "Geopolitical tensions often drive safe-haven flows to USD",
    category: 'political'
  }
];

const NewsSentimentSniper: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentRound: 0,
    totalRounds: 5,
    score: 0,
    timeLeft: 10,
    answers: [],
    currentNews: undefined,
  });
  
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const savedStats = localStorage.getItem('newsSentimentStats');
    if (savedStats) {
      try {
        return JSON.parse(savedStats);
      } catch (e) {
        console.error("Failed to parse saved game stats");
      }
    }
    
    return {
      bestScore: 0,
      gamesPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      averageTime: 0,
      weakestCategory: '',
    };
  });
  
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  useEffect(() => {
    // Save game stats to localStorage when they change
    localStorage.setItem('newsSentimentStats', JSON.stringify(gameStats));
  }, [gameStats]);
  
  // Shuffle and get news items
  const getRandomNewsItems = (count: number) => {
    const shuffled = [...NEWS_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const startGame = () => {
    const shuffledNews = getRandomNewsItems(gameState.totalRounds);
    const firstNews = shuffledNews[0];
    
    setGameState({
      isPlaying: true,
      currentRound: 1,
      totalRounds: 5,
      score: 0,
      timeLeft: 10,
      answers: [],
      currentNews: firstNews,
    });
    
    startTime.current = Date.now();
    
    // Start countdown timer
    timerInterval.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          handleAnswer('stay', true); // Force "stay" answer on timeout
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    toast({
      title: "News Alert!",
      description: "Analyze the headlines and react quickly!",
    });
  };
  
  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };
  
  const handleAnswer = (answer: 'buy' | 'sell' | 'stay', isTimeout = false) => {
    stopTimer();
    
    if (!gameState.currentNews) return;
    
    const reactionTime = Date.now() - startTime.current;
    const isCorrect = answer === gameState.currentNews.correctAnswer;
    
    // Update current game state
    setGameState(prev => {
      const updatedAnswers = [
        ...prev.answers, 
        { 
          isCorrect, 
          reactionTime, 
          category: prev.currentNews?.category || ''
        }
      ];
      
      const updatedScore = isCorrect ? prev.score + 1 : prev.score;
      
      // Check if game is over
      if (prev.currentRound >= prev.totalRounds) {
        // End game and update stats
        endGame(updatedAnswers, updatedScore);
        
        return {
          ...prev,
          isPlaying: false,
          score: updatedScore,
          answers: updatedAnswers,
          timeLeft: 0,
        };
      }
      
      // Continue to next round
      const nextRound = prev.currentRound + 1;
      const nextNews = getRandomNewsItems(1)[0];
      
      // Start timer for next round
      timerInterval.current = setInterval(() => {
        setGameState(prevState => {
          if (prevState.timeLeft <= 1) {
            handleAnswer('stay', true);
            return prevState;
          }
          return { ...prevState, timeLeft: prevState.timeLeft - 1 };
        });
      }, 1000);
      
      startTime.current = Date.now();
      
      return {
        ...prev,
        currentRound: nextRound,
        score: updatedScore,
        timeLeft: 10,
        answers: updatedAnswers,
        currentNews: nextNews,
      };
    });
    
    if (!isTimeout) {
      toast({
        title: isCorrect ? "Correct!" : "Incorrect",
        description: gameState.currentNews.explanation,
        variant: isCorrect ? "default" : "destructive",
      });
    } else {
      toast({
        title: "Time's up!",
        description: "The market waits for no one!",
        variant: "destructive",
      });
    }
  };
  
  const endGame = (answers: GameState['answers'], finalScore: number) => {
    stopTimer();
    
    // Calculate stats from this game
    const correct = answers.filter(a => a.isCorrect).length;
    const avgTime = answers.reduce((sum, a) => sum + a.reactionTime, 0) / answers.length;
    
    // Find weakest category
    const categoryPerformance: Record<string, {total: number, correct: number}> = {};
    
    answers.forEach(answer => {
      if (!categoryPerformance[answer.category]) {
        categoryPerformance[answer.category] = { total: 0, correct: 0 };
      }
      
      categoryPerformance[answer.category].total++;
      if (answer.isCorrect) {
        categoryPerformance[answer.category].correct++;
      }
    });
    
    let weakestCategory = '';
    let lowestScore = 1;
    
    Object.entries(categoryPerformance).forEach(([category, stats]) => {
      const accuracy = stats.correct / stats.total;
      if (accuracy < lowestScore) {
        lowestScore = accuracy;
        weakestCategory = category;
      }
    });
    
    // Update overall stats
    setGameStats(prev => {
      const totalCorrect = prev.totalCorrect + correct;
      const totalAnswered = prev.totalAnswered + answers.length;
      const gamesPlayed = prev.gamesPlayed + 1;
      
      // Calculate weighted average time
      const newAvgTime = (prev.averageTime * prev.totalAnswered + avgTime * answers.length) / 
        (prev.totalAnswered + answers.length);
      
      // Update best score if better
      const bestScore = finalScore > prev.bestScore ? finalScore : prev.bestScore;
      
      return {
        bestScore,
        gamesPlayed,
        totalCorrect,
        totalAnswered,
        averageTime: newAvgTime,
        weakestCategory: weakestCategory || prev.weakestCategory,
      };
    });
    
    toast({
      title: "Game Complete!",
      description: `You scored ${finalScore} out of ${gameState.totalRounds}!`,
    });
  };

  const accuracy = gameStats.totalAnswered > 0 
    ? ((gameStats.totalCorrect / gameStats.totalAnswered) * 100).toFixed(1) 
    : "0.0";
  
  const formatCategory = (category: string) => {
    return category.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const formatWeakestCategory = () => {
    return gameStats.weakestCategory 
      ? formatCategory(gameStats.weakestCategory) 
      : "None identified";
  };

  return (
    <div className="space-y-4">
      {gameState.isPlaying && gameState.currentNews ? (
        <Card className="border-t-4 border-t-red-500">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs py-0.5 px-2 bg-red-500/20 text-red-500 rounded-full">BREAKING</span>
                <span className="text-xs text-muted-foreground">Round {gameState.currentRound}/{gameState.totalRounds}</span>
              </div>
              
              <h3 className="text-lg font-bold leading-tight">
                {gameState.currentNews.headline}
              </h3>
              
              <p className="text-xs text-muted-foreground">
                {gameState.currentNews.subtext}
              </p>
              
              <Progress
                value={(gameState.timeLeft / 10) * 100}
                className="h-2"
                indicatorClassName={gameState.timeLeft > 3 ? "bg-green-500" : "bg-red-500"}
              />
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  onClick={() => handleAnswer('buy')}
                  variant="outline"
                  className="border-green-500/30 hover:bg-green-500/10 hover:text-green-500"
                >
                  Buy USD
                </Button>
                <Button
                  onClick={() => handleAnswer('stay')}
                  variant="outline"
                  className="border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-500"
                >
                  Stay Out
                </Button>
                <Button
                  onClick={() => handleAnswer('sell')}
                  variant="outline"
                  className="border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                >
                  Sell USD
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">News Sentiment Sniper</h3>
              <p className="text-xs text-muted-foreground">React to market news with speed and accuracy</p>
            </div>
            <ChartLine className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Best Score</p>
              <h4 className="text-xl font-bold">{gameStats.bestScore}/{gameState.totalRounds}</h4>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Accuracy</p>
              <h4 className="text-xl font-bold">{accuracy}%</h4>
            </div>
          </div>
          
          <Button
            variant="default"
            className="w-full"
            onClick={startGame}
          >
            <ChartLine className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        </div>
      )}
      
      {!gameState.isPlaying && gameStats.gamesPlayed > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="performance">
            <AccordionTrigger>Performance Stats</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Games Played</span>
                      <span className="font-bold">{gameStats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Overall Accuracy</span>
                      <span className="font-bold">{accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Avg. Response Time</span>
                      <span className="font-bold">{Math.round(gameStats.averageTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Weakest Category</span>
                      <span className="font-bold">{formatWeakestCategory()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default NewsSentimentSniper;
