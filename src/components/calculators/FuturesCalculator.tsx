import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useContractFilter } from '@/hooks/useContractFilter';

const FuturesCalculator: React.FC = () => {
  const { searchTerm, setSearchTerm, groupedContracts } = useContractFilter();
  const [symbol, setSymbol] = useState('ES');
  const [contractType, setContractType] = useState('Mini');
  const [entryPrice, setEntryPrice] = useState('4500.00');
  const [exitPrice, setExitPrice] = useState('4525.00');
  
  const [ticksGained, setTicksGained] = useState(0);
  const [tickValue, setTickValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    const contract = futuresContracts[newSymbol];
    if (contract) {
      const availableTypes = Object.keys(contract);
      if (!availableTypes.includes(contractType)) {
        setContractType(availableTypes[0]);
      }
    }
  };
  
  const getSelectedContract = () => {
    const contract = futuresContracts[symbol]?.[contractType];
    if (!contract) return null;
    return contract;
  };

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

  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Futures Tick Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Futures Symbol</label>
            <Select 
              value={symbol} 
              onValueChange={handleSymbolChange}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent className="bg-card border-input/40">
                <div className="flex items-center px-3 pb-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search contracts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
                <ScrollArea className="h-[300px]">
                  <SelectGroup>
                    <SelectLabel>Indices</SelectLabel>
                    {Object.entries(groupedContracts.indices).map(([sym, contract]) => (
                      <SelectItem key={sym} value={sym}>
                        {sym} - {Object.values(contract)[0].name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Commodities</SelectLabel>
                    {Object.entries(groupedContracts.commodities).map(([sym, contract]) => (
                      <SelectItem key={sym} value={sym}>
                        {sym} - {Object.values(contract)[0].name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Bonds</SelectLabel>
                    {Object.entries(groupedContracts.bonds).map(([sym, contract]) => (
                      <SelectItem key={sym} value={sym}>
                        {sym} - {Object.values(contract)[0].name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
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
                {Object.keys(futuresContracts[symbol] || {}).map((type) => (
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
