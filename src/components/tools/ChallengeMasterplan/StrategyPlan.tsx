
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertTriangle, TrendingUp, Target, Award, ArrowRight } from 'lucide-react';
import type { TraderProfile, StrategyDetails } from './index';
import { STRATEGY_TYPES, CONFIDENCE_LEVELS } from './constants';

interface StrategyPlanProps {
  traderProfile: TraderProfile;
  strategyDetails: StrategyDetails | null;
  isCalculating: boolean;
  onNextStep: () => void;
}

const StrategyPlan: React.FC<StrategyPlanProps> = ({
  traderProfile,
  strategyDetails,
  isCalculating,
  onNextStep
}) => {
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
        <p className="mt-4 text-muted-foreground">Generating your optimal strategy...</p>
      </div>
    );
  }

  if (!strategyDetails) {
    return (
      <div className="text-center py-16">
        <p>Please complete your trader profile first</p>
        <Button onClick={onNextStep} className="mt-4">Next Step</Button>
      </div>
    );
  }
  
  // Generate an equity curve for visualization
  const generateEquityCurve = () => {
    const daysRemaining = traderProfile.daysRemaining;
    const targetPercentage = traderProfile.targetPercentage;
    const points = [];
    
    // Create a slightly curved growth line with some randomness
    const daysPerPoint = Math.max(1, Math.floor(daysRemaining / 20));
    let currentBalance = 100; // Start at 100%
    
    for (let day = 0; day <= daysRemaining; day += daysPerPoint) {
      const progress = day / daysRemaining;
      const targetGrowth = progress * targetPercentage;
      
      // Add some randomness based on risk level
      const volatilityFactor = 
        traderProfile.riskLevel === 'low' ? 0.2 : 
        traderProfile.riskLevel === 'balanced' ? 0.5 : 1.0;
      
      const randomness = (Math.random() - 0.5) * volatilityFactor;
      
      // Ensure we don't go below a realistic minimum
      const balancePoint = Math.max(99, 100 + targetGrowth + randomness);
      
      points.push({
        day,
        balance: balancePoint,
        target: 100 + (targetPercentage * progress)
      });
    }
    
    // Ensure the last point hits exactly the target
    points.push({
      day: daysRemaining,
      balance: 100 + targetPercentage,
      target: 100 + targetPercentage
    });
    
    return points;
  };

  const equityCurveData = generateEquityCurve();
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Convert percentage to decimal for calculations
  const targetDecimal = traderProfile.targetPercentage / 100;
  
  // Calculate absolute values
  const requiredProfit = traderProfile.accountBalance * targetDecimal;
  const riskPerTrade = traderProfile.accountBalance * (strategyDetails.riskPerTradePercent / 100);
  const rewardPerWin = riskPerTrade * strategyDetails.rewardRiskRatio;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Strategy Blueprint</h2>
        <p className="text-muted-foreground mb-6">
          Based on your profile, here's your personalized challenge strategy.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Strategy Overview */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Strategy Overview</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    CONFIDENCE_LEVELS[strategyDetails.confidenceScore].color
                  } bg-secondary/30`}>
                    {CONFIDENCE_LEVELS[strategyDetails.confidenceScore].label} Confidence
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Trades Needed */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                    <div className="text-xl font-semibold mt-1">{Math.ceil(strategyDetails.totalTradesEstimate)}</div>
                  </div>
                  
                  {/* Risk Per Trade */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Risk Per Trade</div>
                    <div className="text-xl font-semibold mt-1 flex items-baseline">
                      {formatCurrency(riskPerTrade)}
                      <span className="text-xs ml-1 text-muted-foreground">
                        ({strategyDetails.riskPerTradePercent}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Win Rate Needed */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Min Wins Needed</div>
                    <div className="text-xl font-semibold mt-1">
                      {strategyDetails.minWinsRequired}
                    </div>
                  </div>
                  
                  {/* Reward:Risk */}
                  <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground">Reward:Risk</div>
                    <div className="text-xl font-semibold mt-1 flex items-center">
                      {strategyDetails.rewardRiskRatio}:1
                      {strategyDetails.rewardRiskRatio >= 2 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                      ) : strategyDetails.rewardRiskRatio >= 1.5 ? (
                        <TrendingUp className="h-4 w-4 text-amber-500 ml-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm">Profit Progress</div>
                    <div className="text-sm font-medium">
                      Target: {formatCurrency(traderProfile.accountBalance * (1 + targetDecimal))}
                    </div>
                  </div>
                  <Progress value={0} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatCurrency(traderProfile.accountBalance)}</span>
                    <span>{formatCurrency(traderProfile.accountBalance * (1 + targetDecimal))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Equity Curve Chart */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Projected Equity Curve</h3>
                
                <div className="h-64">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      balance: {
                        color: "#7b61ff"
                      },
                      target: {
                        color: "#60a5fa"
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={equityCurveData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          tickCount={5}
                          label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${Math.round(value)}%`}
                          tick={{ fontSize: 12 }}
                          domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Account']} 
                          labelFormatter={(label) => `Day ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          name="Your Account"
                          stroke="#7b61ff" 
                          fill="#7b61ff" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="target" 
                          name="Target Path"
                          stroke="#60a5fa" 
                          fill="#60a5fa" 
                          fillOpacity={0.1} 
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Strategy Type */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Strategy</h3>
                
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mb-4">
                  <div className="text-lg font-medium flex items-center">
                    <Target className="h-5 w-5 mr-2 text-accent" />
                    {STRATEGY_TYPES[strategyDetails.strategyType].label}
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    {STRATEGY_TYPES[strategyDetails.strategyType].description}
                  </p>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="text-sm font-medium mb-1">Win Rate Needed</div>
                    <div className="flex items-center">
                      <Progress value={strategyDetails.breakEvenWinRate} className="h-2 flex-1" />
                      <span className="text-sm ml-2 w-10 text-right">
                        {Math.round(strategyDetails.breakEvenWinRate)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Break-even win rate with {strategyDetails.rewardRiskRatio}:1 R:R
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-1">Daily Trade Plan</div>
                    <div className="text-sm">
                      {Math.ceil(strategyDetails.totalTradesEstimate / traderProfile.daysRemaining)} trades per day
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Based on {traderProfile.daysRemaining} days to complete
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Strategy Insights */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Award className="h-5 w-5 text-accent mr-2 mt-0.5" />
                  <h3 className="text-xl font-semibold">Key Insights</h3>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">
                      You need {strategyDetails.minWinsRequired} profitable trades to reach your target.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">
                      Each win at {strategyDetails.rewardRiskRatio}:1 brings you {formatCurrency(rewardPerWin)} closer to your goal.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">
                      Trade frequency: {
                        strategyDetails.totalTradesEstimate / traderProfile.daysRemaining <= traderProfile.tradesPerDay
                          ? "On track with your daily limit."
                          : "Consider increasing your daily trades."
                      }
                    </span>
                  </li>
                  {traderProfile.riskLevel === 'high' && (
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-sm">
                        Your aggressive approach requires disciplined risk management.
                      </span>
                    </li>
                  )}
                </ul>
                
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 mt-4">
                  <div className="text-sm">
                    <span className="font-medium">Confidence Assessment: </span>
                    {CONFIDENCE_LEVELS[strategyDetails.confidenceScore].description}
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
                Continue to Simulation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StrategyPlan;
