
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const CryptoLotSizeCalculator: React.FC = () => {
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLoss, setStopLoss] = useState('1000');
  const [asset, setAsset] = useState('BTCUSD');
  const [lotSize, setLotSize] = useState(0);
  
  const cryptoOptions = ['BTCUSD', 'ETHUSD', 'BNBUSD', 'XRPUSD'];
  
  useEffect(() => {
    calculateLotSize();
  }, [accountSize, riskPercentage, stopLoss, asset]);
  
  const calculateLotSize = () => {
    const accountValue = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage);
    const stop = parseFloat(stopLoss);
    
    if (isNaN(accountValue) || isNaN(risk) || isNaN(stop) || stop === 0) {
      setLotSize(0);
      return;
    }
    
    const riskAmount = accountValue * (risk / 100);
    const calculatedLotSize = riskAmount / stop;
    setLotSize(calculatedLotSize);
  };
  
  return (
    <Card className="neo-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-poppins">Lot Size Calculator</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>1 lot = 1 {asset.substring(0, 3)} for {asset}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Crypto Asset</label>
          <Select defaultValue={asset} onValueChange={setAsset}>
            <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent className="bg-card border-input/40">
              {cryptoOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Account Size (USD)</label>
            <Input 
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Risk Percentage (%)</label>
            <Input 
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Stop Loss (Price Units)</label>
          <Input 
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="bg-secondary/50 border-input/40 input-glow"
            step="1"
          />
        </div>
        
        <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5">
          <h4 className="text-sm text-muted-foreground mb-2">Recommended Lot Size</h4>
          <p className="text-2xl font-bold text-neon-green">{lotSize.toFixed(4)} lots</p>
        </div>
      </div>
    </Card>
  );
};

export default CryptoLotSizeCalculator;
