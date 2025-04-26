
import React, { useState, useEffect, useCallback } from 'react';
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
import InfoCard from './InfoCard';
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
  const [calculationAttempts, setCalculationAttempts] = useState(0);
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

  const handleForceRefresh = useCallback(() => {
    if (!traderData) return;
    
    setCalculationAttempts(prev => prev + 1);
    setIsLoading(true);
    toast({
      title: "Recalculating strategy",
      description: "Refreshing your challenge blueprint...",
      duration: 2000,
    });
    
    // Force recalculation with a slight delay
    setTimeout(() => {
      calculateStrategyMetrics(traderData, riskStyle, true);
    }, 500);
  }, [traderData, riskStyle]);

  const calculateStrategyMetrics = (data: TraderData, style: RiskStyle, isForceRefresh = false) => {
    setIsLoading(true);
    
    // Create calculation timeout - circuit breaker pattern
    const calculationTimeout = setTimeout(() => {
      if (isLoading) {
        toast({
          title: "Strategic recalibration needed",
          description: "Try adjusting your risk profile or force refresh.",
          duration: 5000,
        });
      }
    }, 8000);
    
    setTimeout(() => {
      try {
        const rewardAmount = data.riskPerTrade * data.riskRewardRatio;
        
        const targetProfit = data.profitTarget / 100 * data.accountSize;
        const profitPerWin = (rewardAmount / 100) * data.accountSize;
        const winsNeeded = Math.ceil(targetProfit / profitPerWin);
        
        const tradesNeeded = Math.ceil(winsNeeded / (data.winRate / 100));
        
        let riskValue: number;
        if (style === 'conservative') riskValue = 0.5;
        else if (style === 'balanced') riskValue = 1.5;
        else riskValue = 3.0;
        
        const updatedData = {
          ...data,
          riskPerTrade: riskValue
        };
        
        const dailyTargetAmount = (data.profitTarget / 100 * data.accountSize) / data.passDays;
        const dailyTargetPercent = dailyTargetAmount / data.accountSize * 100;
        
        const maxConsecutiveLosses = Math.ceil(Math.log(0.05) / Math.log(1 - data.winRate / 100));
        let worstCaseDrawdown = 0;
        
        if (style === 'conservative') worstCaseDrawdown = 0.5 * maxConsecutiveLosses;
        else if (style === 'balanced') worstCaseDrawdown = 1.5 * maxConsecutiveLosses;
        else worstCaseDrawdown = 3.0 * maxConsecutiveLosses;
        
        const drawdownRisk = Math.min(worstCaseDrawdown, 15);
        
        const passProbability = calculatePassProbability(data.winRate / 100, tradesNeeded, winsNeeded);
        
        const equityCurveData = generateEquityCurves(updatedData, style, isForceRefresh || calculationAttempts > 1);
        
        clearTimeout(calculationTimeout);
        
        // Update strategy metrics state with all calculated values
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
        
        setTraderData(updatedData);
        
        setIsLoading(false);
        
        if (activeTab === 'input') {
          setActiveTab('strategy');
        }
      } catch (error) {
        console.error("Error in calculations:", error);
        clearTimeout(calculationTimeout);
        setIsLoading(false);
        toast({
          title: "Calculation error",
          description: "We encountered an error. Please try adjusting your inputs.",
          duration: 5000,
        });
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

  const generateEquityCurves = (data: TraderData, style: RiskStyle, addRandomness = false): {
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
    
    // Random variance to prevent identical curves when forcing refresh
    const randomFactor = addRandomness ? Math.random() * 0.3 + 0.85 : 1.0;  
    
    const stepsPerDay = 1;
    for (let day = 1; day <= data.passDays; day++) {
      // Add a tiny bit of controlled randomness if requested (for forced refreshes)
      const dailyRandomness = addRandomness ? (Math.random() - 0.5) * 0.7 : 0;
      
      const avgEquity = 100 + (expectedDailyReturn * day * randomFactor) + (addRandomness ? dailyRandomness : 0);
      const bestEquity = 100 + (expectedDailyReturn * day * 1.4) + (day * volatility * 0.3) + (addRandomness ? dailyRandomness * 2 : 0);
      const worstEquity = 100 + (expectedDailyReturn * day * 0.6) - (day * volatility * 0.4) + (addRandomness ? dailyRandomness / 2 : 0);
      
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
        const rewardAmount = inputs.riskPerTrade * inputs.rewardRiskRatio;
        
        const winsNeeded = Math.ceil(inputs.targetPercent / rewardAmount);
        
        const tradesNeeded = Math.ceil(winsNeeded / (inputs.winRate / 100));
        
        const dailyTrades = Math.ceil(tradesNeeded / inputs.daysRemaining);
        
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
      } catch (error) {
        console.error("Error in goal calculations:", error);
        setIsLoading(false);
        toast({
          title: "Calculation error",
          description: "We encountered an error. Please try adjusting your inputs.",
          duration: 3000,
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
      let riskValue: number;
      if (style === 'conservative') riskValue = 0.5;
      else if (style === 'balanced') riskValue = 1.5;
      else riskValue = 3.0;
      
      const updatedGoalInputs = {
        ...goalInputs,
        riskPerTrade: riskValue
      };
      setGoalInputs(updatedGoalInputs);
      calculateGoalResults(updatedGoalInputs);
    }
    
    if (traderData) {
      let riskValue: number;
      if (style === 'conservative') riskValue = 0.5;
      else if (style === 'balanced') riskValue = 1.5;
      else riskValue = 3.0;
      
      const updatedTraderData = {
        ...traderData,
        riskPerTrade: riskValue
      };
      setTraderData(updatedTraderData);
    }
  };
  
  const handleRiskPerTradeChange = (value: number) => {
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
      <InfoCard />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FEFC] via-[#50FF8D] to-[#FF50CD] bg-clip-text text-transparent font-['Space_Grotesk',sans-serif]">
            Challenge Masterplan
          </h1>
          <div className="text-sm px-3 py-1 bg-[#00FEFC]/10 border border-[#00FEFC]/30 rounded-full text-[#00FEFC]">
            Prop Pass Strategist 2050
          </div>
        </div>
        
        <p className="text-[#8A9CB0] mb-8">
          Design a bulletproof strategy to pass any prop firm challenge based on mathematical precision and your trading performance.
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 bg-[#0F1A2A] border border-[#00FEFC]/20">
          <TabsTrigger value="input" className="text-xs md:text-sm data-[state=active]:bg-[#00FEFC]/20 data-[state=active]:text-[#00FEFC]">Trader Profile</TabsTrigger>
          <TabsTrigger value="strategy" disabled={!strategyMetrics} className="text-xs md:text-sm data-[state=active]:bg-[#00FEFC]/20 data-[state=active]:text-[#00FEFC]">Strategy Blueprint</TabsTrigger>
          <TabsTrigger value="simulator" disabled={!strategyMetrics} className="text-xs md:text-sm data-[state=active]:bg-[#00FEFC]/20 data-[state=active]:text-[#00FEFC]">Adaptive Simulator</TabsTrigger>
          <TabsTrigger value="probability" disabled={!strategyMetrics} className="text-xs md:text-sm data-[state=active]:bg-[#00FEFC]/20 data-[state=active]:text-[#00FEFC]">Probability Engine</TabsTrigger>
          <TabsTrigger value="export" disabled={!strategyMetrics} className="text-xs md:text-sm data-[state=active]:bg-[#00FEFC]/20 data-[state=active]:text-[#00FEFC]">Export Blueprint</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#00FEFC]/20 shadow-lg bg-[#0F1A2A]/80 backdrop-blur-lg">
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
          {(strategyMetrics || isLoading) && traderData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StrategyBreakdown 
                  metrics={strategyMetrics!} 
                  traderData={traderData}
                  isLoading={isLoading} 
                />
              </div>
              <div>
                <RiskStyleSelector 
                  currentStyle={riskStyle} 
                  onStyleChange={handleRiskStyleChange} 
                  metrics={strategyMetrics || {
                    tradesNeeded: 0,
                    winsNeeded: 0,
                    rewardAmount: 0,
                    dailyTargetAmount: 0,
                    dailyTargetPercent: 0,
                    drawdownRisk: 0,
                    passProbability: 0,
                    equityCurveData: {
                      average: [],
                      best: [],
                      worst: []
                    }
                  }}
                  onRiskPerTradeChange={handleRiskPerTradeChange}
                  onForceRefresh={handleForceRefresh}
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
      
      <div className="mt-12 text-xs text-center text-[#8A9CB0]">
        <p>This masterplan is for educational use only. PipCraft is not responsible for trading outcomes.</p>
      </div>
    </div>
  );
};

export default ChallengeBlueprint;
