
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TraderData } from './index';

interface TraderInputFormProps {
  onSubmit: (data: TraderData) => void;
  initialData?: TraderData | null;
}

const tradingStrategies = [
  "Scalping",
  "Day Trading",
  "Swing Trading",
  "Breakout Trading",
  "Trend Following", 
  "Range Trading",
  "Support/Resistance",
  "ICT Concepts",
  "Supply & Demand",
  "SMC",
  "Other"
];

const TraderInputForm: React.FC<TraderInputFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TraderData>({
    accountSize: 10000,
    profitTarget: 10,
    passDays: 14,
    winRate: 60,
    riskRewardRatio: 1.5,
    riskPerTrade: 1,
    tradesPerDay: 3,
    tradingStrategy: "Day Trading",
    isAccelerated: false
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isAccelerated: checked
    }));
  };

  const handleStrategyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tradingStrategy: value
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-6">Tell us about your trading</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="accountSize">Account Size ($)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The starting size of your prop firm account.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="accountSize"
            name="accountSize"
            type="number"
            value={formData.accountSize}
            onChange={handleChange}
            min="1000"
            step="1000"
            className="bg-secondary/30 mt-1"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <Label htmlFor="profitTarget">Profit Target (%)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The profit target required to pass your challenge, typically between 8-15%.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Label htmlFor="passDays">Days to Pass</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The number of days you have to complete the challenge.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
          
          <div className="flex items-center justify-between mt-2">
            <Label htmlFor="accelerated-toggle" className="text-sm">Accelerated Challenge</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="accelerated-toggle"
                checked={formData.isAccelerated} 
                onCheckedChange={handleSwitchChange} 
              />
              <span className="text-sm text-muted-foreground">
                {formData.isAccelerated ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <Label htmlFor="winRate">Win Rate (%)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Your realistic trading win rate percentage.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="riskRewardRatio">Reward-to-Risk Ratio</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Average reward-to-risk ratio of your trades (e.g. 1.5 means your wins are 1.5x your losses).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The percentage of your account you risk on each trade (not the prop firm limit).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="tradesPerDay">Trades Per Day</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Maximum number of trades you plan to take each day.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="tradingStrategy">Preferred Trading Strategy</Label>
          </div>
          <Select value={formData.tradingStrategy} onValueChange={handleStrategyChange}>
            <SelectTrigger className="bg-secondary/30">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {tradingStrategies.map(strategy => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Generate Strategy Blueprint
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TraderInputForm;
