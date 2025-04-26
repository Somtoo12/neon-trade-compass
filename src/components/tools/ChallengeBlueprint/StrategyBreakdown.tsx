
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { StrategyMetrics, TraderData } from './index';

interface StrategyBreakdownProps {
  metrics: StrategyMetrics;
  traderData: TraderData;
  isLoading: boolean;
}

const StrategyBreakdown: React.FC<StrategyBreakdownProps> = ({ metrics, traderData, isLoading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1 
    }).format(value / 100);
  };
  
  // Format data for the chart - combining all three curves
  const chartData = metrics.equityCurveData.average.map((point, index) => {
    return {
      name: `Day ${point.x}`,
      average: point.y,
      best: metrics.equityCurveData.best[index].y,
      worst: metrics.equityCurveData.worst[index].y
    };
  });
  
  // Calculate reward amount in both percentage and dollar terms
  const rewardAmountPct = metrics.rewardAmount;
  const rewardAmountDollar = (rewardAmountPct / 100) * traderData.accountSize;
  
  // Calculate risk amount in dollar terms
  const riskAmountDollar = (traderData.riskPerTrade / 100) * traderData.accountSize;
  
  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">
            Challenge Strategy Blueprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span className="ml-3">Calculating optimal strategy...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Strategy Overview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-accent/10 rounded-lg border border-accent/20 mb-4"
              >
                <div className="text-lg font-semibold mb-2">Your Challenge Blueprint</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">{traderData.profitTarget}% in {traderData.passDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Strategy:</span>
                    <span className="font-medium">{metrics.winsNeeded} wins in ~{metrics.tradesNeeded} trades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk:</span>
                    <span className="font-medium">{traderData.riskPerTrade}% per trade (${riskAmountDollar.toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward:</span>
                    <span className="font-medium">{rewardAmountPct.toFixed(2)}% per win (${rewardAmountDollar.toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drawdown Risk:</span>
                    <span className="font-medium">{metrics.drawdownRisk.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pass Probability:</span>
                    <span className="font-medium">{metrics.passProbability}% (Binomial)</span>
                  </div>
                </div>
              </motion.div>

              {/* Equity Curve Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-64 mt-4"
              >
                <div className="text-sm font-medium mb-2">Equity Curve Forecast</div>
                <ChartContainer
                  className="h-full w-full"
                  config={{
                    average: { color: "#7b61ff" },
                    best: { color: "#10b981" },
                    worst: { color: "#f43f5e" }
                  }}
                >
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tickFormatter={(value) => value.replace('Day ', '')}
                      tick={{ fontSize: 12 }}
                      tickCount={5}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value.toFixed(0)}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']} 
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="best" 
                      name="Best Case" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2}
                      strokeWidth={1} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="average" 
                      name="Average" 
                      stroke="#7b61ff" 
                      fill="#7b61ff" 
                      fillOpacity={0.3} 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="worst" 
                      name="Worst Case" 
                      stroke="#f43f5e" 
                      fill="#f43f5e" 
                      fillOpacity={0.2}
                      strokeWidth={1} 
                    />
                  </AreaChart>
                </ChartContainer>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Shows best-case (top 10%), average, and worst-case (bottom 10%) outcomes
                </p>
              </motion.div>

              {/* Key Metrics Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Trades Needed */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Trades Needed</div>
                    <div className="text-xl font-semibold mt-1">{Math.ceil(metrics.tradesNeeded)}</div>
                    <div className="text-xs text-muted-foreground mt-1">~{Math.ceil(metrics.tradesNeeded / traderData.passDays)} per day</div>
                  </div>
                  
                  {/* Wins Required */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Wins Required</div>
                    <div className="text-xl font-semibold mt-1">{metrics.winsNeeded}</div>
                    <div className="text-xs text-muted-foreground mt-1">{metrics.winsNeeded * rewardAmountPct.toFixed(1)}% total gain</div>
                  </div>
                  
                  {/* Daily Target */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Daily Target</div>
                    <div className="text-xl font-semibold mt-1 flex items-baseline">
                      {formatCurrency(metrics.dailyTargetAmount)}
                      <span className="text-xs ml-1 text-muted-foreground">
                        ({metrics.dailyTargetPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Pass Probability */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Pass Probability</div>
                    <div className="text-xl font-semibold mt-1 flex items-center">
                      {metrics.passProbability}%
                      {metrics.passProbability >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                      ) : metrics.passProbability >= 60 ? (
                        <TrendingUp className="h-4 w-4 text-amber-500 ml-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Daily Progress Tracker */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">Challenge Progress</div>
                  <div className="text-sm font-medium">
                    Target: {formatCurrency(traderData.accountSize * traderData.profitTarget / 100)}
                  </div>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(traderData.accountSize)}</span>
                  <span>{formatCurrency(traderData.accountSize * (1 + traderData.profitTarget / 100))}</span>
                </div>
              </motion.div>

              {/* Today's Task */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20"
              >
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-accent mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Today's Task</h4>
                    <p className="text-sm mt-1">
                      Enter {Math.min(2, Math.ceil(metrics.tradesNeeded / traderData.passDays))} high-probability trades ({traderData.riskRewardRatio.toFixed(2)} reward-to-risk).
                      {metrics.dailyTargetAmount > 100 && ` Stop trading if you hit ${formatCurrency(metrics.dailyTargetAmount * 1.2)} daily profit.`}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBreakdown;
