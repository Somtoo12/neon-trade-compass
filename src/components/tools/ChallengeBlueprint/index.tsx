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
import BlueprintSummary from './BlueprintSummary';
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
      const rewardAmount = data.riskPerTrade * data.riskRewardRatio;
      
      const targetProfit = data.profitTarget / 100 * data.accountSize;
      const profitPerWin = (rewardAmount / 100) * data.accountSize;
      const winsNeeded = Math.ceil(targetProfit / profitPerWin);
      
      const tradesNeeded = Math.ceil(winsNeeded / (data.winRate / 100));
      
      let riskMultiplier = 1.0;
      if (style === 'conservative') riskMultiplier = 0.7;
      if (style === 'aggressive') riskMultiplier = 1.5;
      
      const dailyTargetAmount = (data.profitTarget / 100 * data.accountSize) / data.passDays;
      const dailyTargetPercent = dailyTargetAmount / data.accountSize * 100;
      
      const maxConsecutiveLosses = Math.ceil(Math.log(0.05) / Math.log(1 - data.winRate / 100));
      const worstCaseDrawdown = data.riskPerTrade * maxConsecutiveLosses * riskMultiplier;
      const drawdownRisk = Math.min(worstCaseDrawdown, 15);
      
      const passProbability = calculatePassProbability(data.winRate / 100, tradesNeeded, winsNeeded);
      
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

  const calculatePassProbability = (winRate: number, trades: number, winsNeeded: number) => {
    let probability = 0;
    
    for (let i = 0; i < winsNeeded; i++) {
      probability += binomialProbability(trades, i, winRate);
    }
    
    return Math.min(99, Math.max(1, Math.round((1 - probability) * 100)));
  };

  const binomialProbability = (n: number, k: number, p: number) => {
    const combinations = factorial(n) / (factorial(k) * factorial(n - k));
    return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

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
    
    let volatility = 1.0;
    if (style === 'conservative') volatility = 0.6;
    if (style === 'aggressive') volatility = 1.6;
    
    averageCurve.push({ x: 0, y: 100 });
    bestCurve.push({ x: 0, y: 100 });
    worstCurve.push({ x: 0, y: 100 });
    
    const winRate = data.winRate / 100;
    const riskPerTrade = data.riskPerTrade;
    const rewardRatio = data.riskRewardRatio;
    
    const expectedDailyReturn = data.tradesPerDay * (
      (winRate * riskPerTrade * rewardRatio) - ((1 - winRate) * riskPerTrade)
    );
    
    const stepsPerDay = 1;
    for (let day = 1; day <= data.passDays; day++) {
      const avgEquity = 100 + (expectedDailyReturn * day);
      
      const bestEquity = 100 + (expectedDailyReturn * day * 1.4) + (day * volatility * 0.3);
      
      const worstEquity = 100 + (expectedDailyReturn * day * 0.6) - (day * volatility * 0.4);
      
      if (day % stepsPerDay === 0 || day === data.passDays) {
        averageCurve.push({ x: day, y: Math.max(96, avgEquity) });
        bestCurve.push({ x: day, y: Math.max(98, bestEquity) });
        worstCurve.push({ x: day, y: Math.max(90, worstEquity) });
      }
    }
    
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
      try {
        const rewardAmount = (inputs.riskPerTrade || 1) * (inputs.rewardRiskRatio || 1.5);
        
        const targetPercent = inputs.targetPercent || 10;
        const winsNeeded = Math.ceil(targetPercent / rewardAmount);
        
        const winRate = inputs.winRate || 50;
        const tradesNeeded = Math.ceil(winsNeeded / (winRate / 100));
        
        const daysRemaining = inputs.daysRemaining || 14;
        const dailyTrades = Math.ceil(tradesNeeded / daysRemaining);
        
        const passProbability = calculatePassProbability(winRate / 100, tradesNeeded, winsNeeded);
        
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
      } catch (error) {
        console.error("Error calculating goal results:", error);
        setIsLoading(false);
        toast({
          title: "Calculation Error",
          description: "There was a problem processing your request. Please check your inputs.",
          variant: "destructive",
        });
      }
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
    try {
      if (typeof value !== 'number' || isNaN(value)) {
        console.error("Invalid risk per trade value:", value);
        return;
      }
      
      const safeValue = Math.max(0.1, Math.min(5, value));
      
      if (goalInputs) {
        const updatedGoalInputs = {
          ...goalInputs,
          riskPerTrade: safeValue
        };
        setGoalInputs(updatedGoalInputs);
        
        try {
          calculateGoalResults(updatedGoalInputs);
        } catch (error) {
          console.error("Error calculating goal results:", error);
          toast({
            title: "Calculation Error",
            description: "There was a problem processing your request. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      if (traderData) {
        const updatedTraderData = {
          ...traderData,
          riskPerTrade: safeValue
        };
        setTraderData(updatedTraderData);
      }
    } catch (error) {
      console.error("Error in handleRiskPerTradeChange:", error);
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
                <BlueprintSummary
                  risk={traderData.riskPerTrade}
                  reward={strategyMetrics.rewardAmount}
                  drawdown={strategyMetrics.drawdownRisk}
                  successRate={strategyMetrics.passProbability}
                  accountSize={traderData.accountSize}
                />
                <div className="mt-6">
                  <StrategyBreakdown 
                    metrics={strategyMetrics} 
                    traderData={traderData}
                    isLoading={isLoading} 
                  />
                </div>
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
