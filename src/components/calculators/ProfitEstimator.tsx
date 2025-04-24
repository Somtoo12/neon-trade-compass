import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProfitEstimator: React.FC = () => {
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
    <Card className="p-6 bg-card/30 backdrop-blur border-primary/20">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Crypto Asset</label>
            <Select defaultValue={asset} onValueChange={setAsset}>
              <SelectTrigger className="bg-background/95 border-primary/20">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}USD</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background/95 border-primary/20"
                step="0.001"
                min="0.001"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {asset}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Buy Price</label>
              <div className="relative">
                <Input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="bg-background/95 border-primary/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  USD
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sell Price</label>
              <div className="relative">
                <Input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="bg-background/95 border-primary/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-background/95 rounded-lg">
          <h3 className="text-sm font-medium">Results</h3>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profit/Loss (USD)</p>
              <p className={`text-xl font-bold ${profitLossUsd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitLossUsd >= 0 ? '+' : ''}{profitLossUsd.toFixed(2)} USD
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profit/Loss ({asset})</p>
              <p className="text-lg">
                {profitLossCrypto >= 0 ? '+' : ''}{profitLossCrypto.toFixed(8)} {asset}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Percentage Change</p>
              <p className={`text-lg ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfitEstimator;
