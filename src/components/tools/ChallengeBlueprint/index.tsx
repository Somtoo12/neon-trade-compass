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
import InfoCard from './InfoCard';
import { useIsMobile } from '@/hooks/use-mobile';

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
  dailyTargetAmount: number;
  dailyTargetPercent: number;
  drawdownRisk: number;
  passProbability: number;
  equityCurveData: {x: number, y: number}[];
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
      let multiplier = 1.0;
      if (style === 'conservative') multiplier = 1.2;
      if (style === 'aggressive') multiplier = 0.8;
      
      const tradesNeeded = Math.ceil((data.profitTarget / 100 * data.accountSize) / 
        (data.winRate / 100 * data.riskRewardRatio * data.riskPerTrade / 100 * data.accountSize - 
        (1 - data.winRate / 100) * data.riskPerTrade / 100 * data.accountSize));
      
      const dailyTargetAmount = (data.profitTarget / 100 * data.accountSize) / data.passDays;
      const dailyTargetPercent = dailyTargetAmount / data.accountSize * 100;
      
      const drawdownRisk = data.riskPerTrade * Math.sqrt(tradesNeeded) / 10 * multiplier;
      
      let passProbability = Math.min(98, 100 - drawdownRisk * 2);
      if (data.isAccelerated) {
        passProbability = Math.max(30, passProbability - 15);
      }
      
      const equityCurveData = generateEquityCurve(data, style);
      
      setStrategyMetrics({
        tradesNeeded,
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

  const generateEquityCurve = (data: TraderData, style: RiskStyle): {x: number, y: number}[] => {
    const points = [];
    let equity = 100;
    const daysPerPoint = Math.max(1, Math.floor(data.passDays / 20));
    
    let volatility = 0.8;
    if (style === 'conservative') volatility = 0.5;
    if (style === 'aggressive') volatility = 1.2;
    
    for (let i = 0; i <= data.passDays; i += daysPerPoint) {
      const random = Math.random() * volatility - volatility / 2;
      equity += (data.profitTarget / data.passDays) * daysPerPoint + random;
      
      equity = Math.max(95, equity);
      
      points.push({
        x: i,
        y: equity
      });
    }
    
    points.push({
      x: data.passDays,
      y: 100 + data.profitTarget
    });
    
    return points;
  };

  const calculateGoalResults = (inputs: GoalInputs) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const expectedValuePerTrade = (inputs.winRate / 100 * inputs.rewardRiskRatio * inputs.riskPerTrade) - 
                                    ((100 - inputs.winRate) / 100 * inputs.riskPerTrade);
      
      const tradesNeeded = inputs.targetPercent / expectedValuePerTrade;
      
      const dailyTrades = Math.ceil(tradesNeeded / inputs.daysRemaining);
      
      const requiredWins = Math.ceil(tradesNeeded * (inputs.winRate / 100));
      
      let passProbability = Math.min(95, 
        50 + (inputs.winRate - 50) * 1.5 + 
        (inputs.rewardRiskRatio - 1) * 10 - 
        Math.max(0, (2 - inputs.riskPerTrade) * 5)
      );
      
      passProbability = Math.max(1, Math.min(99, passProbability));
      
      setGoalResults({
        tradesNeeded: Math.ceil(tradesNeeded),
        passProbability,
        requiredWins,
        dailyTrades
      });
      
      setIsLoading(false);
      
      toast({
        title: "Pass plan calculated",
        description: `You need about ${Math.ceil(tradesNeeded)} trades with ${requiredWins} wins to reach your target.`,
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
      <InfoCard />
      
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
          Design a realistic strategy to pass any prop firm challenge based on your trading performance data.
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="input" className="text-xs md:text-sm">Trader Profile</TabsTrigger>
          <TabsTrigger value="strategy" disabled={!strategyMetrics} className="text-xs md:text-sm">Strategy Blueprint</TabsTrigger>
          <TabsTrigger value="simulator" disabled={!strategyMetrics} className="text-xs md:text-sm">Adaptive Simulator</TabsTrigger>
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
