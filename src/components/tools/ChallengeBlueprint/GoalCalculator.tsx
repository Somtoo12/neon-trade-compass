
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCheck, Flag, HelpCircle, X } from 'lucide-react';
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
    targetPercent: initialData?.targetPercent || null,
    daysRemaining: initialData?.daysRemaining || null,
    riskPerTrade: initialData?.riskPerTrade || null,
    winRate: initialData?.winRate || null,
    rewardRiskRatio: initialData?.rewardRiskRatio || null,
  });
  
  const [lastValidInputs, setLastValidInputs] = useState(inputs);
  const debounceTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setInputs(initialData);
      setLastValidInputs(initialData);
    }
  }, [initialData]);

  const validateNumericInput = (value: string, min: number, max: number): number | null => {
    if (value === '') return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < min || numValue > max) return null;
    return numValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let validatedValue: number | null = null;
    
    switch (name) {
      case 'targetPercent':
        validatedValue = validateNumericInput(value, 0.1, 100);
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
        validatedValue = validateNumericInput(value, 0.1, 5);
        break;
      default:
        return;
    }

    const newInputs = {
      ...inputs,
      [name]: validatedValue
    };
    
    setInputs(newInputs);
    
    if (Object.values(newInputs).every(val => val !== null)) {
      setLastValidInputs(newInputs as GoalInputs);
      
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        onCalculate(newInputs as GoalInputs);
        debounceTimerRef.current = null;
      }, 500);
    }
  };

  const handleClearField = (fieldName: keyof GoalInputs) => {
    setInputs(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(inputs).every(val => val !== null)) {
      onCalculate(inputs as GoalInputs);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('challengeBlueprint_goalInputs', JSON.stringify(inputs));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputs]);

  const getFieldTooltip = (field: keyof GoalInputs): string => {
    const tooltips: Record<keyof GoalInputs, string> = {
      targetPercent: 'Enter your target profit percentage (0.1% - 100%)',
      daysRemaining: 'Number of days left in your challenge (1-60)',
      riskPerTrade: 'Risk percentage per trade (0.1% - 5%)',
      winRate: 'Your expected win rate percentage (1% - 99%)',
      rewardRiskRatio: 'Reward to risk ratio (0.1 - 5)'
    };
    return tooltips[field];
  };

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
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {['targetPercent', 'daysRemaining', 'winRate'].map((key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-1 cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getFieldTooltip(key as keyof GoalInputs)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {inputs[key as keyof GoalInputs] !== null && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleClearField(key as keyof GoalInputs)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  step="0.1"
                  value={inputs[key as keyof GoalInputs] === null ? '' : inputs[key as keyof GoalInputs]}
                  onChange={handleChange}
                  className="bg-secondary/30"
                  min={key === 'daysRemaining' ? 1 : 0.1}
                  max={key === 'winRate' ? 99 : 100}
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {['riskPerTrade', 'rewardRiskRatio'].map((key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-1 cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getFieldTooltip(key as keyof GoalInputs)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {inputs[key as keyof GoalInputs] !== null && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleClearField(key as keyof GoalInputs)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  step="0.1"
                  value={inputs[key as keyof GoalInputs] === null ? '' : inputs[key as keyof GoalInputs]}
                  onChange={handleChange}
                  className="bg-secondary/30"
                  min={0.1}
                  max={5}
                />
                {key === 'riskPerTrade' && inputs.riskPerTrade !== null && (
                  <p className="text-xs text-muted-foreground">
                    Risk {inputs.riskPerTrade}% per trade
                  </p>
                )}
                {key === 'rewardRiskRatio' && inputs.rewardRiskRatio !== null && inputs.riskPerTrade !== null && (
                  <p className="text-xs text-muted-foreground">
                    Each win gains {(inputs.rewardRiskRatio * inputs.riskPerTrade).toFixed(2)}% ({inputs.rewardRiskRatio}× your {inputs.riskPerTrade}% risk)
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button 
              type="submit" 
              className="w-full max-w-md bg-accent hover:bg-accent/90 text-lg py-6"
              disabled={Object.values(inputs).some(val => val === null)}
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Calculate Pass Strategy
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
};

export default GoalCalculator;
