
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  
  // Format data for the chart
  const chartData = metrics.equityCurveData.map(point => ({
    name: `Day ${point.x}`,
    equity: point.y
  }));
  
  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">
            Challenge Strategy Overview
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
              {/* Equity Curve Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-64 mt-4"
              >
                <ChartContainer
                  className="h-full w-full"
                  config={{
                    equity: {
                      color: "#7b61ff"
                    }
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
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Equity']} 
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#7b61ff" 
                      fill="#7b61ff" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ChartContainer>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Projected Equity Curve ({traderData.passDays} Days)
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
                  
                  {/* Max Drawdown Risk */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Max Drawdown Risk</div>
                    <div className="text-xl font-semibold mt-1">
                      {metrics.drawdownRisk.toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Pass Probability */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Pass Probability</div>
                    <div className="text-xl font-semibold mt-1 flex items-center">
                      {metrics.passProbability.toFixed(0)}%
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
              
              {/* Success Progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">Pass Progress</div>
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

              {/* Challenge Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20"
              >
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-accent mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Key Insights</h4>
                    <p className="text-sm mt-1">
                      With your current metrics, you'll need to maintain {metrics.dailyTargetPercent.toFixed(2)}% daily growth
                      to achieve your {traderData.profitTarget}% profit target in {traderData.passDays} days.
                      This requires approximately {Math.ceil(metrics.tradesNeeded / traderData.passDays)} trades per day.
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
