
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { ScreenshotButton } from "@/components/ui/screenshot-button";

// Import our sections
import TraderProfileSetup from './TraderProfileSetup';
import StrategyPlan from './StrategyPlan';
import SimulationEngine from './SimulationEngine';
import ExportReview from './ExportReview';
import { RISK_LEVELS, TRADING_STYLES, TIME_COMMITMENTS } from './constants';

export type RiskLevel = 'low' | 'balanced' | 'high';
export type TradingStyle = 'intraday' | 'swing' | 'position' | 'hybrid';
export type TimeCommitment = 'part-time' | 'full-time';
export type StrategyType = 'sniper' | 'scalp-sprint' | 'balanced-day-trader' | 'hybrid';

export interface TraderProfile {
  accountBalance: number;
  targetPercentage: number;
  daysRemaining: number;
  riskLevel: RiskLevel;
  tradingStyle: TradingStyle;
  timeCommitment: TimeCommitment;
  tradesPerDay: number;
}

export interface StrategyDetails {
  strategyType: StrategyType;
  rewardRiskRatio: number;
  riskPerTradePercent: number;
  breakEvenWinRate: number;
  minWinsRequired: number;
  totalTradesEstimate: number;
  confidenceScore: 'low' | 'moderate' | 'high';
}

export interface SimulationState {
  currentBalance: number;
  tradeHistory: Array<{ isWin: boolean; amount: number; balance: number }>;
  winCount: number;
  lossCount: number;
  winStreak: number;
  lossStreak: number;
  maxWinStreak: number;
  maxLossStreak: number;
  isPassed: boolean | null;
}

const ChallengeMasterplan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Main state objects
  const [traderProfile, setTraderProfile] = useState<TraderProfile>(() => {
    const saved = localStorage.getItem('challengeMasterplan_profile');
    return saved ? JSON.parse(saved) : {
      accountBalance: 10000,
      targetPercentage: 10,
      daysRemaining: 14,
      riskLevel: 'balanced' as RiskLevel,
      tradingStyle: 'intraday' as TradingStyle,
      timeCommitment: 'full-time' as TimeCommitment,
      tradesPerDay: 3
    };
  });
  
  const [strategyDetails, setStrategyDetails] = useState<StrategyDetails | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  
  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('challengeMasterplan_profile', JSON.stringify(traderProfile));
  }, [traderProfile]);
  
  // Save strategy to localStorage whenever it changes
  useEffect(() => {
    if (strategyDetails) {
      localStorage.setItem('challengeMasterplan_strategy', JSON.stringify(strategyDetails));
    }
  }, [strategyDetails]);
  
  // Calculate strategy details
  const calculateStrategy = (profile: TraderProfile): void => {
    setIsCalculating(true);
    
    // Simulate a calculation delay for UX
    setTimeout(() => {
      // Determine suggested strategy type based on profile
      let strategyType: StrategyType;
      
      if (profile.tradingStyle === 'intraday' && profile.riskLevel === 'high' && profile.timeCommitment === 'full-time') {
        strategyType = 'scalp-sprint';
      } else if (profile.tradingStyle === 'swing' && profile.riskLevel === 'low') {
        strategyType = 'sniper';
      } else if (profile.tradingStyle === 'hybrid') {
        strategyType = 'hybrid';
      } else {
        strategyType = 'balanced-day-trader';
      }
      
      // Suggested R:R ratio based on risk level
      const rewardRiskRatio = 
        profile.riskLevel === 'low' ? 1.5 :
        profile.riskLevel === 'balanced' ? 2 : 2.5;
      
      // Risk per trade based on risk level
      const riskPerTradePercent = 
        profile.riskLevel === 'low' ? 0.5 :
        profile.riskLevel === 'balanced' ? 1 : 2;
      
      // Break-even win rate calculation: 1 / (1 + R:R)
      const breakEvenWinRate = 1 / (1 + rewardRiskRatio);
      
      // Required profit in absolute terms
      const requiredProfit = profile.accountBalance * (profile.targetPercentage / 100);
      
      // Average profit per winning trade
      const avgWinProfit = profile.accountBalance * (riskPerTradePercent / 100) * rewardRiskRatio;
      
      // Estimated minimum wins (simplified)
      const minWinsRequired = Math.ceil(requiredProfit / avgWinProfit);
      
      // Rough estimate of total trades needed
      const totalTradesEstimate = Math.ceil(minWinsRequired / (1 - breakEvenWinRate));
      
      // Determine confidence score
      let confidenceScore: 'low' | 'moderate' | 'high';
      
      const tradesNeededPerDay = totalTradesEstimate / profile.daysRemaining;
      if (
        tradesNeededPerDay > profile.tradesPerDay * 1.5 || 
        (profile.targetPercentage > 15 && profile.daysRemaining < 10)
      ) {
        confidenceScore = 'low';
      } else if (
        tradesNeededPerDay > profile.tradesPerDay * 0.8 ||
        profile.targetPercentage > 10
      ) {
        confidenceScore = 'moderate';
      } else {
        confidenceScore = 'high';
      }
      
      const newStrategyDetails: StrategyDetails = {
        strategyType,
        rewardRiskRatio,
        riskPerTradePercent,
        breakEvenWinRate: breakEvenWinRate * 100, // Convert to percentage for display
        minWinsRequired,
        totalTradesEstimate,
        confidenceScore
      };
      
      setStrategyDetails(newStrategyDetails);
      
      // Initialize simulation state
      initSimulation(profile, newStrategyDetails);
      
      setIsCalculating(false);
      setActiveTab("strategy");
      
      toast({
        title: "Strategy calculated",
        description: `Your custom challenge strategy has been created.`,
        duration: 3000,
      });
    }, 1500);
  };
  
  // Initialize simulation state
  const initSimulation = (profile: TraderProfile, strategy: StrategyDetails) => {
    setSimulationState({
      currentBalance: profile.accountBalance,
      tradeHistory: [],
      winCount: 0,
      lossCount: 0,
      winStreak: 0,
      lossStreak: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      isPassed: null
    });
  };
  
  // Execute a manual trade in the simulation
  const executeManualTrade = (isWin: boolean) => {
    if (!simulationState || !strategyDetails || !traderProfile) return;
    
    const riskAmount = traderProfile.accountBalance * (strategyDetails.riskPerTradePercent / 100);
    const rewardAmount = riskAmount * strategyDetails.rewardRiskRatio;
    
    let tradeAmount = isWin ? rewardAmount : -riskAmount;
    const newBalance = simulationState.currentBalance + tradeAmount;
    
    const newWinCount = isWin ? simulationState.winCount + 1 : simulationState.winCount;
    const newLossCount = !isWin ? simulationState.lossCount + 1 : simulationState.lossCount;
    
    // Update streaks
    let newWinStreak = isWin ? simulationState.winStreak + 1 : 0;
    let newLossStreak = !isWin ? simulationState.lossStreak + 1 : 0;
    
    const newMaxWinStreak = Math.max(simulationState.maxWinStreak, newWinStreak);
    const newMaxLossStreak = Math.max(simulationState.maxLossStreak, newLossStreak);
    
    // Check if passed
    const targetBalance = traderProfile.accountBalance * (1 + traderProfile.targetPercentage / 100);
    const isPassed = newBalance >= targetBalance ? true : null;
    
    const newTradeHistory = [
      ...simulationState.tradeHistory,
      { isWin, amount: Math.abs(tradeAmount), balance: newBalance }
    ];
    
    setSimulationState({
      currentBalance: newBalance,
      tradeHistory: newTradeHistory,
      winCount: newWinCount,
      lossCount: newLossCount,
      winStreak: newWinStreak,
      lossStreak: newLossStreak,
      maxWinStreak: newMaxWinStreak,
      maxLossStreak: newMaxLossStreak,
      isPassed
    });
    
    // If passed, show toast
    if (isPassed) {
      toast({
        title: "Challenge passed! 🏆",
        description: "Congratulations! You've reached your profit target.",
        duration: 5000,
      });
    }
  };
  
  // Run an auto-simulation of multiple trades
  const runAutoSimulation = (numberOfDays: number) => {
    if (!simulationState || !strategyDetails || !traderProfile) return;
    
    setIsCalculating(true);
    
    // Calculate trades to simulate
    const tradesPerDay = traderProfile.tradesPerDay;
    const totalTrades = numberOfDays * tradesPerDay;
    
    // We'll use a slightly higher win rate than break-even to make progress
    const targetWinRate = strategyDetails.breakEvenWinRate / 100 + 0.1; // Add 10% to break-even
    
    let currentSim = { ...simulationState };
    
    // Simulate trades one by one with small delays
    let tradeCounter = 0;
    
    const simulateTrade = () => {
      if (tradeCounter >= totalTrades) {
        setIsCalculating(false);
        return;
      }
      
      // Generate random outcome based on target win rate
      const isWin = Math.random() < targetWinRate;
      
      const riskAmount = traderProfile.accountBalance * (strategyDetails.riskPerTradePercent / 100);
      const rewardAmount = riskAmount * strategyDetails.rewardRiskRatio;
      
      let tradeAmount = isWin ? rewardAmount : -riskAmount;
      const newBalance = currentSim.currentBalance + tradeAmount;
      
      const newWinCount = isWin ? currentSim.winCount + 1 : currentSim.winCount;
      const newLossCount = !isWin ? currentSim.lossCount + 1 : currentSim.lossCount;
      
      // Update streaks
      let newWinStreak = isWin ? currentSim.winStreak + 1 : 0;
      let newLossStreak = !isWin ? currentSim.lossStreak + 1 : 0;
      
      const newMaxWinStreak = Math.max(currentSim.maxWinStreak, newWinStreak);
      const newMaxLossStreak = Math.max(currentSim.maxLossStreak, newLossStreak);
      
      // Check if passed
      const targetBalance = traderProfile.accountBalance * (1 + traderProfile.targetPercentage / 100);
      const isPassed = newBalance >= targetBalance ? true : currentSim.isPassed;
      
      const newTradeHistory = [
        ...currentSim.tradeHistory,
        { isWin, amount: Math.abs(tradeAmount), balance: newBalance }
      ];
      
      // Update the current simulation state
      currentSim = {
        currentBalance: newBalance,
        tradeHistory: newTradeHistory,
        winCount: newWinCount,
        lossCount: newLossCount,
        winStreak: newWinStreak,
        lossStreak: newLossStreak,
        maxWinStreak: newMaxWinStreak,
        maxLossStreak: newMaxLossStreak,
        isPassed
      };
      
      // Update state occasionally for visual feedback
      if (tradeCounter % 3 === 0 || tradeCounter === totalTrades - 1) {
        setSimulationState({ ...currentSim });
      }
      
      tradeCounter++;
      setTimeout(simulateTrade, 50);
    };
    
    simulateTrade();
  };
  
  // Reset simulation
  const resetSimulation = () => {
    if (strategyDetails && traderProfile) {
      initSimulation(traderProfile, strategyDetails);
      
      toast({
        title: "Simulation reset",
        description: "The simulation has been reset to initial values.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Challenge Masterplan
            </h1>
            <p className="text-muted-foreground mt-1">
              Build your step-by-step strategy to conquer prop firm challenges
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ScreenshotButton 
              targetId="challenge-masterplan-container" 
              filename="challenge-masterplan" 
            />
          </div>
        </div>
      </motion.div>
      
      <div id="challenge-masterplan-container">
        <Card className="bg-card/30 backdrop-blur-sm border border-border/50 shadow-md mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="profile">Trader Profile</TabsTrigger>
              <TabsTrigger value="strategy" disabled={!strategyDetails && !isCalculating}>Strategy Plan</TabsTrigger>
              <TabsTrigger value="simulation" disabled={!simulationState}>Simulation</TabsTrigger>
              <TabsTrigger value="export" disabled={!strategyDetails}>Export & Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6 px-1">
              <TraderProfileSetup 
                traderProfile={traderProfile}
                onProfileChange={setTraderProfile}
                onCalculate={calculateStrategy}
                isCalculating={isCalculating}
              />
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-6 px-1">
              <StrategyPlan 
                traderProfile={traderProfile}
                strategyDetails={strategyDetails}
                isCalculating={isCalculating}
                onNextStep={() => setActiveTab("simulation")}
              />
            </TabsContent>
            
            <TabsContent value="simulation" className="mt-6 px-1">
              <SimulationEngine 
                traderProfile={traderProfile}
                strategyDetails={strategyDetails}
                simulationState={simulationState}
                onManualTrade={executeManualTrade}
                onAutoSimulate={runAutoSimulation}
                onReset={resetSimulation}
                isCalculating={isCalculating}
                onNextStep={() => setActiveTab("export")}
              />
            </TabsContent>
            
            <TabsContent value="export" className="mt-6 px-1">
              <ExportReview 
                traderProfile={traderProfile}
                strategyDetails={strategyDetails}
                simulationState={simulationState}
              />
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-xs text-center text-muted-foreground mt-8">
          <p>This plan is for educational purposes only. Trading outcomes are inherently probabilistic.</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMasterplan;
