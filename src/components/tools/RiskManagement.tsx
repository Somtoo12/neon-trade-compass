
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RiskManagement: React.FC = () => {
  // Basic Risk Calculator
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('50');
  const [recommendedLotSize, setRecommendedLotSize] = useState(0);

  // Advanced Position Calculator
  const [advAccountBalance, setAdvAccountBalance] = useState('10000');
  const [leverage, setLeverage] = useState('100');
  const [entryPrice, setEntryPrice] = useState('1.10000');
  const [stopLossPrice, setStopLossPrice] = useState('1.09500');
  const [riskReward, setRiskReward] = useState('2');
  const [pair, setPair] = useState('EUR/USD');
  const [advLotSize, setAdvLotSize] = useState(0);
  const [potentialLoss, setPotentialLoss] = useState(0);
  const [potentialProfit, setPotentialProfit] = useState(0);

  const pairOptions = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 
    'USD/CAD', 'NZD/USD', 'USD/CHF', 'EUR/GBP'
  ];

  useEffect(() => {
    calculateBasicRisk();
  }, [accountSize, riskPercentage, stopLossPips]);

  useEffect(() => {
    calculateAdvancedPosition();
  }, [advAccountBalance, leverage, entryPrice, stopLossPrice, riskReward, pair]);

  const calculateBasicRisk = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage);
    const pips = parseFloat(stopLossPips);
    
    if (isNaN(account) || isNaN(risk) || isNaN(pips) || pips === 0) {
      setRecommendedLotSize(0);
      return;
    }

    const riskAmount = account * (risk / 100);
    const pipValue = 10; // Simplified - standard for major pairs, would need adjustment
    const recommendedLot = (riskAmount / (pips * pipValue));
    
    setRecommendedLotSize(Math.floor(recommendedLot * 100) / 100);
  };

  const calculateAdvancedPosition = () => {
    const balance = parseFloat(advAccountBalance);
    const lev = parseFloat(leverage);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLossPrice);
    const ratio = parseFloat(riskReward);
    
    if (isNaN(balance) || isNaN(lev) || isNaN(entry) || isNaN(stop) || isNaN(ratio) || entry === stop) {
      setAdvLotSize(0);
      setPotentialLoss(0);
      setPotentialProfit(0);
      return;
    }

    // Simplified calculation for demonstration
    const pipDifference = Math.abs(entry - stop) * 10000; // Convert to pips
    const riskAmount = balance * 0.01; // 1% risk
    
    // Each pip in standard lot = $10 for most pairs
    const pipValue = 10; 
    
    const lotSize = (riskAmount / (pipDifference * pipValue));
    const loss = riskAmount;
    const profit = loss * ratio;
    
    setAdvLotSize(Math.floor(lotSize * 100) / 100);
    setPotentialLoss(-loss);
    setPotentialProfit(profit);
  };

  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Risk Management Tools</h2>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic">Basic Risk Calculator</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Position Sizing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Account Size</label>
                <Input 
                  type="number" 
                  value={accountSize} 
                  onChange={(e) => setAccountSize(e.target.value)}
                  className="bg-secondary/50 border-input/40 input-glow"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Risk Percentage per Trade (%)</label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="5"
                  value={riskPercentage} 
                  onChange={(e) => setRiskPercentage(e.target.value)}
                  className="bg-secondary/50 border-input/40 input-glow"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Stop Loss in Pips</label>
                <Input 
                  type="number" 
                  min="1"
                  value={stopLossPips} 
                  onChange={(e) => setStopLossPips(e.target.value)}
                  className="bg-secondary/50 border-input/40 input-glow"
                />
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Result</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Recommended Lot Size</h3>
                <p className="text-3xl font-bold text-neon-blue">
                  {recommendedLotSize.toFixed(2)} lots
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Risk amount: {(parseFloat(accountSize) * parseFloat(riskPercentage) / 100).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Account Balance</label>
                  <Input 
                    type="number" 
                    value={advAccountBalance} 
                    onChange={(e) => setAdvAccountBalance(e.target.value)}
                    className="bg-secondary/50 border-input/40 input-glow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Leverage</label>
                  <Input 
                    type="number" 
                    value={leverage} 
                    onChange={(e) => setLeverage(e.target.value)}
                    className="bg-secondary/50 border-input/40 input-glow"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Currency Pair</label>
                <Select 
                  defaultValue={pair} 
                  onValueChange={setPair}
                >
                  <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-input/40">
                    {pairOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Entry Price</label>
                  <Input 
                    type="number" 
                    step="0.00001"
                    value={entryPrice} 
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="bg-secondary/50 border-input/40 input-glow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Stop Loss Price</label>
                  <Input 
                    type="number" 
                    step="0.00001"
                    value={stopLossPrice} 
                    onChange={(e) => setStopLossPrice(e.target.value)}
                    className="bg-secondary/50 border-input/40 input-glow"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Risk:Reward Ratio</label>
                <Input 
                  type="number" 
                  step="0.1"
                  min="0.5"
                  value={riskReward} 
                  onChange={(e) => setRiskReward(e.target.value)}
                  className="bg-secondary/50 border-input/40 input-glow"
                />
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Result</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Suggested Lot Size</h3>
                  <p className="text-3xl font-bold text-neon-blue">{advLotSize.toFixed(2)} lots</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Potential Loss</h3>
                    <p className="text-xl font-bold text-red-500">
                      {potentialLoss.toFixed(2)} USD
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Potential Profit</h3>
                    <p className="text-xl font-bold text-neon-green">
                      {potentialProfit.toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RiskManagement;
