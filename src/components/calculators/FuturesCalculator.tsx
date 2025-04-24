
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { futuresContracts } from '@/constants/currencyPairs';

interface FuturesContract {
  name: string;
  symbol: string;
  contractSize: number;
  tickSize: number;
  tickValue: number;
  description: string;
}

const FuturesCalculator: React.FC = () => {
  // Get all available symbols that have at least one contract type
  const availableSymbols = Object.keys(futuresContracts);
  const initialSymbol = availableSymbols[0] || 'ES';
  
  // For the selected symbol, determine available contract types
  const getContractTypes = (sym: string) => {
    if (!futuresContracts[sym]) return [];
    return Object.keys(futuresContracts[sym]);
  };
  
  // Initialize with first symbol and its first available contract type
  const [symbol, setSymbol] = useState(initialSymbol);
  const initialContractTypes = getContractTypes(initialSymbol);
  const initialContractType = initialContractTypes.length > 0 ? initialContractTypes[0] : 'Mini';
  const [contractType, setContractType] = useState(initialContractType);
  
  const [entryPrice, setEntryPrice] = useState('4500.00');
  const [exitPrice, setExitPrice] = useState('4525.00');
  
  const [ticksGained, setTicksGained] = useState(0);
  const [tickValue, setTickValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  
  // Handle symbol change to ensure valid contract type is selected
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    const contractTypes = getContractTypes(newSymbol);
    // If current contract type isn't available for new symbol, use the first available
    if (!contractTypes.includes(contractType)) {
      setContractType(contractTypes[0] || '');
    }
  };
  
  // Safely get the selected contract
  const getSelectedContract = () => {
    if (futuresContracts[symbol] && futuresContracts[symbol][contractType]) {
      return futuresContracts[symbol][contractType];
    }
    return {
      name: 'Unknown',
      symbol: 'N/A',
      contractSize: 0,
      tickSize: 0.01,
      tickValue: 0,
      description: 'Contract not available'
    };
  };
  
  const selectedContract = getSelectedContract();
  
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
    
    const contract = getSelectedContract();
    const diff = exit - entry;
    const ticks = diff / contract.tickSize;
    
    setTicksGained(Math.round(ticks * 100) / 100);
    setTickValue(contract.tickValue);
    setTotalPnL(Math.round(ticks * contract.tickValue * 100) / 100);
  };
  
  // Get available contract types for current symbol
  const availableContractTypes = getContractTypes(symbol);
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Futures Tick Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Futures Symbol</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select 
                      value={symbol} 
                      onValueChange={handleSymbolChange}
                    >
                      <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                        <SelectValue placeholder="Select symbol" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-input/40">
                        {availableSymbols.map((sym) => (
                          <SelectItem key={sym} value={sym}>
                            {sym} - {Object.values(futuresContracts[sym])[0].name}
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
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Contract Type</label>
            <Select 
              value={contractType} 
              onValueChange={setContractType}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-input/40">
                {availableContractTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2" />
          
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
