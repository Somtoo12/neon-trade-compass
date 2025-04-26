
import React, { useState, useEffect } from 'react';
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
  const [loadingStage, setLoadingStage] = useState(0);
  const [showSampleData, setShowSampleData] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let stageTimer: NodeJS.Timeout;
    
    if (isLoading) {
      // Reset states
      setLoadingStage(0);
      setShowSampleData(false);
      
      // Simulate loading stages
      stageTimer = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 1000);
      
      // Show sample data after 5 seconds
      timer = setTimeout(() => {
        setShowSampleData(true);
      }, 5000);
    }
    
    // Cleanup
    return () => {
      clearInterval(stageTimer);
      clearTimeout(timer);
    };
  }, [isLoading]);
  
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
  
  // Sample data for fallback when loading takes too long
  const sampleChartData = [
    { name: 'Day 0', average: 100, best: 100, worst: 100 },
    { name: 'Day 3', average: 103, best: 105, worst: 101 },
    { name: 'Day 6', average: 105, best: 109, worst: 102 },
    { name: 'Day 10', average: 110, best: 115, worst: 106 },
  ];
  
  // Format data for the chart - combining all three curves
  const chartData = isLoading && showSampleData ? sampleChartData : 
    metrics?.equityCurveData?.average?.map((point, index) => {
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
  const riskAmountDollar = (traderData?.riskPerTrade || 0) / 100 * (traderData?.accountSize || 0);

  const renderLoadingStages = () => (
    <div className="space-y-3 p-6">
      <div className="flex items-center">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${loadingStage >= 0 ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'}`}>
          {loadingStage > 0 ? <CheckCircle className="h-4 w-4 text-[#00FEFC]" /> : <div className="h-2 w-2 bg-[#00FEFC] rounded-full animate-pulse"></div>}
        </div>
        <span className={`text-sm ${loadingStage >= 0 ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'}`}>[1/4] Configuring parameters</span>
      </div>
      
      <div className="flex items-center">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${loadingStage >= 1 ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'}`}>
          {loadingStage > 1 ? <CheckCircle className="h-4 w-4 text-[#00FEFC]" /> : loadingStage >= 1 ? <div className="h-2 w-2 bg-[#00FEFC] rounded-full animate-pulse"></div> : null}
        </div>
        <span className={`text-sm ${loadingStage >= 1 ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'}`}>[2/4] Calculating probabilities</span>
      </div>
      
      <div className="flex items-center">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${loadingStage >= 2 ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'}`}>
          {loadingStage > 2 ? <CheckCircle className="h-4 w-4 text-[#00FEFC]" /> : loadingStage >= 2 ? <div className="h-2 w-2 bg-[#00FEFC] rounded-full animate-pulse"></div> : null}
        </div>
        <span className={`text-sm ${loadingStage >= 2 ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'}`}>[3/4] Generating trade plan</span>
      </div>
      
      <div className="flex items-center">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${loadingStage >= 3 ? 'bg-[#00FEFC]/20' : 'bg-[#0F1A2A]'}`}>
          {loadingStage > 3 ? <CheckCircle className="h-4 w-4 text-[#00FEFC]" /> : loadingStage >= 3 ? <div className="h-2 w-2 bg-[#00FEFC] rounded-full animate-pulse"></div> : null}
        </div>
        <span className={`text-sm ${loadingStage >= 3 ? 'text-[#00FEFC]' : 'text-[#8A9CB0]'}`}>[4/4] Rendering interface</span>
      </div>
      
      {showSampleData && (
        <div className="mt-6 p-3 border border-[#00FEFC]/30 rounded-md bg-[#00FEFC]/5">
          <p className="text-sm text-[#00FEFC] font-medium">Displaying preliminary data while calculations complete...</p>
        </div>
      )}
    </div>
  );
  
  const renderChartSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-72 mt-4"
    >
      <div className="text-sm font-medium mb-2 font-['Space_Grotesk',sans-serif] text-[#00FEFC]">Equity Curve Forecast</div>
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          boxShadow: ['0 0 10px 0px #00FEFC20', '0 0 20px 3px #00FEFC40', '0 0 10px 0px #00FEFC20'] 
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="h-full w-full bg-gradient-to-b from-[#00FEFC]/5 to-transparent backdrop-blur-sm border border-[#00FEFC]/20 rounded-lg overflow-hidden">
          <ChartContainer
            className="h-full w-full"
            config={{
              average: { color: "#00FEFC" },
              best: { color: "#50FF8D" },
              worst: { color: "#FF50CD" }
            }}
          >
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="bestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#50FF8D" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#50FF8D" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FEFC" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00FEFC" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="worstGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF50CD" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FF50CD" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => value.replace('Day ', '')}
                tick={{ fontSize: 12, fill: '#8A9CB0' }}
                tickCount={5}
                stroke="#8A9CB0"
                strokeOpacity={0.2}
              />
              <YAxis 
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                tick={{ fontSize: 12, fill: '#8A9CB0' }}
                stroke="#8A9CB0"
                strokeOpacity={0.2}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, '']} 
                labelFormatter={(label) => `${label}`}
                contentStyle={{ backgroundColor: '#0F1A2A', borderColor: '#00FEFC50', fontSize: '12px' }}
                itemStyle={{ color: '#FFFFFF' }}
                labelStyle={{ color: '#00FEFC' }}
              />
              <Area 
                type="monotone" 
                dataKey="best" 
                name="Best Case" 
                stroke="#50FF8D" 
                fill="url(#bestGradient)" 
                strokeWidth={2} 
                dot={{ stroke: '#50FF8D', strokeWidth: 1, r: 2, fill: '#50FF8D' }}
              />
              <Area 
                type="monotone" 
                dataKey="average" 
                name="Average" 
                stroke="#00FEFC" 
                fill="url(#avgGradient)" 
                strokeWidth={2.5}
                strokeDasharray="3 3"
                dot={{ stroke: '#00FEFC', strokeWidth: 1, r: 2, fill: '#00FEFC' }}
              />
              <Area 
                type="monotone" 
                dataKey="worst" 
                name="Worst Case" 
                stroke="#FF50CD" 
                fill="url(#worstGradient)" 
                strokeWidth={2} 
                dot={{ stroke: '#FF50CD', strokeWidth: 1, r: 2, fill: '#FF50CD' }}
              />
              <Legend 
                verticalAlign="top" 
                height={24}
                wrapperStyle={{ fontSize: '10px' }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <Card className="border border-[#00FEFC]/20 shadow-lg bg-[#0F1A2A]/80 backdrop-blur-lg overflow-hidden">
        <CardHeader className="pb-2 border-b border-[#00FEFC]/10">
          <CardTitle className="text-xl text-center bg-gradient-to-r from-[#00FEFC] to-[#00FEFC]/70 bg-clip-text text-transparent font-['Space_Grotesk',sans-serif]">
            Challenge Strategy Blueprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#00FEFC]" />
                <span className="ml-3 font-['Space_Grotesk',sans-serif] text-[#00FEFC] animate-pulse">
                  Optimizing your battle plan...
                </span>
              </div>
              {renderLoadingStages()}
              {showSampleData && renderChartSection()}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Strategy Overview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-[#00FEFC]/5 rounded-lg border border-[#00FEFC]/20 backdrop-blur-md"
              >
                <div className="text-lg font-semibold mb-2 font-['Space_Grotesk',sans-serif] text-[#00FEFC]">Your Challenge Blueprint</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Target:</span>
                    <span className="font-medium text-white">{traderData.profitTarget}% in {traderData.passDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Strategy:</span>
                    <span className="font-medium text-white">{metrics.winsNeeded} wins in ~{metrics.tradesNeeded} trades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Risk:</span>
                    <span className="font-medium text-white">{traderData.riskPerTrade}% per trade (${riskAmountDollar.toFixed(0)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Reward:</span>
                    <span className="font-medium text-white">{rewardAmountPct.toFixed(2)}% per win (${rewardAmountDollar.toFixed(0)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Drawdown Risk:</span>
                    <span className="font-medium text-white">{metrics.drawdownRisk.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9CB0]">Pass Probability:</span>
                    <span className="font-medium text-white">{metrics.passProbability}% (Binomial)</span>
                  </div>
                </div>
              </motion.div>

              {/* Equity Curve Chart - Holographic Style */}
              {renderChartSection()}

              {/* Key Metrics Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Trades Needed */}
                  <div className="bg-[#0F1A2A] bg-gradient-to-br from-[#0F1A2A] to-[#152A43] p-4 rounded-lg backdrop-blur-sm border border-[#00FEFC]/10">
                    <div className="text-xs text-[#8A9CB0] font-['Space_Grotesk',sans-serif]">TRADES NEEDED</div>
                    <div className="text-xl font-semibold mt-1 text-white">{Math.ceil(metrics.tradesNeeded)}</div>
                    <div className="text-xs text-[#8A9CB0] mt-1">~{Math.ceil(metrics.tradesNeeded / traderData.passDays)} per day</div>
                  </div>
                  
                  {/* Wins Required */}
                  <div className="bg-[#0F1A2A] bg-gradient-to-br from-[#0F1A2A] to-[#152A43] p-4 rounded-lg backdrop-blur-sm border border-[#00FEFC]/10">
                    <div className="text-xs text-[#8A9CB0] font-['Space_Grotesk',sans-serif]">WINS REQUIRED</div>
                    <div className="text-xl font-semibold mt-1 text-white">{metrics.winsNeeded}</div>
                    <div className="text-xs text-[#8A9CB0] mt-1">{(metrics.winsNeeded * rewardAmountPct).toFixed(1)}% total gain</div>
                  </div>
                  
                  {/* Daily Target */}
                  <div className="bg-[#0F1A2A] bg-gradient-to-br from-[#0F1A2A] to-[#152A43] p-4 rounded-lg backdrop-blur-sm border border-[#00FEFC]/10">
                    <div className="text-xs text-[#8A9CB0] font-['Space_Grotesk',sans-serif]">DAILY TARGET</div>
                    <div className="text-xl font-semibold mt-1 flex items-baseline text-white">
                      {formatCurrency(metrics.dailyTargetAmount)}
                      <span className="text-xs ml-1 text-[#8A9CB0]">
                        ({metrics.dailyTargetPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Pass Probability */}
                  <div className="bg-[#0F1A2A] bg-gradient-to-br from-[#0F1A2A] to-[#152A43] p-4 rounded-lg backdrop-blur-sm border border-[#00FEFC]/10">
                    <div className="text-xs text-[#8A9CB0] font-['Space_Grotesk',sans-serif]">PASS PROBABILITY</div>
                    <div className="text-xl font-semibold mt-1 flex items-center text-white">
                      {metrics.passProbability}%
                      {metrics.passProbability >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-[#50FF8D] ml-1" />
                      ) : metrics.passProbability >= 60 ? (
                        <TrendingUp className="h-4 w-4 text-[#FFD250] ml-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#FF50CD] ml-1" />
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
                  <div className="text-sm font-['Space_Grotesk',sans-serif] text-[#00FEFC]">Challenge Progress</div>
                  <div className="text-sm font-medium text-white">
                    Target: {formatCurrency(traderData.accountSize * traderData.profitTarget / 100)}
                  </div>
                </div>
                <Progress value={100} className="h-1.5 bg-[#152A43]" />
                <div className="flex justify-between text-xs text-[#8A9CB0] mt-1">
                  <span>{formatCurrency(traderData.accountSize)}</span>
                  <span>{formatCurrency(traderData.accountSize * (1 + traderData.profitTarget / 100))}</span>
                </div>
              </motion.div>

              {/* Today's Task */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 p-4 bg-[#00FEFC]/5 rounded-lg border border-[#00FEFC]/20 backdrop-blur-md"
              >
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-[#00FEFC] mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium font-['Space_Grotesk',sans-serif] text-[#00FEFC]">Today's Task</h4>
                    <p className="text-sm mt-1 text-white">
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
