
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { ArrowRight, RotateCw, TrendingUp, TrendingDown, BadgeCheck, Clock } from 'lucide-react';
import type { TraderProfile, StrategyDetails, SimulationState } from './index';

interface SimulationEngineProps {
  traderProfile: TraderProfile;
  strategyDetails: StrategyDetails | null;
  simulationState: SimulationState | null;
  onManualTrade: (isWin: boolean) => void;
  onAutoSimulate: (days: number) => void;
  onReset: () => void;
  isCalculating: boolean;
  onNextStep: () => void;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({
  traderProfile,
  strategyDetails,
  simulationState,
  onManualTrade,
  onAutoSimulate,
  onReset,
  isCalculating,
  onNextStep
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  if (!strategyDetails || !simulationState) {
    return (
      <div className="text-center py-16">
        <p>Please complete the previous steps first</p>
        <Button onClick={onNextStep} className="mt-4">Next Step</Button>
      </div>
    );
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate target profit
  const targetProfit = traderProfile.accountBalance * (traderProfile.targetPercentage / 100);
  const targetBalance = traderProfile.accountBalance + targetProfit;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    100, 
    Math.max(
      0, 
      ((simulationState.currentBalance - traderProfile.accountBalance) / targetProfit) * 100
    )
  );
  
  // Calculate risk per trade
  const riskAmount = traderProfile.accountBalance * (strategyDetails.riskPerTradePercent / 100);
  const rewardAmount = riskAmount * strategyDetails.rewardRiskRatio;
  
  // Generate chart data
  const generateChartData = () => {
    const data = [
      { trade: 0, balance: traderProfile.accountBalance }
    ];
    
    simulationState.tradeHistory.forEach((trade, index) => {
      data.push({
        trade: index + 1,
        balance: trade.balance
      });
    });
    
    return data;
  };
  
  const chartData = generateChartData();
  
  // Handle auto-simulation
  const handleAutoSimulate = (days: number) => {
    setIsSimulating(true);
    onAutoSimulate(days);
    setTimeout(() => setIsSimulating(false), days * traderProfile.tradesPerDay * 50 + 200);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Challenge Simulation</h2>
        <p className="text-muted-foreground mb-6">
          Test your strategy with this interactive simulator. Add trades to see how your balance evolves.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Chart */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Equity Simulation</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onReset}
                    disabled={isCalculating || isSimulating}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="h-64">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      balance: {
                        color: "#7b61ff"
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis 
                          dataKey="trade" 
                          label={{ value: 'Trades', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${formatCurrency(value)}`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${formatCurrency(value)}`, 'Balance']} 
                          labelFormatter={(label) => `Trade ${label}`}
                        />
                        <ReferenceLine 
                          y={targetBalance} 
                          stroke="#10b981" 
                          strokeDasharray="3 3"
                          label={{ value: 'Target', position: 'right', fill: '#10b981' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          name="Balance"
                          stroke="#7b61ff" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm">Progress to Target</div>
                    <div className="text-sm font-medium">
                      {Math.round(progressPercentage)}% complete
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatCurrency(traderProfile.accountBalance)}</span>
                    <span>{formatCurrency(targetBalance)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trade Controls */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Trade Simulator</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/30 p-4 rounded-lg flex items-center">
                    <div className="bg-green-500/10 p-2 rounded-full mr-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Win Amount</div>
                      <div className="text-xl font-semibold mt-1">{formatCurrency(rewardAmount)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 p-4 rounded-lg flex items-center">
                    <div className="bg-red-500/10 p-2 rounded-full mr-3">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Loss Amount</div>
                      <div className="text-xl font-semibold mt-1">{formatCurrency(riskAmount)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Manual Trading */}
                  <div>
                    <div className="flex items-center mb-3">
                      <BadgeCheck className="h-5 w-5 text-accent mr-2" />
                      <h4 className="text-lg font-medium">Manual Trading</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                      >
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => onManualTrade(true)}
                          disabled={isCalculating || isSimulating}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Add Win (+{formatCurrency(rewardAmount)})
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                      >
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => onManualTrade(false)}
                          disabled={isCalculating || isSimulating}
                        >
                          <TrendingDown className="h-4 w-4 mr-2" />
                          Add Loss (-{formatCurrency(riskAmount)})
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Auto Simulation */}
                  <div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 text-accent mr-2" />
                      <h4 className="text-lg font-medium">Auto Simulation</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleAutoSimulate(1)}
                        disabled={isCalculating || isSimulating}
                      >
                        +1 Day
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAutoSimulate(3)}
                        disabled={isCalculating || isSimulating}
                      >
                        +3 Days
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAutoSimulate(5)}
                        disabled={isCalculating || isSimulating}
                      >
                        +5 Days
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Current Account Status */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Account Status</h3>
                
                <div className="space-y-4">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-semibold mt-1">{formatCurrency(simulationState.currentBalance)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {simulationState.currentBalance > traderProfile.accountBalance ? (
                        <span className="text-green-500">
                          +{formatCurrency(simulationState.currentBalance - traderProfile.accountBalance)} 
                          ({((simulationState.currentBalance / traderProfile.accountBalance - 1) * 100).toFixed(2)}%)
                        </span>
                      ) : simulationState.currentBalance < traderProfile.accountBalance ? (
                        <span className="text-red-500">
                          {formatCurrency(simulationState.currentBalance - traderProfile.accountBalance)}
                          ({((simulationState.currentBalance / traderProfile.accountBalance - 1) * 100).toFixed(2)}%)
                        </span>
                      ) : (
                        "No change yet"
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Wins</div>
                      <div className="text-xl font-semibold mt-1 text-green-500">{simulationState.winCount}</div>
                    </div>
                    
                    <div className="bg-red-500/10 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Losses</div>
                      <div className="text-xl font-semibold mt-1 text-red-500">{simulationState.lossCount}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="text-xl font-semibold mt-1">
                        {simulationState.winCount + simulationState.lossCount > 0 
                          ? ((simulationState.winCount / (simulationState.winCount + simulationState.lossCount)) * 100).toFixed(1)
                          : "0.0"}%
                      </div>
                    </div>
                    
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Break-Even</div>
                      <div className="text-xl font-semibold mt-1">
                        {strategyDetails.breakEvenWinRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trading Stats */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Trading Stats</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                      <div className="text-xl font-semibold mt-1">
                        {simulationState.winCount + simulationState.lossCount}
                      </div>
                    </div>
                    
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Remaining</div>
                      <div className="text-xl font-semibold mt-1">
                        {Math.max(0, strategyDetails.totalTradesEstimate - (simulationState.winCount + simulationState.lossCount)).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Win Streak</div>
                      <div className="text-xl font-semibold mt-1">
                        {simulationState.maxWinStreak} max
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {simulationState.winStreak}
                      </div>
                    </div>
                    
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Loss Streak</div>
                      <div className="text-xl font-semibold mt-1">
                        {simulationState.maxLossStreak} max
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {simulationState.lossStreak}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <div className="text-sm">
                      <span className="font-medium">Status: </span>
                      {simulationState.isPassed ? (
                        <span className="text-green-500 font-medium">Challenge Passed! 🏆</span>
                      ) : progressPercentage > 0 ? (
                        <span>{progressPercentage.toFixed(1)}% to target</span>
                      ) : (
                        <span>Challenge in progress</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {simulationState.isPassed ? (
                        "Congratulations! You've successfully reached your profit target."
                      ) : (
                        `Need ${formatCurrency(targetBalance - simulationState.currentBalance)} more profit to pass.`
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={onNextStep}
                className="w-full bg-accent hover:bg-accent/90"
              >
                Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimulationEngine;
