
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, TrendingUp, Shield, Crosshair, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PassSummaryProps {
  tradesNeeded: number;
  winsNeeded: number;
  passProbability: number;
  requiredWins: number;
  dailyTrades: number;
  isLoading: boolean;
}

const PassSummary: React.FC<PassSummaryProps> = ({
  tradesNeeded,
  winsNeeded,
  passProbability,
  requiredWins,
  dailyTrades,
  isLoading
}) => {
  // Get the combat profile based on risk level
  const getCombatProfile = () => {
    if (dailyTrades <= 1) return { name: "RECON", icon: <Shield className="h-5 w-5" />, color: "text-tactical-neutral" };
    if (dailyTrades <= 3) return { name: "STRIKE", icon: <Crosshair className="h-5 w-5" />, color: "text-tactical-profit" };
    return { name: "SIEGE", icon: <Flame className="h-5 w-5" />, color: "text-tactical-risk" };
  };
  
  // Determine status info based on pass probability
  const getStatusInfo = () => {
    if (passProbability >= 85) return { 
      icon: <CheckCircle className="h-5 w-5 text-tactical-profit" />,
      text: "High probability mission",
      color: "text-tactical-profit" 
    };
    if (passProbability >= 60) return { 
      icon: <TrendingUp className="h-5 w-5 text-amber-400" />,
      text: "Moderate risk operation",
      color: "text-amber-400" 
    };
    return { 
      icon: <AlertTriangle className="h-5 w-5 text-tactical-risk" />,
      text: "High risk engagement",
      color: "text-tactical-risk" 
    };
  };
  
  // Generate binary blocks for visual representation of wins
  const renderBinaryBlocks = () => {
    const blocks = [];
    const totalBlocks = Math.min(10, tradesNeeded);
    
    for (let i = 0; i < totalBlocks; i++) {
      blocks.push(
        <div 
          key={i} 
          className={`binary-indicator ${i < winsNeeded ? 'binary-active' : 'binary-inactive'}`}
        >
          {i < winsNeeded ? '✓' : '·'}
        </div>
      );
    }
    
    return blocks;
  };

  const combatProfile = getCombatProfile();
  const statusInfo = getStatusInfo();
  
  // Calculate the max consecutive losses based on win rate
  const winRate = winsNeeded / tradesNeeded * 100;
  const maxConsecutiveLosses = Math.ceil(Math.log(0.05) / Math.log(1 - winRate/100));
  const riskPerTrade = dailyTrades <= 1 ? 0.5 : dailyTrades <= 3 ? 1.0 : 2.0;
  const maxDrawdown = (maxConsecutiveLosses * riskPerTrade).toFixed(1);

  return (
    <Card className="tactical-panel border-white/10">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="tactical-header text-xl flex items-center tracking-wider">
          <span className="mr-2">>>_</span>
          TACTICAL TRADING TERMINAL
        </div>
        <div className="data-text text-xs text-white/70">v14.5.2050</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4 data-scan-animation">
            <Loader2 className="h-6 w-6 animate-spin text-tactical-profit" />
            <span className="ml-2 data-text text-tactical-profit">
              Calculating tactical parameters...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-2 border border-white/10 bg-black/30 rounded-md">
              <div className="flex items-center">
                <div className={`p-1 rounded-full mr-3 ${statusInfo.color}`}>
                  {statusInfo.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-rajdhani font-bold text-lg">
                      {passProbability}% SUCCESS PROBABILITY
                    </div>
                    <div className={`data-text ${combatProfile.color}`}>
                      {combatProfile.name}
                    </div>
                  </div>
                  <div className="text-xs text-white/70 flex items-center">
                    {statusInfo.text} • {riskPerTrade}% per trade • {dailyTrades} trades/day
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>BATTLE PLAN</span>
                  <span>{winsNeeded}/{tradesNeeded} WINS REQUIRED</span>
                </div>
                <div className="flex gap-1 py-1">
                  {renderBinaryBlocks()}
                </div>
              </div>
              
              <div className="tactical-divider"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 border border-white/10 bg-black/20 rounded-md">
                  <div className="text-xs text-white/70 mb-1">WIN BUFFER</div>
                  <div className="text-xl font-bold font-rajdhani">
                    {Math.max(0, tradesNeeded - winsNeeded)} trades
                  </div>
                </div>
                
                <div className="p-2 border border-white/10 bg-black/20 rounded-md">
                  <div className="text-xs text-white/70 mb-1">MAX DRAWDOWN</div>
                  <div className="text-xl font-bold font-rajdhani text-tactical-risk">
                    {maxDrawdown}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tactical-divider"></div>
            
            <div className="p-3 bg-tactical-profit/5 border border-tactical-profit/30 rounded-md">
              <div className="text-sm font-bold mb-1 text-tactical-profit">TODAY'S ORDERS</div>
              <ul className="space-y-1 text-sm font-rajdhani">
                {dailyTrades >= 1 && (
                  <li className="flex items-start">
                    <div className="h-4 w-4 rounded-full bg-tactical-profit/20 flex items-center justify-center text-xs mr-2 mt-0.5">1</div>
                    <div>06:00 GMT: London breakout trade (RR ≥ {riskPerTrade.toFixed(1)})</div>
                  </li>
                )}
                {dailyTrades >= 2 && (
                  <li className="flex items-start">
                    <div className="h-4 w-4 rounded-full bg-tactical-profit/20 flex items-center justify-center text-xs mr-2 mt-0.5">2</div>
                    <div>13:30 GMT: New York momentum trade</div>
                  </li>
                )}
                {dailyTrades >= 3 && (
                  <li className="flex items-start">
                    <div className="h-4 w-4 rounded-full bg-tactical-profit/20 flex items-center justify-center text-xs mr-2 mt-0.5">3</div>
                    <div>15:30 GMT: Trend continuation setup</div>
                  </li>
                )}
                <li className="flex items-start">
                  <div className="h-4 w-4 rounded-full bg-tactical-risk/20 flex items-center justify-center text-xs mr-2 mt-0.5">!</div>
                  <div className="text-tactical-risk">ABORT if daily drawdown exceeds {riskPerTrade}%</div>
                </li>
              </ul>
            </div>
            
            <div className="text-xs text-center text-white/50 font-rajdhani">
              SYSTEM CALIBRATED • READY FOR DEPLOYMENT
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassSummary;
