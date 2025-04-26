import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import TraderInputForm from './TraderInputForm';
import StrategyBreakdown from './StrategyBreakdown';
import RiskStyleSelector from './RiskStyleSelector';
import MiniSimulator from './MiniSimulator';
import InsightsPanel from './InsightsPanel';
import ExportTools from './ExportTools';
import GoalCalculator, { GoalInputs } from './GoalCalculator';
import PassSummary from './PassSummary';
// import InfoCard from './InfoCard';
import { useIsMobile } from '@/hooks/use-mobile';
import ProbabilityEngine from './ProbabilityEngine';

export type RiskStyle = 'conservative' | 'balanced' | 'aggressive';
export type TraderData = {
  accountSize: number;
  profitTarget: number;
  passDays: number;
  winRate: number;
  riskRewardRatio: number;
  riskPerTrade: number;
  tradesPerDay: number;
  tradingStrategy?: string;
  isAccelerated?: boolean;
};

export type StrategyMetrics = {
  tradesNeeded: number;
  winsNeeded: number;
  rewardAmount: number;
  dailyTargetAmount: number;
  dailyTargetPercent: number;
  drawdownRisk: number;
  passProbability: number;
  equityCurveData: {
    average: {x: number, y: number}[];
    best: {x: number, y: number}[];
    worst: {x: number, y: number}[];
  };
};

const ChallengeBlueprint: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [traderData, setTraderData] = useState<TraderData | null>(null);
  const [strategyMetrics, setStrategyMetrics] = useState<StrategyMetrics | null>(null);
  const [riskStyle, setRiskStyle] = useState<RiskStyle>('balanced');
  const [activeTab, setActiveTab] = useState('input');
  const [goalInputs, setGoalInputs] = useState<GoalInputs | null>(null);
  const [goalResults, setGoalResults] = useState({
    tradesNeeded: 0,
    winsNeeded: 0,
    passProbability: 0,
    requiredWins: 0,
    dailyTrades: 0
  });
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const savedRiskStyle = localStorage.getItem('challengeBlueprint_riskStyle');
    const savedGoalInputs = localStorage.getItem('challengeBlueprint_goalInputs');
    const savedTraderData = localStorage.getItem('challengeBlueprint_traderData');
    
    if (savedRiskStyle) {
      setRiskStyle(savedRiskStyle as RiskStyle);
    }
    
    if (savedGoalInputs) {
      try {
        const parsedInputs = JSON.parse(savedGoalInputs);
        setGoalInputs(parsedInputs);
        calculateGoalResults(parsedInputs);
      } catch (e) {
        console.error("Error parsing saved goal inputs:", e);
      }
    }
    
    if (savedTraderData) {
      try {
        const parsedData = JSON.parse(savedTraderData);
        setTraderData(parsedData);
      } catch (e) {
        console.error("Error parsing saved trader data:", e);
      }
    }
  }, []);
  
  useEffect(() => {
    if (traderData) {
      calculateStrategyMetrics(traderData, riskStyle);
      
      localStorage.setItem('challengeBlueprint_traderData', JSON.stringify(traderData));
    }
  }, [traderData, riskStyle]);

  useEffect(() => {
    localStorage.setItem('challengeBlueprint_riskStyle', riskStyle);
  }, [riskStyle]);

  const calculateStrategyMetrics = (data: TraderData, style: RiskStyle) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Calculate the reward amount based on risk per trade and reward-to-risk ratio
      const rewardAmount = data.riskPerTrade * data.riskRewardRatio;
      
      // Calculate how many winning trades are needed to hit the profit target
      const targetProfit = data.profitTarget / 100 * data.accountSize;
      const profitPerWin = (rewardAmount / 100) * data.accountSize;
      const winsNeeded = Math.ceil(targetProfit / profitPerWin);
      
      // Calculate expected trades needed based on win rate
      const tradesNeeded = Math.ceil(winsNeeded / (data.winRate / 100));
      
      // Apply risk style adjustments
      let riskMultiplier = 1.0;
      if (style === 'conservative') riskMultiplier = 0.7;
      if (style === 'aggressive') riskMultiplier = 1.5;
      
      // Calculate daily target metrics
      const dailyTargetAmount = (data.profitTarget / 100 * data.accountSize) / data.passDays;
      const dailyTargetPercent = dailyTargetAmount / data.accountSize * 100;
      
      // Calculate drawdown risk using more sophisticated approach
      const maxConsecutiveLosses = Math.ceil(Math.log(0.05) / Math.log(1 - data.winRate / 100)); // 5% chance threshold
      const worstCaseDrawdown = data.riskPerTrade * maxConsecutiveLosses * riskMultiplier;
      const drawdownRisk = Math.min(worstCaseDrawdown, 15); // Cap at reasonable level
      
      // Calculate pass probability using binomial distribution
      const passProbability = calculatePassProbability(data.winRate / 100, tradesNeeded, winsNeeded);
      
      // Generate equity curve data
      const equityCurveData = generateEquityCurves(data, style);
      
      setStrategyMetrics({
        tradesNeeded,
        winsNeeded,
        rewardAmount,
        dailyTargetAmount,
        dailyTargetPercent,
        drawdownRisk,
        passProbability,
        equityCurveData
      });
      
      setIsLoading(false);
      
      if (activeTab === 'input') {
        setActiveTab('strategy');
      }
    }, 800);
  };

  // Calculate pass probability using binomial distribution
  const calculatePassProbability = (winRate: number, trades: number, winsNeeded: number) => {
    // Simplified implementation of binomial CDF
    let probability = 0;
    
    // We want P(X ≥ winsNeeded) = 1 - P(X < winsNeeded)
    for (let i = 0; i < winsNeeded; i++) {
      probability += binomialProbability(trades, i, winRate);
    }
    
    return Math.min(99, Math.max(1, Math.round((1 - probability) * 100)));
  };

  // Calculate binomial probability mass function
  const binomialProbability = (n: number, k: number, p: number) => {
    const combinations = factorial(n) / (factorial(k) * factorial(n - k));
    return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  // Helper function to calculate factorial
  const factorial = (n: number) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const generateEquityCurves = (data: TraderData, style: RiskStyle): {
    average: {x: number, y: number}[];
    best: {x: number, y: number}[];
    worst: {x: number, y: number}[];
  } => {
    const averageCurve: {x: number, y: number}[] = [];
    const bestCurve: {x: number, y: number}[] = [];
    const worstCurve: {x: number, y: number}[] = [];
    
    // Risk multipliers based on style
    let volatility = 1.0;
    if (style === 'conservative') volatility = 0.6;
    if (style === 'aggressive') volatility = 1.6;
    
    // Setup initial points
    averageCurve.push({ x: 0, y: 100 });
    bestCurve.push({ x: 0, y: 100 });
    worstCurve.push({ x: 0, y: 100 });
    
    const winRate = data.winRate / 100;
    const riskPerTrade = data.riskPerTrade;
    const rewardRatio = data.riskRewardRatio;
    
    const expectedDailyReturn = data.tradesPerDay * (
      (winRate * riskPerTrade * rewardRatio) - ((1 - winRate) * riskPerTrade)
    );
    
    const stepsPerDay = 1; // How many points to plot per day
    for (let day = 1; day <= data.passDays; day++) {
      // Average case - follows expected value
      const avgEquity = 100 + (expectedDailyReturn * day);
      
      // Best case - 90th percentile performance
      const bestEquity = 100 + (expectedDailyReturn * day * 1.4) + (day * volatility * 0.3);
      
      // Worst case - 10th percentile performance
      const worstEquity = 100 + (expectedDailyReturn * day * 0.6) - (day * volatility * 0.4);
      
      if (day % stepsPerDay === 0 || day === data.passDays) {
        averageCurve.push({ x: day, y: Math.max(96, avgEquity) });
        bestCurve.push({ x: day, y: Math.max(98, bestEquity) });
        worstCurve.push({ x: day, y: Math.max(90, worstEquity) });
      }
    }
    
    // Ensure final point reaches target
    if (data.passDays > 0) {
      const targetEquity = 100 + data.profitTarget;
      averageCurve[averageCurve.length - 1] = { x: data.passDays, y: targetEquity };
      bestCurve[bestCurve.length - 1] = { x: data.passDays, y: targetEquity + 2 };
      worstCurve[worstCurve.length - 1] = { 
        x: data.passDays, 
        y: Math.max(96, targetEquity - 4) 
      };
    }
    
    return { average: averageCurve, best: bestCurve, worst: worstCurve };
  };

  const calculateGoalResults = (inputs: GoalInputs) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Calculate reward amount
      const rewardAmount = inputs.riskPerTrade * inputs.rewardRiskRatio;
      
      // Calculate how many winning trades needed based on profit target
      const winsNeeded = Math.ceil(inputs.targetPercent / rewardAmount);
      
      // Calculate expected number of trades based on win rate
      const tradesNeeded = Math.ceil(winsNeeded / (inputs.winRate / 100));
      
      const dailyTrades = Math.ceil(tradesNeeded / inputs.daysRemaining);
      
      // Calculate pass probability using binomial distribution
      const passProbability = calculatePassProbability(inputs.winRate / 100, tradesNeeded, winsNeeded);
      
      setGoalResults({
        tradesNeeded: Math.ceil(tradesNeeded),
        winsNeeded,
        passProbability,
        requiredWins: winsNeeded,
        dailyTrades
      });
      
      setIsLoading(false);
      
      toast({
        title: "Pass plan calculated",
        description: `You need ${winsNeeded} wins in about ${tradesNeeded} trades to reach your target.`,
        duration: 3000,
      });
    }, 500);
  };

  const handleSubmit = (data: TraderData) => {
    setTraderData(data);
  };

  const handleRiskStyleChange = (style: RiskStyle) => {
    setRiskStyle(style);
    
    if (goalInputs) {
      let riskValue = 1.0;
      if (style === 'conservative') riskValue = 0.5;
      if (style === 'aggressive') riskValue = 2.0;
      
      const updatedGoalInputs = {
        ...goalInputs,
        riskPerTrade: riskValue
      };
      setGoalInputs(updatedGoalInputs);
      calculateGoalResults(updatedGoalInputs);
    }
    
    if (traderData) {
      let riskValue = 1.0;
      if (style === 'conservative') riskValue = 0.5;
      if (style === 'aggressive') riskValue = 2.0;
      
      const updatedTraderData = {
        ...traderData,
        riskPerTrade: riskValue
      };
      setTraderData(updatedTraderData);
    }
  };
  
  const handleRiskPerTradeChange = (value: number) => {
    if (goalInputs) {
      const updatedGoalInputs = {
        ...goalInputs,
        riskPerTrade: value
      };
      setGoalInputs(updatedGoalInputs);
      calculateGoalResults(updatedGoalInputs);
    }
    
    if (traderData) {
      const updatedTraderData = {
        ...traderData,
        riskPerTrade: value
      };
      setTraderData(updatedTraderData);
    }
  };

  const handleGoalCalculate = (inputs: GoalInputs) => {
    setGoalInputs(inputs);
    calculateGoalResults(inputs);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            Challenge Masterplan
          </h1>
          <div className="text-sm px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
            Prop Pass Strategist
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Design a bulletproof strategy to pass any prop firm challenge based on mathematical precision and your trading performance.
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="input" className="text-xs md:text-sm">Trader Profile</TabsTrigger>
          <TabsTrigger value="strategy" disabled={!strategyMetrics} className="text-xs md:text-sm">Strategy Blueprint</TabsTrigger>
          <TabsTrigger value="simulator" disabled={!strategyMetrics} className="text-xs md:text-sm">Adaptive Simulator</TabsTrigger>
          <TabsTrigger value="probability" disabled={!strategyMetrics} className="text-xs md:text-sm">Probability Engine</TabsTrigger>
          <TabsTrigger value="export" disabled={!strategyMetrics} className="text-xs md:text-sm">Export & Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <TraderInputForm onSubmit={handleSubmit} initialData={traderData} />
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <GoalCalculator 
                onCalculate={handleGoalCalculate}
                initialData={goalInputs}
              />
              
              {goalInputs && (
                <PassSummary 
                  tradesNeeded={goalResults.tradesNeeded}
                  winsNeeded={goalResults.winsNeeded}
                  passProbability={goalResults.passProbability}
                  requiredWins={goalResults.requiredWins}
                  dailyTrades={goalResults.dailyTrades}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="strategy">
          {strategyMetrics && traderData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StrategyBreakdown 
                  metrics={strategyMetrics} 
                  traderData={traderData}
                  isLoading={isLoading} 
                />
              </div>
              <div>
                <RiskStyleSelector 
                  currentStyle={riskStyle} 
                  onStyleChange={handleRiskStyleChange} 
                  metrics={strategyMetrics}
                  onRiskPerTradeChange={handleRiskPerTradeChange}
                />
                <div className="mt-6">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="simulator">
          {strategyMetrics && traderData && (
            <MiniSimulator 
              traderData={traderData}
              riskStyle={riskStyle}
              initialMetrics={strategyMetrics}
            />
          )}
        </TabsContent>

        <TabsContent value="probability">
          {strategyMetrics && traderData && (
            <ProbabilityEngine
              traderData={traderData}
              metrics={strategyMetrics}
              riskStyle={riskStyle}
            />
          )}
        </TabsContent>
        
        <TabsContent value="export">
          {strategyMetrics && traderData && (
            <ExportTools 
              traderData={traderData}
              metrics={strategyMetrics}
              riskStyle={riskStyle}
            />
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-xs text-center text-muted-foreground">
        <p>This masterplan is for educational use only. PipCraft is not responsible for trading outcomes.</p>
      </div>
    </div>
  );
};

export default ChallengeBlueprint;
