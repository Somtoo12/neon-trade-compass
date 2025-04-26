
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCheck, Flag, HelpCircle } from 'lucide-react';
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
  
  // Calculate the reward percentage based on risk and reward-to-risk ratio
  const rewardPercentage = inputs.riskPerTrade * inputs.rewardRiskRatio;

  // Store last valid input state to recover from invalid inputs
  const [lastValidInputs, setLastValidInputs] = useState(inputs);
  
  // Debounce timer ref to avoid excessive calculations
  const debounceTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    // If we have initial data, set it
    if (initialData) {
      setInputs(initialData);
      setLastValidInputs(initialData);
    }
  }, [initialData]);

  const validateNumericInput = (value: string, min: number, max: number): number => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return min;
    return Math.max(min, Math.min(max, numValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    try {
      // Apply different validation rules based on the field
      let validatedValue: number;
      
      switch (name) {
        case 'targetPercent':
          validatedValue = validateNumericInput(value, 1, 100);
          break;
        case 'daysRemaining':
          validatedValue = validateNumericInput(value, 1, 60);
          break;
        case 'riskPerTrade':
          validatedValue = validateNumericInput(value, 0.1, 5);
          break;
        case 'winRate':
          validatedValue = validateNumericInput(value, 1, 99);
          break;
        case 'rewardRiskRatio':
          validatedValue = validateNumericInput(value, 0.1, 10);
          break;
        default:
          validatedValue = parseFloat(value);
      }
      
      // Update the state with the validated value
      const newInputs = {
        ...inputs,
        [name]: validatedValue
      };
      
      setInputs(newInputs);
      setLastValidInputs(newInputs);

      // Clear previous timer if exists
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      // Auto-update calculations when user inputs change - debounced
      debounceTimerRef.current = window.setTimeout(() => {
        onCalculate(newInputs);
        debounceTimerRef.current = null;
      }, 500);
    } catch (error) {
      console.error("Error processing input:", error);
      // Revert to last valid state on error
      setInputs(lastValidInputs);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onCalculate(inputs);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Save to local storage when inputs change
  useEffect(() => {
    try {
      localStorage.setItem('challengeBlueprint_goalInputs', JSON.stringify(inputs));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    
    // Cleanup function to clear any pending timers
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
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
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="targetPercent">Target (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The profit target percentage you need to reach</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="flex items-center">
                <Label htmlFor="daysRemaining">Days Remaining</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of days left in your challenge</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
                      <p>This is your risk % per trade, not the prop firm limit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              {inputs.riskPerTrade > 0 && (
                <p className="text-xs text-muted-foreground">
                  You risk {inputs.riskPerTrade}% per trade
                </p>
              )}
            </div>
            <div className="space-y-2">
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
                      <p>Your average trading win percentage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="flex items-center">
                <Label htmlFor="rewardRiskRatio">Reward-to-Risk Ratio</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average reward:risk ratio (e.g. 1.5 means wins are 1.5x your losses)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              {inputs.rewardRiskRatio > 0 && (
                <p className="text-xs text-muted-foreground">
                  Each win gains {rewardPercentage.toFixed(3)}% ({inputs.rewardRiskRatio}× your {inputs.riskPerTrade}% risk)
                </p>
              )}
            </div>
          </div>
          
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Calculate Pass Strategy
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
};

export default GoalCalculator;
