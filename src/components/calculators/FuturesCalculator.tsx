import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface FuturesContract {
  name: string;
  symbol: string;
  contractSize: number;
  tickSize: number;
  tickValue: number;
  description: string;
}

const FuturesCalculator: React.FC = () => {
  // Contract definitions
  const futuresContracts: Record<string, Record<string, FuturesContract>> = {
    'ES': {
      'Mini': { 
        name: 'E-mini S&P 500',
        symbol: 'ES',
        contractSize: 50,
        tickSize: 0.25,
        tickValue: 12.50,
        description: 'E-mini S&P 500 ($12.50/tick)'
      },
      'Micro': {
        name: 'Micro E-mini S&P 500',
        symbol: 'MES',
        contractSize: 5,
        tickSize: 0.25,
        tickValue: 1.25,
        description: 'Micro E-mini S&P 500 ($1.25/tick)'
      }
    },
    'NQ': {
      'Mini': {
        name: 'E-mini Nasdaq 100',
        symbol: 'NQ',
        contractSize: 20,
        tickSize: 0.25,
        tickValue: 5.00,
        description: 'E-mini Nasdaq 100 ($5.00/tick)'
      },
      'Micro': {
        name: 'Micro E-mini Nasdaq 100',
        symbol: 'MNQ',
        contractSize: 2,
        tickSize: 0.25,
        tickValue: 0.50,
        description: 'Micro E-mini Nasdaq 100 ($0.50/tick)'
      }
    },
    'CL': {
      'Mini': {
        name: 'Crude Oil',
        symbol: 'CL',
        contractSize: 1000,
        tickSize: 0.01,
        tickValue: 10.00,
        description: 'Crude Oil Futures ($10.00/tick)'
      },
      'Micro': {
        name: 'Micro Crude Oil',
        symbol: 'MCL',
        contractSize: 100,
        tickSize: 0.01,
        tickValue: 1.00,
        description: 'Micro Crude Oil ($1.00/tick)'
      }
    }
  };

  const [symbol, setSymbol] = useState('ES');
  const [contractType, setContractType] = useState('Mini');
  const [entryPrice, setEntryPrice] = useState('4500.00');
  const [exitPrice, setExitPrice] = useState('4525.00');
  
  const [ticksGained, setTicksGained] = useState(0);
  const [tickValue, setTickValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  
  const contractOptions = Object.keys(futuresContracts);
  const selectedContract = futuresContracts[symbol][contractType];
  
  useEffect(() => {
    calculateTicks();
  }, [symbol, contractType, entryPrice, exitPrice]);
  
  const calculateTicks = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    
    if (isNaN(entry) || isNaN(exit)) {
      setTicksGained(0);
      setTickValue(0);
      setTotalPnL(0);
      return;
    }
    
    const contract = futuresContracts[symbol][contractType];
    const diff = exit - entry;
    const ticks = diff / contract.tickSize;
    
    setTicksGained(Math.round(ticks * 100) / 100);
    setTickValue(contract.tickValue);
    setTotalPnL(Math.round(ticks * contract.tickValue * 100) / 100);
  };
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Futures Tick Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Contract Type</label>
            <Select 
              defaultValue={contractType} 
              onValueChange={setContractType}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-input/40">
                <SelectItem value="Mini">Mini</SelectItem>
                <SelectItem value="Micro">Micro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2" />
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Futures Symbol</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select 
                      defaultValue={symbol} 
                      onValueChange={setSymbol}
                    >
                      <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                        <SelectValue placeholder="Select symbol" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-input/40">
                        {contractOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {futuresContracts[option][contractType].symbol} - {futuresContracts[option][contractType].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{selectedContract.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Contract Size</label>
              <Input 
                type="text" 
                value={selectedContract.contractSize.toString()}
                readOnly
                className="bg-muted/30 border-input/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tick Size</label>
              <Input 
                type="text" 
                value={selectedContract.tickSize.toString()}
                readOnly
                className="bg-muted/30 border-input/20"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Entry Price</label>
              <Input 
                type="number" 
                step="0.01" 
                value={entryPrice} 
                onChange={(e) => setEntryPrice(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Exit Price</label>
              <Input 
                type="number" 
                step="0.01" 
                value={exitPrice} 
                onChange={(e) => setExitPrice(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-6 border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Result for {selectedContract.symbol}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Ticks Gained/Lost</h3>
              <p className={`text-2xl font-bold ${ticksGained >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                {ticksGained >= 0 ? '+' : ''}{ticksGained.toFixed(2)} ticks
              </p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Tick Value</h3>
              <p className="text-xl font-medium">${tickValue.toFixed(2)} per tick</p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Profit/Loss</h3>
              <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FuturesCalculator;
