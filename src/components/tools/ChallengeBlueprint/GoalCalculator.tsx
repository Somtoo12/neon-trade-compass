
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoalCalculatorProps {
  onCalculate: (data: GoalInputs) => void;
  initialData?: GoalInputs;
}

export interface GoalInputs {
  targetPercent: number;
  daysRemaining: number;
  riskPerTrade: number;
  winRate: number;
  rewardRiskRatio: number;
}

const GoalCalculator: React.FC<GoalCalculatorProps> = ({ onCalculate, initialData }) => {
  const [inputs, setInputs] = useState<GoalInputs>({
    targetPercent: initialData?.targetPercent || 10,
    daysRemaining: initialData?.daysRemaining || 14,
    riskPerTrade: initialData?.riskPerTrade || 1,
    winRate: initialData?.winRate || 60,
    rewardRiskRatio: initialData?.rewardRiskRatio || 1.5,
  });

  useEffect(() => {
    // If we have initial data, set it
    if (initialData) {
      setInputs(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setInputs(prev => ({
      ...prev,
      [name]: numValue
    }));

    // Auto-update calculations when user inputs change
    onCalculate({
      ...inputs,
      [name]: numValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  // Save to local storage when inputs change
  useEffect(() => {
    localStorage.setItem('challengeBlueprint_goalInputs', JSON.stringify(inputs));
  }, [inputs]);

  return (
    <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Flag className="h-5 w-5 mr-2 text-accent" />
          How to Pass Your Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetPercent">Target (%)</Label>
              <Input
                id="targetPercent"
                name="targetPercent"
                type="number"
                value={inputs.targetPercent}
                onChange={handleChange}
                min={1}
                max={100}
                className="bg-secondary/30"
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daysRemaining">Days Remaining</Label>
              <Input
                id="daysRemaining"
                name="daysRemaining"
                type="number"
                value={inputs.daysRemaining}
                onChange={handleChange}
                min={1}
                max={60}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
              <Input
                id="riskPerTrade"
                name="riskPerTrade"
                type="number"
                value={inputs.riskPerTrade}
                onChange={handleChange}
                min={0.1}
                max={5}
                step={0.1}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="winRate">Win Rate (%)</Label>
              <Input
                id="winRate"
                name="winRate"
                type="number"
                value={inputs.winRate}
                onChange={handleChange}
                min={1}
                max={99}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rewardRiskRatio">Reward-to-Risk Ratio</Label>
              <Input
                id="rewardRiskRatio"
                name="rewardRiskRatio"
                type="number"
                value={inputs.rewardRiskRatio}
                onChange={handleChange}
                min={0.1}
                step={0.1}
                max={10}
                className="bg-secondary/30"
              />
            </div>
          </div>
          
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Calculate Pass Strategy
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalCalculator;
