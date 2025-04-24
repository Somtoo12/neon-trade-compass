
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

interface FuturesContract {
  symbol: string;
  contractSize: number;
  tickSize: number;
  tickValue: number;
}

const FuturesCalculator: React.FC = () => {
  const [symbol, setSymbol] = useState('ES');
  const [entryPrice, setEntryPrice] = useState('4500.00');
  const [exitPrice, setExitPrice] = useState('4525.00');
  
  const [ticksGained, setTicksGained] = useState(0);
  const [tickValue, setTickValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  
  // Sample futures data - in a real app this would be more comprehensive
  const futuresContracts: Record<string, FuturesContract> = {
    'ES': { symbol: 'ES', contractSize: 50, tickSize: 0.25, tickValue: 12.50 },
    'NQ': { symbol: 'NQ', contractSize: 20, tickSize: 0.25, tickValue: 5.00 },
    'CL': { symbol: 'CL', contractSize: 1000, tickSize: 0.01, tickValue: 10.00 },
    'GC': { symbol: 'GC', contractSize: 100, tickSize: 0.10, tickValue: 10.00 },
    'ZB': { symbol: 'ZB', contractSize: 1000, tickSize: 0.03125, tickValue: 31.25 },
  };
  
  const contractOptions = Object.keys(futuresContracts);
  
  useEffect(() => {
    calculateTicks();
  }, [symbol, entryPrice, exitPrice]);
  
  const calculateTicks = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    
    if (isNaN(entry) || isNaN(exit)) {
      setTicksGained(0);
      setTickValue(0);
      setTotalPnL(0);
      return;
    }
    
    const contract = futuresContracts[symbol];
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
            <label className="text-sm text-muted-foreground">Futures Symbol</label>
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
                    {option} - {futuresContracts[option].symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Contract Size</label>
              <Input 
                type="text" 
                value={futuresContracts[symbol].contractSize.toString()}
                readOnly
                className="bg-muted/30 border-input/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tick Size</label>
              <Input 
                type="text" 
                value={futuresContracts[symbol].tickSize.toString()}
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
            <span className="text-sm text-muted-foreground">Result</span>
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
