
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface GamePerformance {
  propChallenge: {
    highScore: number;
    plays: number;
    lastPlayed: string | null;
  };
  killZone: {
    bestScore: number;
    avgReactionTime: number;
    plays: number;
    lastPlayed: string | null;
  };
  newsSentiment: {
    bestScore: number;
    accuracy: number;
    plays: number;
    lastPlayed: string | null;
  };
  tradeBuilder: {
    winRate: number;
    plays: number;
    lastPlayed: string | null;
  };
  totalPlays: number;
  totalTimePlayed: number; // stored in seconds
}

const DEFAULT_PERFORMANCE: GamePerformance = {
  propChallenge: {
    highScore: 0,
    plays: 0,
    lastPlayed: null,
  },
  killZone: {
    bestScore: 0,
    avgReactionTime: 0,
    plays: 0,
    lastPlayed: null,
  },
  newsSentiment: {
    bestScore: 0,
    accuracy: 0,
    plays: 0,
    lastPlayed: null,
  },
  tradeBuilder: {
    winRate: 0,
    plays: 0,
    lastPlayed: null,
  },
  totalPlays: 0,
  totalTimePlayed: 0,
};

const GamePerformanceDashboard: React.FC = () => {
  const [performance, setPerformance] = useState<GamePerformance>(() => {
    const savedData = localStorage.getItem('gamePerformanceDashboard');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to parse game performance data');
      }
    }
    return DEFAULT_PERFORMANCE;
  });
  
  // Update performance stats from individual game data
  useEffect(() => {
    // Check for Prop Challenge data
    const propChallengeHighScore = parseFloat(localStorage.getItem('propChallengeHighScore') || '0');
    
    // Check for Kill Zone Reflex data
    const killZoneBestScore = parseInt(localStorage.getItem('killZoneReflexBestScore') || '0');
    let killZoneAvgReactionTime = 0;
    try {
      const reactions = JSON.parse(localStorage.getItem('killZoneReflexReactions') || '[]');
      if (reactions.length > 0) {
        killZoneAvgReactionTime = reactions.reduce((sum: number, time: number) => sum + time, 0) / reactions.length;
      }
    } catch (e) {
      console.error('Failed to parse kill zone reactions');
    }
    
    // Check for News Sentiment data
    let newsSentimentBestScore = 0;
    let newsSentimentAccuracy = 0;
    let newsSentimentPlays = 0;
    try {
      const newsStats = JSON.parse(localStorage.getItem('newsSentimentStats') || '{}');
      newsSentimentBestScore = newsStats.bestScore || 0;
      newsSentimentPlays = newsStats.gamesPlayed || 0;
      newsSentimentAccuracy = newsStats.totalAnswered > 0
        ? (newsStats.totalCorrect / newsStats.totalAnswered * 100)
        : 0;
    } catch (e) {
      console.error('Failed to parse news sentiment stats');
    }
    
    // Check for Trade Builder data
    let tradeBuilderWinRate = 0;
    let tradeBuilderPlays = 0;
    try {
      const weeklyPerformance = JSON.parse(localStorage.getItem('tradeBuilderWeekly') || '{}');
      const total = (weeklyPerformance.wins || 0) + (weeklyPerformance.losses || 0);
      tradeBuilderWinRate = total > 0
        ? ((weeklyPerformance.wins || 0) / total * 100)
        : 0;
      tradeBuilderPlays = total;
    } catch (e) {
      console.error('Failed to parse trade builder stats');
    }
    
    // Calculate total plays
    const totalPlays = performance.propChallenge.plays + 
                       performance.killZone.plays +
                       newsSentimentPlays +
                       tradeBuilderPlays;
    
    const newPerformance = {
      propChallenge: {
        highScore: propChallengeHighScore,
        plays: performance.propChallenge.plays,
        lastPlayed: performance.propChallenge.lastPlayed,
      },
      killZone: {
        bestScore: killZoneBestScore,
        avgReactionTime: killZoneAvgReactionTime,
        plays: performance.killZone.plays,
        lastPlayed: performance.killZone.lastPlayed,
      },
      newsSentiment: {
        bestScore: newsSentimentBestScore,
        accuracy: newsSentimentAccuracy,
        plays: newsSentimentPlays,
        lastPlayed: performance.newsSentiment.lastPlayed,
      },
      tradeBuilder: {
        winRate: tradeBuilderWinRate,
        plays: tradeBuilderPlays,
        lastPlayed: performance.tradeBuilder.lastPlayed,
      },
      totalPlays,
      totalTimePlayed: performance.totalTimePlayed,
    };
    
    setPerformance(newPerformance);
    localStorage.setItem('gamePerformanceDashboard', JSON.stringify(newPerformance));
  }, []);
  
  const formatTimeElapsed = (seconds: number): string => {
    if (!seconds) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  const getBadges = (): string[] => {
    const badges: string[] = [];
    
    // Assign badges based on performance
    if (performance.totalPlays >= 10) badges.push('Dedicated Player');
    if (performance.propChallenge.highScore >= 5) badges.push('Prop Master');
    if (performance.killZone.bestScore >= 20) badges.push('Reflex Pro');
    if (performance.newsSentiment.accuracy >= 70) badges.push('News Analyst');
    if (performance.tradeBuilder.winRate >= 60) badges.push('Trade Architect');
    
    return badges;
  };
  
  const badges = getBadges();
  
  return (
    <Card className="bg-secondary/30 border-dashed">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <span className="mr-2">📊</span>
          My Game Performance
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Games Played</p>
            <p className="text-xl font-bold">{performance.totalPlays}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Time Spent Gaming</p>
            <p className="text-xl font-bold">{formatTimeElapsed(performance.totalTimePlayed)}</p>
          </div>
        </div>
        
        {badges.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Earned Badges</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span 
                  key={badge}
                  className="text-xs py-1 px-2 rounded-full bg-primary/20 text-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GamePerformanceDashboard;
