
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { forexPairs } from '@/constants/currencyPairs';

const MaxLotSizeCalculator: React.FC = () => {
  const [accountEquity, setAccountEquity] = useState('10000');
  const [leverage, setLeverage] = useState('30');
  const [customLeverage, setCustomLeverage] = useState('');
  const [asset, setAsset] = useState('EUR/USD');
  const [currentPrice, setCurrentPrice] = useState('1.0000');
  const [contractSize, setContractSize] = useState('100000');
  
  const calculateMaxLotSize = () => {
    const equity = parseFloat(accountEquity);
    const leverageValue = customLeverage ? parseFloat(customLeverage) : parseFloat(leverage);
    const price = parseFloat(currentPrice);
    const contract = parseFloat(contractSize);
    
    if (isNaN(equity) || isNaN(leverageValue) || isNaN(price) || isNaN(contract) || price === 0 || contract === 0) {
      return 0;
    }
    
    return (equity * leverageValue) / (contract * price);
  };

  const maxLotSize = calculateMaxLotSize();
  
  const allPairs = [
    ...(forexPairs.metals || []),
    ...(forexPairs.indices || []),
    ...(forexPairs.crypto || []),
    ...(forexPairs.majors || [])
  ];

  const getDefaultContractSize = (selectedAsset: string) => {
    if (forexPairs.crypto?.includes(selectedAsset)) return '1';
    if (forexPairs.metals?.includes(selectedAsset)) return '100';
    if (forexPairs.indices?.includes(selectedAsset)) return '100';
    return '100000'; // Default for forex pairs
  };

  const handleAssetChange = (newAsset: string) => {
    setAsset(newAsset);
    setContractSize(getDefaultContractSize(newAsset));
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Max Lot Size Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Account Equity ($)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your available trading account balance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              type="number"
              value={accountEquity}
              onChange={(e) => setAccountEquity(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Leverage</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Trading leverage ratio (e.g., 30:1 means 30× leverage)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ToggleGroup 
              type="single" 
              value={customLeverage ? 'custom' : leverage}
              onValueChange={(value) => {
                if (value === 'custom') {
                  setCustomLeverage(leverage);
                } else if (value) {
                  setLeverage(value);
                  setCustomLeverage('');
                }
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="30">30:1</ToggleGroupItem>
              <ToggleGroupItem value="50">50:1</ToggleGroupItem>
              <ToggleGroupItem value="100">100:1</ToggleGroupItem>
              <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
            </ToggleGroup>
            {customLeverage && (
              <Input
                type="number"
                value={customLeverage}
                onChange={(e) => setCustomLeverage(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow mt-2"
                min="1"
                placeholder="Enter custom leverage"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Asset to Trade</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the trading instrument</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={asset} 
              onValueChange={handleAssetChange}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {allPairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Current Price</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current market price of the selected asset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
              min="0.0001"
              step="0.0001"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Contract Size</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Standard contract sizes: Forex (100,000), Indices (100), Crypto (1)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              type="number"
              value={contractSize}
              onChange={(e) => setContractSize(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
              min="1"
            />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 flex flex-col justify-center dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Maximum Lot Size Allowed</h3>
              <p className="text-3xl font-bold text-[#00ff94]">
                {maxLotSize.toFixed(2)} lots
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Formula:</p>
              <p className="font-mono mt-1">
                = (${parseFloat(accountEquity).toLocaleString()} × {customLeverage || leverage}) / ({contractSize} × {currentPrice})
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MaxLotSizeCalculator;
