
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, RefreshCw, BarChart, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { StrategyMetrics, TraderData, RiskStyle } from './index';

interface Trade {
  id: number;
  type: 'win' | 'loss';
  amount: number;
  timestamp: Date;
}

interface MiniSimulatorProps {
  traderData: TraderData;
  riskStyle: RiskStyle;
  initialMetrics: StrategyMetrics;
}

const MiniSimulator: React.FC<MiniSimulatorProps> = ({ 
  traderData,
  riskStyle, 
  initialMetrics
}) => {
  const [balance, setBalance] = useState(traderData.accountSize);
  const [equity, setEquity] = useState(traderData.accountSize);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [equityHistory, setEquityHistory] = useState<{date: Date, value: number}[]>([
    {date: new Date(), value: traderData.accountSize}
  ]);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [streak, setStreak] = useState({count: 0, type: '' as 'win' | 'loss' | ''});
  
  const targetProfit = traderData.accountSize * (traderData.profitTarget / 100);
  const profitTarget = traderData.accountSize + targetProfit;
  const maxDrawdown = traderData.accountSize * 0.90; // Assuming 10% max drawdown rule
  
  const riskAmount = traderData.accountSize * (traderData.riskPerTrade / 100);
  const rewardAmount = riskAmount * traderData.riskRewardRatio;
  
  const progress = ((equity - traderData.accountSize) / targetProfit) * 100;
  
  // Reset the simulator
  const handleReset = () => {
    setBalance(traderData.accountSize);
    setEquity(traderData.accountSize);
    setTrades([]);
    setEquityHistory([{date: new Date(), value: traderData.accountSize}]);
    setWins(0);
    setLosses(0);
    setStreak({count: 0, type: ''});
  };
  
  // Register a winning trade
  const handleWin = () => {
    const profit = rewardAmount;
    const newBalance = balance + profit;
    const newEquity = equity + profit;
    
    const newTrade: Trade = {
      id: trades.length + 1,
      type: 'win',
      amount: profit,
      timestamp: new Date()
    };
    
    setBalance(newBalance);
    setEquity(newEquity);
    setTrades([newTrade, ...trades]);
    setEquityHistory([...equityHistory, {date: new Date(), value: newEquity}]);
    setWins(wins + 1);
    
    // Update streak
    if (streak.type === 'win') {
      setStreak({count: streak.count + 1, type: 'win'});
    } else {
      setStreak({count: 1, type: 'win'});
    }
  };
  
  // Register a losing trade
  const handleLoss = () => {
    const loss = riskAmount;
    const newBalance = balance - loss;
    const newEquity = equity - loss;
    
    const newTrade: Trade = {
      id: trades.length + 1,
      type: 'loss',
      amount: loss,
      timestamp: new Date()
    };
    
    setBalance(newBalance);
    setEquity(newEquity);
    setTrades([newTrade, ...trades]);
    setEquityHistory([...equityHistory, {date: new Date(), value: newEquity}]);
    setLosses(losses + 1);
    
    // Update streak
    if (streak.type === 'loss') {
      setStreak({count: streak.count + 1, type: 'loss'});
    } else {
      setStreak({count: 1, type: 'loss'});
    }
  };
  
  // Undo the last trade
  const undoLastTrade = () => {
    if (trades.length === 0) return;
    
    const lastTrade = trades[0];
    const newBalance = lastTrade.type === 'win' 
      ? balance - lastTrade.amount 
      : balance + lastTrade.amount;
      
    const newEquity = lastTrade.type === 'win' 
      ? equity - lastTrade.amount 
      : equity + lastTrade.amount;
    
    setBalance(newBalance);
    setEquity(newEquity);
    setTrades(trades.slice(1));
    setEquityHistory(equityHistory.slice(0, -1));
    
    if (lastTrade.type === 'win') {
      setWins(wins - 1);
    } else {
      setLosses(losses - 1);
    }
    
    // Recalculate streak
    if (streak.count > 1) {
      setStreak({count: streak.count - 1, type: streak.type});
    } else {
      // Need to determine the new streak by looking at trade history
      const remainingTrades = trades.slice(1);
      if (remainingTrades.length === 0) {
        setStreak({count: 0, type: ''});
      } else {
        // Count streak from most recent trades
        let newStreakCount = 1;
        let newStreakType = remainingTrades[0].type;
        
        for (let i = 1; i < remainingTrades.length; i++) {
          if (remainingTrades[i].type === newStreakType) {
            newStreakCount++;
          } else {
            break;
          }
        }
        
        setStreak({count: newStreakCount, type: newStreakType});
      }
    }
  };
  
  // Format a date string for the chart
  const formatDateTimeForChart = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  // Format the chart data
  const chartData = equityHistory.map((point, index) => ({
    name: index === 0 ? 'Start' : `Trade ${index}`,
    equity: point.value
  }));
  
  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Trading Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Equity Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm">Challenge Progress</div>
              <div className="text-sm font-medium">{progress.toFixed(2)}%</div>
            </div>
            <Progress value={Math.max(0, Math.min(100, progress))} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>${traderData.accountSize.toLocaleString()}</span>
              <span>${profitTarget.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Current Equity */}
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="text-sm">Current Equity</div>
            <div className="text-3xl font-semibold">${equity.toLocaleString()}</div>
            <div className={`mt-1 text-sm ${equity > traderData.accountSize ? 'text-green-500' : equity < traderData.accountSize ? 'text-red-500' : ''}`}>
              {equity > traderData.accountSize 
                ? `+$${(equity - traderData.accountSize).toLocaleString()} (+${(((equity - traderData.accountSize) / traderData.accountSize) * 100).toFixed(2)}%)`
                : equity < traderData.accountSize
                  ? `-$${(traderData.accountSize - equity).toLocaleString()} (-${(((traderData.accountSize - equity) / traderData.accountSize) * 100).toFixed(2)}%)`
                  : '$0.00 (0.00%)'
              }
            </div>
          </div>
          
          {/* Equity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-60 mt-4"
          >
            <ChartContainer
              className="h-full w-full"
              config={{
                equity: {
                  color: "#7b61ff"
                }
              }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  height={20}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                  width={65}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#7b61ff" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </motion.div>
          
          {/* Trade Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Wins</div>
              <div className="text-2xl font-semibold text-green-500">{wins}</div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Losses</div>
              <div className="text-2xl font-semibold text-red-500">{losses}</div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-2xl font-semibold">
                {trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : '0.0'}%
              </div>
            </div>
            
            {streak.count > 0 && (
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className={`text-xl font-semibold ${streak.type === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                  {streak.count} {streak.type === 'win' ? 'Wins' : 'Losses'}
                </div>
              </div>
            )}
          </div>
          
          {/* Trade Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 border-green-500/30"
              onClick={handleWin}
            >
              <ArrowUp className="h-5 w-5 mr-1" />
              Win Trade
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 border-red-500/30"
              onClick={handleLoss}
            >
              <ArrowDown className="h-5 w-5 mr-1" />
              Loss Trade
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={undoLastTrade}
              disabled={trades.length === 0}
            >
              <Undo2 className="h-5 w-5 mr-1" />
              Undo
            </Button>
          </div>
          
          {/* Reset Button */}
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={handleReset}
          >
            <RefreshCw className="h-5 w-5 mr-1" />
            Reset Simulator
          </Button>
          
          {/* Status Messages */}
          {equity >= profitTarget && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
              <p className="font-medium text-green-500">🎉 Challenge Passed! 🎉</p>
              <p className="text-sm mt-1">
                Congratulations! You've hit your profit target of ${targetProfit.toLocaleString()}!
              </p>
            </div>
          )}
          
          {equity <= maxDrawdown && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
              <p className="font-medium text-red-500">⚠️ Max Drawdown Breach ⚠️</p>
              <p className="text-sm mt-1">
                You've hit the max drawdown threshold. Time to reevaluate your approach.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniSimulator;
