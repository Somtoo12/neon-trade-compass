
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const CryptoLotSizeCalculator: React.FC = () => {
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLoss, setStopLoss] = useState('500');
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
    <Card className="p-6 bg-card/30 backdrop-blur border-primary/20">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Account Balance</label>
            <div className="relative">
              <Input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
                className="bg-background/95 border-primary/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USD
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Risk Percentage</label>
            <div className="relative">
              <Input
                type="number"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(e.target.value)}
                className="bg-background/95 border-primary/20"
                step="0.1"
                min="0.1"
                max="100"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Crypto Asset</label>
            <Select defaultValue={asset} onValueChange={setAsset}>
              <SelectTrigger className="bg-background/95 border-primary/20">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} (1 lot = 1 {option.substring(0, 3)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Stop Loss Distance</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter your stop loss in price units</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-background/95 border-primary/20"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USD
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-background/95 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Recommended Lot Size</h3>
          <p className="text-2xl font-bold text-primary">
            {lotSize.toFixed(4)} lots
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CryptoLotSizeCalculator;
