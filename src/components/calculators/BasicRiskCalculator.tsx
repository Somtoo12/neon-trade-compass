import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Info, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { forexPairs } from '@/constants/currencyPairs';

const BasicRiskCalculator: React.FC = () => {
  const [pair, setPair] = useState('EUR/USD');
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [maxRiskAmount, setMaxRiskAmount] = useState(0);
  const [recommendedLotSize, setRecommendedLotSize] = useState(0);
  
  const allPairs = [
    ...(forexPairs.metals || []),
    ...(forexPairs.indices || []),
    ...(forexPairs.crypto || []),
    ...(forexPairs.majors || []),
    ...(forexPairs.minors || []),
    ...(forexPairs.exotics || [])
  ];
  
  const filteredPairs = {
    metals: forexPairs.metals ? forexPairs.metals.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    indices: forexPairs.indices ? forexPairs.indices.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    crypto: forexPairs.crypto ? forexPairs.crypto.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    majors: forexPairs.majors ? forexPairs.majors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    minors: forexPairs.minors ? forexPairs.minors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    exotics: forexPairs.exotics ? forexPairs.exotics.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []
  };
  
  useEffect(() => {
    calculateRisk();
  }, [accountSize, riskPercentage, stopLossPips]);
  
  const calculateRisk = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage);
    const pips = parseFloat(stopLossPips);
    
    if (isNaN(account) || isNaN(risk) || isNaN(pips) || pips === 0) {
      setMaxRiskAmount(0);
      setRecommendedLotSize(0);
      return;
    }

    const riskAmount = account * (risk / 100);
    const pipValue = 10; // Standard for major pairs
    const recommendedLot = (riskAmount / (pips * pipValue));
    
    setMaxRiskAmount(riskAmount);
    setRecommendedLotSize(Math.floor(recommendedLot * 100) / 100);
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Basic Risk Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Currency Pair</label>
            <Select 
              value={pair} 
              onValueChange={setPair}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent className="bg-card border-input/40 max-h-[300px]">
                <div className="flex items-center px-3 pb-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search pairs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredPairs.metals && filteredPairs.metals.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Metals</SelectLabel>
                      {filteredPairs.metals.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  {filteredPairs.indices && filteredPairs.indices.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Indices</SelectLabel>
                      {filteredPairs.indices.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  {filteredPairs.crypto && filteredPairs.crypto.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Crypto</SelectLabel>
                      {filteredPairs.crypto.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  {filteredPairs.majors && filteredPairs.majors.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Major Pairs</SelectLabel>
                      {filteredPairs.majors.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  {filteredPairs.minors && filteredPairs.minors.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Minor Pairs</SelectLabel>
                      {filteredPairs.minors.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  {filteredPairs.exotics && filteredPairs.exotics.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Exotic Pairs</SelectLabel>
                      {filteredPairs.exotics.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Account Size (USD)</label>
            <Input 
              type="number" 
              min="0"
              value={accountSize} 
              onChange={(e) => setAccountSize(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Risk Percentage (%)</label>
            <Input 
              type="number" 
              step="0.1"
              min="0.1"
              max="10"
              value={riskPercentage} 
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Stop Loss (pips)</label>
            <Input 
              type="number" 
              min="1"
              value={stopLossPips} 
              onChange={(e) => setStopLossPips(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 flex flex-col justify-center dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Result</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Maximum Risk Amount</h3>
              <p className="text-2xl font-bold text-[#00ff94]">
                ${maxRiskAmount.toFixed(2)} USD
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm text-muted-foreground">Recommended Position Size</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>1 Standard Lot = 100,000 units</p>
                      <p>1 Mini Lot = 10,000 units</p>
                      <p>1 Micro Lot = 1,000 units</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold text-[#00ff94]">{recommendedLotSize.toFixed(2)} lots</p>
              <p className="text-sm text-muted-foreground mt-1">
                ({(recommendedLotSize * 100000).toFixed(0)} units)
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BasicRiskCalculator;
