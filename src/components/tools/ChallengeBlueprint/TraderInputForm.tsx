
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import { TraderData } from './index';

interface TraderInputFormProps {
  onSubmit: (data: TraderData) => void;
  initialData?: TraderData | null;
}

const TraderInputForm: React.FC<TraderInputFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TraderData>({
    accountSize: 10000,
    profitTarget: 10,
    passDays: 14,
    winRate: 60,
    riskRewardRatio: 1.5,
    riskPerTrade: 1,
    tradesPerDay: 3
  });

  // Initialize form with saved data if available
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSliderChange = (name: keyof TraderData, values: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: values[0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Save to localStorage
    localStorage.setItem('challengeBlueprint_traderData', JSON.stringify(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="accountSize">Account Size ($)</Label>
        <Input
          id="accountSize"
          name="accountSize"
          type="number"
          value={formData.accountSize}
          onChange={handleChange}
          min="1000"
          step="1000"
          className="bg-secondary/30"
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="profitTarget">Profit Target (%)</Label>
          <span className="text-sm text-muted-foreground">{formData.profitTarget}%</span>
        </div>
        <Slider
          id="profitTarget"
          value={[formData.profitTarget]}
          min={5}
          max={30}
          step={1}
          onValueChange={(values) => handleSliderChange('profitTarget', values)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="passDays">Days to Pass</Label>
          <span className="text-sm text-muted-foreground">{formData.passDays} days</span>
        </div>
        <Slider
          id="passDays"
          value={[formData.passDays]}
          min={5}
          max={30}
          step={1}
          onValueChange={(values) => handleSliderChange('passDays', values)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="winRate">Win Rate (%)</Label>
          <span className="text-sm text-muted-foreground">{formData.winRate}%</span>
        </div>
        <Slider
          id="winRate"
          value={[formData.winRate]}
          min={30}
          max={90}
          step={1}
          onValueChange={(values) => handleSliderChange('winRate', values)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="riskRewardRatio">Reward-to-Risk Ratio</Label>
          <span className="text-sm text-muted-foreground">{formData.riskRewardRatio}:1</span>
        </div>
        <Slider
          id="riskRewardRatio"
          value={[formData.riskRewardRatio]}
          min={0.5}
          max={5}
          step={0.1}
          onValueChange={(values) => handleSliderChange('riskRewardRatio', values)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
          <span className="text-sm text-muted-foreground">{formData.riskPerTrade}%</span>
        </div>
        <Slider
          id="riskPerTrade"
          value={[formData.riskPerTrade]}
          min={0.25}
          max={3}
          step={0.25}
          onValueChange={(values) => handleSliderChange('riskPerTrade', values)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="tradesPerDay">Trades Per Day</Label>
          <span className="text-sm text-muted-foreground">{formData.tradesPerDay}</span>
        </div>
        <Slider
          id="tradesPerDay"
          value={[formData.tradesPerDay]}
          min={1}
          max={10}
          step={1}
          onValueChange={(values) => handleSliderChange('tradesPerDay', values)}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90"
      >
        <ClipboardCheck className="mr-2 h-4 w-4" />
        Generate Blueprint
      </Button>
    </form>
  );
};

export default TraderInputForm;
