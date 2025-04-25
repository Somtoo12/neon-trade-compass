import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { forexPairs } from '@/constants/currencyPairs';

const ForexCalculator: React.FC = () => {
  const [pair, setPair] = useState('EUR/USD');
  const [lotSize, setLotSize] = useState('0.01');
  const [entryPrice, setEntryPrice] = useState('1.10000');
  const [exitPrice, setExitPrice] = useState('1.11000');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  
  const [pipsResult, setPipsResult] = useState(0);
  const [pipValue, setPipValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  
  const allPairs = [
    ...(forexPairs.metals || []),
    ...(forexPairs.indices || []),
    ...(forexPairs.crypto || []),
    ...(forexPairs.majors || []),
    ...(forexPairs.minors || []),
    ...(forexPairs.exotics || [])
  ];
  
  const [searchTerm, setSearchTerm] = useState('');
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
  
  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'NZD', 'CHF'];
  
  useEffect(() => {
    calculatePips();
  }, [pair, lotSize, entryPrice, exitPrice, accountCurrency]);
  
  const getPipDecimal = (pair: string) => {
    if (pair.includes('JPY')) return 0.01;
    return 0.0001;
  };
  
  const calculatePips = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const lot = parseFloat(lotSize);
    
    if (isNaN(entry) || isNaN(exit) || isNaN(lot)) {
      setPipsResult(0);
      setPipValue(0);
      setTotalPnL(0);
      return;
    }
    
    const pipDecimal = getPipDecimal(pair);
    const pipDiff = pair.includes('JPY') 
      ? (exit - entry) / pipDecimal 
      : (exit - entry) / pipDecimal;
    
    let singlePipValue = 0;
    if (pair.includes('JPY')) {
      singlePipValue = 1000 * lot / 100;
    } else {
      singlePipValue = 10 * lot;
    }
    
    const pipValueInAccountCurrency = singlePipValue;
    
    setPipsResult(Math.round(pipDiff * 100) / 100);
    setPipValue(Math.round(pipValueInAccountCurrency * 100) / 100);
    setTotalPnL(Math.round(pipDiff * pipValueInAccountCurrency * 100) / 100);
  };
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Forex Pip Calculator</h2>
      
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
            <label className="text-sm text-muted-foreground">Lot Size</label>
            <Input 
              type="number" 
              step="0.01" 
              min="0.01" 
              value={lotSize} 
              onChange={(e) => setLotSize(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
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
              <label className="text-sm text-muted-foreground">Exit Price</label>
              <Input 
                type="number" 
                step="0.00001" 
                value={exitPrice} 
                onChange={(e) => setExitPrice(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Account Currency</label>
            <Select 
              value={accountCurrency} 
              onValueChange={setAccountCurrency}
            >
              <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-card border-input/40">
                <ScrollArea className="h-[200px]">
                  {currencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 flex flex-col justify-center dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm dark:text-gray-400 light:text-gray-600">Result</span>
            <ArrowRight className="h-4 w-4 dark:text-gray-400 light:text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Pips Gained/Lost</h3>
              <p className={`text-2xl font-bold ${pipsResult >= 0 ? 'text-[#00ff94]' : 'text-red-500'}`}>
                {pipsResult >= 0 ? '+' : ''}{pipsResult.toFixed(1)}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Pip Value</h3>
              <p className="text-xl font-medium dark:text-gray-300 light:text-gray-800">{pipValue.toFixed(2)} {accountCurrency}</p>
            </div>
            
            <div>
              <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Total Profit/Loss</h3>
              <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-[#00ff94]' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} {accountCurrency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ForexCalculator;
