
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Award, Shield, Gauge, Flame, Target } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StrategyMetrics, TraderData } from './index';

interface StrategyBreakdownProps {
  metrics: StrategyMetrics;
  traderData: TraderData;
  isLoading: boolean;
}

const StrategyBreakdown: React.FC<StrategyBreakdownProps> = ({ metrics, traderData, isLoading }) => {
  const [animatedMetrics, setAnimatedMetrics] = useState({
    rewardAmount: 0,
    passProbability: 0,
    drawdownRisk: 0,
    dailyTargetPercent: 0
  });
  
  // Animation effect for metrics
  useEffect(() => {
    if (!isLoading && metrics) {
      const animationDuration = 1500; // ms
      const steps = 30;
      const interval = animationDuration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setAnimatedMetrics({
          rewardAmount: Number((metrics.rewardAmount * progress).toFixed(2)),
          passProbability: Number((metrics.passProbability * progress).toFixed(0)),
          drawdownRisk: Number((metrics.drawdownRisk * progress).toFixed(1)),
          dailyTargetPercent: Number((metrics.dailyTargetPercent * progress).toFixed(1))
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setAnimatedMetrics({
            rewardAmount: metrics.rewardAmount,
            passProbability: metrics.passProbability,
            drawdownRisk: metrics.drawdownRisk,
            dailyTargetPercent: metrics.dailyTargetPercent
          });
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [metrics, isLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format data for the chart
  const chartData = metrics?.equityCurveData?.average.map((point, index) => {
    return {
      name: `Day ${point.x}`,
      average: point.y,
      best: metrics.equityCurveData.best[index].y,
      worst: metrics.equityCurveData.worst[index].y
    };
  }) || [];
  
  // Calculate reward amount in both percentage and dollar terms
  const rewardAmountPct = metrics?.rewardAmount || 0;
  const rewardAmountDollar = (rewardAmountPct / 100) * (traderData?.accountSize || 0);
  
  // Calculate risk amount in dollar terms
  const riskAmountDollar = ((traderData?.riskPerTrade || 0) / 100) * (traderData?.accountSize || 0);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 backdrop-blur-md bg-card/30 border border-neon-cyan/30 rounded-lg shadow-neon-cyan">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-xs flex items-center">
                <span 
                  className="h-2 w-2 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="ml-1 font-medium">{entry.value.toFixed(1)}%</span>
              </p>
            ))}
            <p className="text-xs mt-2 text-neon-cyan">
              {payload[1].value > 100 ? "Profit target in sight" : "Building equity"}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-2 border-neon-cyan shadow-neon-cyan bg-background/30 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-blue/5 to-neon-cyan/10" />
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-center">
            <Target className="h-5 w-5 text-neon-cyan mr-2" />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Challenge Strategy Blueprint
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
              <span className="ml-3">Calculating optimal strategy...</span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Section - Stats and Chart */}
              <div className="lg:w-3/5 space-y-6">
                {/* Strategy Overview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 rounded-lg border border-neon-blue/30 mb-4"
                >
                  <div className="text-lg font-semibold mb-2 bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                    Blueprint Summary
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Risk */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent"></div>
                      <div className="relative flex items-center mb-1">
                        <Shield className="h-4 w-4 text-neon-cyan mr-2" />
                        <span className="text-xs text-muted-foreground">RISK</span>
                      </div>
                      <div className="text-lg font-semibold flex items-baseline">
                        {traderData.riskPerTrade}%
                        <span className="text-xs ml-1 text-muted-foreground">
                          (${riskAmountDollar.toFixed(0)})
                        </span>
                      </div>
                    </motion.div>
                    
                    {/* Reward */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-green/20 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent"></div>
                      <div className="relative flex items-center mb-1">
                        <Trophy className="h-4 w-4 text-neon-green mr-2" />
                        <span className="text-xs text-muted-foreground">REWARD</span>
                      </div>
                      <div className="text-lg font-semibold flex items-baseline">
                        {animatedMetrics.rewardAmount.toFixed(2)}%
                        <span className="text-xs ml-1 text-muted-foreground">
                          (${rewardAmountDollar.toFixed(0)})
                        </span>
                      </div>
                    </motion.div>
                    
                    {/* Drawdown */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-red-500/20 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                      <div className="relative flex items-center mb-1">
                        <TrendingUp className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-xs text-muted-foreground">DRAWDOWN</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {animatedMetrics.drawdownRisk.toFixed(1)}%
                      </div>
                    </motion.div>
                    
                    {/* Pass Probability */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-purple/20 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent"></div>
                      <div className="relative flex items-center mb-1">
                        <CheckCircle className="h-4 w-4 text-neon-purple mr-2" />
                        <span className="text-xs text-muted-foreground">SUCCESS</span>
                      </div>
                      <div className="text-lg font-semibold flex items-center">
                        {animatedMetrics.passProbability}%
                        {metrics.passProbability >= 80 ? (
                          <CheckCircle className="h-3 w-3 text-neon-green ml-1" />
                        ) : metrics.passProbability >= 60 ? (
                          <TrendingUp className="h-3 w-3 text-amber-500 ml-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Trades Needed */}
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                          className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-blue/20 hover:border-neon-blue/40 transition-colors cursor-help overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent"></div>
                          <div className="relative">
                            <div className="text-xs text-muted-foreground">Trades</div>
                            <div className="text-lg font-semibold mt-1">{Math.ceil(metrics.tradesNeeded)}</div>
                            <div className="text-xs text-muted-foreground mt-1">~{Math.ceil(metrics.tradesNeeded / traderData.passDays)} per day</div>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px] text-xs">
                          Total number of trades needed to reach your profit target with current win rate.
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  
                  {/* Wins Required */}
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                          className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-colors cursor-help overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent"></div>
                          <div className="relative">
                            <div className="text-xs text-muted-foreground">Wins</div>
                            <div className="text-lg font-semibold mt-1">{metrics.winsNeeded}</div>
                            <div className="text-xs text-muted-foreground mt-1">{(metrics.winsNeeded * rewardAmountPct).toFixed(1)}% gain</div>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px] text-xs">
                          Number of winning trades required to achieve your profit target.
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  
                  {/* Daily Target */}
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                          className="p-3 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-sm rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-colors cursor-help overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent"></div>
                          <div className="relative">
                            <div className="text-xs text-muted-foreground">Daily Target</div>
                            <div className="text-lg font-semibold mt-1 flex items-baseline">
                              {formatCurrency(metrics.dailyTargetAmount)}
                              <span className="text-xs ml-1 text-muted-foreground">
                                ({animatedMetrics.dailyTargetPercent.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px] text-xs">
                          Recommended daily profit target to stay on track for challenge completion.
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>

                {/* Equity Curve Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-64 mt-4"
                >
                  <div className="text-sm font-medium mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 text-neon-blue mr-2" />
                    <span>Equity Projection</span>
                  </div>
                  <div className="relative h-full">
                    {/* Glow effect behind chart */}
                    <div className="absolute inset-0 bg-neon-blue/5 rounded-lg filter blur-md"></div>
                    
                    <ChartContainer
                      className="h-full w-full z-10 relative"
                      config={{
                        average: { color: "#7b61ff" },
                        best: { color: "#00ffb3" },
                        worst: { color: "#ff4a6e" }
                      }}
                    >
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="bestColorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ffb3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00ffb3" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="averageColorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7b61ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#7b61ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="worstColorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff4a6e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff4a6e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          tickFormatter={(value) => value.replace('Day ', '')}
                          tick={{ fontSize: 12 }}
                          tickCount={5}
                          stroke="#666"
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                          tick={{ fontSize: 12 }}
                          stroke="#666"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="best" 
                          name="Optimal" 
                          stroke="#00ffb3" 
                          strokeWidth={2}
                          fill="url(#bestColorGradient)"
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#00ffb3', className: 'animate-pulse-glow' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="average" 
                          name="Expected" 
                          stroke="#7b61ff" 
                          strokeWidth={2}
                          fill="url(#averageColorGradient)"
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#7b61ff', className: 'animate-pulse-glow' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="worst" 
                          name="Minimum" 
                          stroke="#ff4a6e" 
                          strokeWidth={2}
                          fill="url(#worstColorGradient)"
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#ff4a6e', className: 'animate-pulse-glow' }}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </motion.div>

                {/* Daily Progress Tracker */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm flex items-center">
                      <Target className="h-4 w-4 text-neon-cyan mr-2" />
                      <span>Challenge Progress</span>
                    </div>
                    <div className="text-sm font-medium text-neon-green">
                      {formatCurrency(traderData.accountSize * traderData.profitTarget / 100)}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-green/10 animate-pulse"></div>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-green"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatCurrency(traderData.accountSize)}</span>
                    <span className="text-neon-cyan">+{traderData.profitTarget}%</span>
                    <span>{formatCurrency(traderData.accountSize * (1 + traderData.profitTarget / 100))}</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Section - Daily Task */}
              <div className="lg:w-2/5 lg:pl-4 lg:border-l lg:border-neon-blue/20 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-neon-purple/10 to-black/20 rounded-lg border border-neon-purple/30"
                >
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-neon-purple mr-2" />
                    <h4 className="font-medium text-lg text-neon-purple">Today's Mission</h4>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-neon-cyan flex items-center justify-center mr-3">
                        <div className="h-2 w-2 rounded-full bg-neon-cyan"></div>
                      </div>
                      <p className="text-sm">
                        Enter {Math.min(2, Math.ceil(metrics.tradesNeeded / traderData.passDays))} high-quality trades
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-neon-cyan flex items-center justify-center mr-3">
                        <div className="h-2 w-2 rounded-full bg-neon-cyan"></div>
                      </div>
                      <p className="text-sm">
                        Maintain {traderData.riskRewardRatio}:1 reward-to-risk ratio
                      </p>
                    </div>
                    {metrics.dailyTargetAmount > 100 && (
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full border border-neon-cyan flex items-center justify-center mr-3">
                          <div className="h-2 w-2 rounded-full bg-neon-cyan"></div>
                        </div>
                        <p className="text-sm">
                          Stop trading after ${(metrics.dailyTargetAmount * 1.2).toFixed(0)} profit
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-sm p-3 bg-black/40 border border-neon-cyan/20 rounded-md">
                    <span className="text-neon-cyan font-medium">PRO TIP:</span> Focus on trade quality over quantity. Each setup should meet all your criteria before entry.
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-4 bg-gradient-to-br from-neon-blue/10 to-black/20 rounded-lg border border-neon-blue/30"
                >
                  <div className="flex items-center mb-3">
                    <Gauge className="h-5 w-5 text-neon-blue mr-2" />
                    <h4 className="font-medium text-lg text-neon-blue">Performance Metrics</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">{traderData.winRate}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: `${traderData.winRate}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-neon-blue"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Reward/Risk</span>
                        <span className="font-medium">{traderData.riskRewardRatio}:1</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: `${Math.min(100, traderData.riskRewardRatio * 20)}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-neon-green"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Probability</span>
                        <span className="font-medium">{metrics.passProbability}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: `${metrics.passProbability}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-neon-green"
                          style={{
                            backgroundSize: "300% 100%",
                            backgroundPosition: `${100 - metrics.passProbability}% 0%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Trading Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-4 bg-gradient-to-br from-neon-green/10 to-black/20 rounded-lg border border-neon-green/30"
                >
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-neon-green mr-2" />
                    <h4 className="font-medium text-lg text-neon-green">Risk Controls</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start">
                      <div className="h-4 w-4 rounded-full border border-neon-green flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-neon-green"></div>
                      </div>
                      Maximum risk per position: <span className="font-medium ml-1">{traderData.riskPerTrade}%</span>
                    </p>
                    <p className="flex items-start">
                      <div className="h-4 w-4 rounded-full border border-neon-green flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-neon-green"></div>
                      </div>
                      Daily drawdown limit: <span className="font-medium ml-1">{(metrics.drawdownRisk * 0.75).toFixed(1)}%</span>
                    </p>
                    <p className="flex items-start">
                      <div className="h-4 w-4 rounded-full border border-neon-green flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-neon-green"></div>
                      </div>
                      Maximum positions: <span className="font-medium ml-1">{Math.min(3, Math.ceil(metrics.tradesNeeded / traderData.passDays) + 1)}</span>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBreakdown;

