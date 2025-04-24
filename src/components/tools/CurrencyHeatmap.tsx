
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CurrencyData {
  pair: string;
  change: number;
}

const CurrencyHeatmap: React.FC = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([
    { pair: 'EUR/USD', change: 0.05 },
    { pair: 'GBP/USD', change: 0.12 },
    { pair: 'USD/JPY', change: -0.08 },
    { pair: 'AUD/USD', change: 0.21 },
    { pair: 'USD/CAD', change: -0.15 },
    { pair: 'NZD/USD', change: 0.03 }
  ]);
  
  const handleChangeUpdate = (index: number, value: string) => {
    const newData = [...currencyData];
    newData[index].change = parseFloat(value) || 0;
    setCurrencyData(newData);
  };
  
  const getColorGradient = (change: number) => {
    if (change === 0) return 'bg-secondary/50';
    if (change > 0) {
      if (change > 0.5) return 'bg-gradient-to-r from-green-600 to-green-500';
      if (change > 0.2) return 'bg-gradient-to-r from-green-700 to-green-600';
      return 'bg-gradient-to-r from-green-800 to-green-700';
    } else {
      if (change < -0.5) return 'bg-gradient-to-r from-red-600 to-red-500';
      if (change < -0.2) return 'bg-gradient-to-r from-red-700 to-red-600';
      return 'bg-gradient-to-r from-red-800 to-red-700';
    }
  };
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Currency Pair Heatmap</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Input percentage change for pairs to visualize their performance.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        {currencyData.map((currency, index) => (
          <div key={currency.pair} className="flex flex-col space-y-2">
            <label className="text-sm text-muted-foreground">{currency.pair} % Change</label>
            <Input
              type="number"
              step="0.01"
              value={currency.change}
              onChange={(e) => handleChangeUpdate(index, e.target.value)}
              className="bg-secondary/50 border-input/40 input-glow"
            />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {currencyData.map((currency) => (
          <div 
            key={currency.pair}
            className={`p-4 rounded-lg transition-all duration-500 ${getColorGradient(currency.change)}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{currency.pair}</span>
              <span 
                className={`text-lg font-bold ${
                  currency.change > 0 ? 'text-white' : currency.change < 0 ? 'text-white' : 'text-muted-foreground'
                }`}
              >
                {currency.change > 0 ? '+' : ''}{currency.change.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CurrencyHeatmap;
