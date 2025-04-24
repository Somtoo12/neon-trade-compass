
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

const CryptoCalculator: React.FC = () => {
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState('1');
  const [buyPrice, setBuyPrice] = useState('30000');
  const [sellPrice, setSellPrice] = useState('32000');
  
  const [profitLossUsd, setProfitLossUsd] = useState(0);
  const [profitLossCrypto, setProfitLossCrypto] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  
  const cryptoOptions = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE'];
  
  useEffect(() => {
    calculate();
  }, [asset, amount, buyPrice, sellPrice]);
  
  const calculate = () => {
    const amountValue = parseFloat(amount);
    const buyPriceValue = parseFloat(buyPrice);
    const sellPriceValue = parseFloat(sellPrice);
    
    if (isNaN(amountValue) || isNaN(buyPriceValue) || isNaN(sellPriceValue)) {
      setProfitLossUsd(0);
      setProfitLossCrypto(0);
      setPercentageChange(0);
      return;
    }
    
    const totalBuy = amountValue * buyPriceValue;
    const totalSell = amountValue * sellPriceValue;
    const profitLossValue = totalSell - totalBuy;
    const percentageChangeValue = ((sellPriceValue - buyPriceValue) / buyPriceValue) * 100;
    const profitLossCryptoValue = profitLossValue / sellPriceValue;
    
    setProfitLossUsd(profitLossValue);
    setProfitLossCrypto(profitLossCryptoValue);
    setPercentageChange(percentageChangeValue);
  };
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Crypto Profit Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Crypto Asset</label>
            <Select 
              defaultValue={asset} 
              onValueChange={setAsset}
            >
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
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <Input 
              type="number" 
              step="0.001" 
              min="0.001" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Buy Price (USD)</label>
              <Input 
                type="number" 
                step="0.01" 
                value={buyPrice} 
                onChange={(e) => setBuyPrice(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sell Price (USD)</label>
              <Input 
                type="number" 
                step="0.01" 
                value={sellPrice} 
                onChange={(e) => setSellPrice(e.target.value)}
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
              <h3 className="text-sm text-muted-foreground mb-1">Profit/Loss (USD)</h3>
              <p className={`text-3xl font-bold ${profitLossUsd >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                {profitLossUsd >= 0 ? '+' : ''}{profitLossUsd.toFixed(2)} USD
              </p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Profit/Loss ({asset})</h3>
              <p className="text-xl font-medium">
                {profitLossCrypto >= 0 ? '+' : ''}{profitLossCrypto.toFixed(8)} {asset}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Percentage Change</h3>
              <p className={`text-xl font-medium ${percentageChange >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CryptoCalculator;
