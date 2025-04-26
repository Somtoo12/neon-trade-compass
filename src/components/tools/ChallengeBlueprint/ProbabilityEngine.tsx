
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Loader2, BarChart2, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { StrategyMetrics, TraderData, RiskStyle } from './index';

interface ProbabilityEngineProps {
  traderData: TraderData;
  metrics: StrategyMetrics;
  riskStyle: RiskStyle;
}

interface SimulationResult {
  successRate: number;
  maxDrawdown: number;
  averageDrawdown: number;
  averageDaysToTarget: number;
  drawdownDistribution: {
    range: string;
    count: number;
  }[];
  daysToTargetDistribution: {
    days: string;
    count: number;
  }[];
}

const ProbabilityEngine: React.FC<ProbabilityEngineProps> = ({
  traderData,
  metrics,
  riskStyle
}) => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCount, setSimulationCount] = useState(1000);
  
  // Run simulation when requested
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Start simulation in a timeout to allow UI to update
    setTimeout(() => {
      const result = simulateChallenges(simulationCount);
      setSimulationResult(result);
      setIsSimulating(false);
      
      toast({
        title: "Simulation Complete",
        description: `${simulationCount} challenges simulated with ${result.successRate}% success rate`,
      });
    }, 300);
  };
  
  // Main simulation function
  const simulateChallenges = (count: number): SimulationResult => {
    let successCount = 0;
    let maxDrawdownObserved = 0;
    let drawdownSum = 0;
    let daysToTargetSum = 0;
    let completedChallenges = 0;
    
    const drawdownBuckets: { [key: string]: number } = {
      "0-1%": 0,
      "1-2%": 0,
      "2-3%": 0,
      "3-5%": 0,
      "5-8%": 0,
      "8%+": 0
    };
    
    const daysBuckets: { [key: string]: number } = {
      "1-3": 0,
      "4-6": 0,
      "7-10": 0,
      "11-15": 0,
      "16-20": 0,
      "20+": 0
    };
    
    // Apply risk style modifiers
    let riskMultiplier = 1.0;
    let volatilityMultiplier = 1.0;
    
    if (riskStyle === 'conservative') {
      riskMultiplier = 0.7;
      volatilityMultiplier = 0.8;
    } else if (riskStyle === 'aggressive') {
      riskMultiplier = 1.3;
      volatilityMultiplier = 1.3;
    }
    
    // Run the simulations
    for (let i = 0; i < count; i++) {
      const { success, maxDrawdown, daysToTarget } = simulateSingleChallenge(
        traderData.winRate / 100,
        traderData.riskPerTrade * riskMultiplier,
        traderData.riskRewardRatio,
        traderData.profitTarget,
        traderData.passDays,
        traderData.tradesPerDay,
        volatilityMultiplier
      );
      
      if (success) {
        successCount++;
        daysToTargetSum += daysToTarget;
        completedChallenges++;
        
        // Categorize days to target
        if (daysToTarget <= 3) daysBuckets["1-3"]++;
        else if (daysToTarget <= 6) daysBuckets["4-6"]++;
        else if (daysToTarget <= 10) daysBuckets["7-10"]++;
        else if (daysToTarget <= 15) daysBuckets["11-15"]++;
        else if (daysToTarget <= 20) daysBuckets["16-20"]++;
        else daysBuckets["20+"]++;
      }
      
      maxDrawdownObserved = Math.max(maxDrawdownObserved, maxDrawdown);
      drawdownSum += maxDrawdown;
      
      // Categorize drawdown
      if (maxDrawdown <= 1) drawdownBuckets["0-1%"]++;
      else if (maxDrawdown <= 2) drawdownBuckets["1-2%"]++;
      else if (maxDrawdown <= 3) drawdownBuckets["2-3%"]++;
      else if (maxDrawdown <= 5) drawdownBuckets["3-5%"]++;
      else if (maxDrawdown <= 8) drawdownBuckets["5-8%"]++;
      else drawdownBuckets["8%+"]++;
    }
    
    // Convert buckets to array format for charts
    const drawdownDistribution = Object.entries(drawdownBuckets).map(([range, count]) => ({
      range,
      count: (count / count) * 100
    }));
    
    const daysToTargetDistribution = Object.entries(daysBuckets).map(([days, count]) => ({
      days,
      count: completedChallenges > 0 ? (count / completedChallenges) * 100 : 0
    }));
    
    return {
      successRate: (successCount / count) * 100,
      maxDrawdown: maxDrawdownObserved,
      averageDrawdown: drawdownSum / count,
      averageDaysToTarget: completedChallenges > 0 ? daysToTargetSum / completedChallenges : 0,
      drawdownDistribution,
      daysToTargetDistribution
    };
  };
  
  // Simulate a single challenge
  const simulateSingleChallenge = (
    winRate: number,
    riskPerTrade: number,
    rewardRatio: number,
    profitTarget: number,
    maxDays: number,
    tradesPerDay: number,
    volatility: number
  ): { success: boolean; maxDrawdown: number; daysToTarget: number } => {
    let equity = 100; // Start at 100%
    let maxEquity = 100;
    let maxDrawdown = 0;
    let day = 0;
    
    // Continue until we hit the profit target or run out of days
    while (equity < 100 + profitTarget && day < maxDays) {
      day++;
      
      // Simulate trades for this day
      const dailyTrades = Math.floor(Math.random() * (tradesPerDay + 1));
      for (let i = 0; i < dailyTrades; i++) {
        const isWin = Math.random() < winRate;
        
        // Apply some randomness to results based on volatility
        const randomFactor = 1 + ((Math.random() - 0.5) * 0.4 * volatility);
        
        if (isWin) {
          equity += riskPerTrade * rewardRatio * randomFactor;
        } else {
          equity -= riskPerTrade * randomFactor;
        }
        
        // Update maximum equity and drawdown
        maxEquity = Math.max(maxEquity, equity);
        const currentDrawdown = ((maxEquity - equity) / maxEquity) * 100;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
        
        // If we've hit the target, we're done
        if (equity >= 100 + profitTarget) {
          break;
        }
      }
    }
    
    return {
      success: equity >= 100 + profitTarget,
      maxDrawdown,
      daysToTarget: day
    };
  };
  
  const getDrawdownColor = (value: number) => {
    if (value <= 15) return "#10b981"; // Green
    if (value <= 35) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Challenge Probability Engine</CardTitle>
        </CardHeader>
        <CardContent>
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
              <h3 className="text-lg font-medium">Running Simulations...</h3>
              <p className="text-muted-foreground mt-2">
                Simulating {simulationCount.toLocaleString()} prop firm challenges
              </p>
            </div>
          ) : simulationResult ? (
            <div className="space-y-6">
              {/* Main Results */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                  <div className="text-2xl font-semibold mt-1">
                    {simulationResult.successRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <div className="text-2xl font-semibold mt-1">
                    {simulationResult.maxDrawdown.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg. Drawdown</div>
                  <div className="text-2xl font-semibold mt-1">
                    {simulationResult.averageDrawdown.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg. Days to Target</div>
                  <div className="text-2xl font-semibold mt-1">
                    {simulationResult.averageDaysToTarget.toFixed(1)}
                  </div>
                </div>
              </motion.div>
              
              {/* Drawdown Distribution Chart */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium">Drawdown Distribution</h3>
                <div className="h-64">
                  <ChartContainer className="h-full w-full">
                    <BarChart
                      data={simulationResult.drawdownDistribution}
                      margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
                    >
                      <XAxis 
                        dataKey="range"
                        tick={{ fontSize: 11 }}
                        angle={0}
                        textAnchor="middle"
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Frequency']}
                        labelFormatter={(label) => `Drawdown: ${label}`}
                      />
                      <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {simulationResult.drawdownDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getDrawdownColor(entry.count)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </motion.div>
              
              {/* Days to Target Distribution Chart */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium">Days to Reach Target Distribution</h3>
                <div className="h-64">
                  <ChartContainer className="h-full w-full">
                    <BarChart
                      data={simulationResult.daysToTargetDistribution}
                      margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
                    >
                      <XAxis 
                        dataKey="days"
                        tick={{ fontSize: 11 }}
                        angle={0}
                        textAnchor="middle"
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Frequency']}
                        labelFormatter={(label) => `Days: ${label}`}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </motion.div>
              
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm">
                  <span className="font-medium">Analysis: </span>
                  With your current trading parameters, you have a {simulationResult.successRate.toFixed(1)}% chance of passing your challenge.
                  {simulationResult.successRate >= 80 
                    ? " Your strategy appears solid with manageable drawdown risk." 
                    : simulationResult.successRate >= 60
                      ? " Your strategy has a moderate chance of success, but consider reducing risk."
                      : " This strategy has significant risk. Consider adjusting your parameters."
                  }
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSimulationResult(null)}>
                  Reset
                </Button>
                <Button 
                  className="ml-2" 
                  onClick={runSimulation}
                >
                  Run Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Monte Carlo Simulation
                </h3>
                <p className="text-sm mt-2">
                  This tool will run thousands of simulated challenges using your trading metrics to predict your chances of success and potential drawdowns.
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Number of Simulations</label>
                  <div className="flex items-center mt-1 space-x-2">
                    {[100, 1000, 5000, 10000].map((count) => (
                      <Button
                        key={count}
                        variant={simulationCount === count ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSimulationCount(count)}
                      >
                        {count.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher counts provide more accurate results but take longer to process
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={runSimulation}
              >
                Run Stress Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trading Strategy Cheat Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-2">Tactical Guidelines</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-xs mr-2 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Daily Trade Limit</p>
                    <p className="text-muted-foreground">
                      Stick to {Math.min(3, Math.ceil(metrics.tradesNeeded / traderData.passDays))} trades per day maximum
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-xs mr-2 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Position Sizing</p>
                    <p className="text-muted-foreground">
                      Risk {traderData.riskPerTrade}% per trade (${((traderData.riskPerTrade / 100) * traderData.accountSize).toFixed(2)})
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-xs mr-2 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Target Per Win</p>
                    <p className="text-muted-foreground">
                      Each win gains {metrics.rewardAmount.toFixed(2)}% (${((metrics.rewardAmount / 100) * traderData.accountSize).toFixed(2)})
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-xs mr-2 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Psychological Shield</p>
                    <p className="text-muted-foreground">
                      Stop trading after {Math.min(2, metrics.winsNeeded)} consecutive losses
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Optimal Trading Windows</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 border border-border/50 rounded-md">
                  <p className="font-medium">London Open</p>
                  <p className="text-muted-foreground">08:00-10:00 GMT</p>
                </div>
                <div className="p-2 border border-border/50 rounded-md">
                  <p className="font-medium">NY Open</p>
                  <p className="text-muted-foreground">13:30-15:30 GMT</p>
                </div>
                <div className="p-2 border border-border/50 rounded-md">
                  <p className="font-medium">London/NY Overlap</p>
                  <p className="text-muted-foreground">13:00-16:00 GMT</p>
                </div>
                <div className="p-2 border border-border/50 rounded-md">
                  <p className="font-medium">Asian Session</p>
                  <p className="text-muted-foreground">00:00-03:00 GMT</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-accent/10 rounded-lg text-sm">
              <p className="font-medium">Progress Tracker</p>
              <p className="text-muted-foreground mt-1">
                Day 0/{traderData.passDays}: You need {metrics.winsNeeded} wins in {metrics.tradesNeeded} trades to reach your {traderData.profitTarget}% target.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProbabilityEngine;
