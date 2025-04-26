import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCheck, Flag, HelpCircle, Clear } from 'lucide-react';
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
  
  const rewardPercentage = inputs.riskPerTrade * inputs.rewardRiskRatio;

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
    if (isNaN(numValue)) return null;
    return Math.max(min, Math.min(max, numValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    try {
      if (value === '') {
        const newInputs = {
          ...inputs,
          [name]: null
        };
        setInputs(newInputs);
        return;
      }

      let validatedValue: number | null = null;
      
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
    } catch (error) {
      console.error("Error processing input:", error);
      setInputs(lastValidInputs);
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
    try {
      onCalculate(inputs);
    } catch (error) {
      console.error("Error submitting form:", error);
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
      targetPercent: 'The profit target percentage you need to reach',
      daysRemaining: 'Number of days left in your challenge',
      riskPerTrade: 'This is your risk % per trade, not the prop firm limit',
      winRate: 'Your average trading win percentage',
      rewardRiskRatio: 'Average reward:risk ratio (e.g. 1.5 means wins are 1.5x your losses)'
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
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-1">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getFieldTooltip(key as keyof GoalInputs)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {value !== null && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleClearField(key as keyof GoalInputs)}
                      className="h-6 w-6 p-0"
                    >
                      <Clear className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  id={key}
                  name={key}
                  type="text"
                  value={value === null ? '' : value}
                  onChange={handleChange}
                  className="bg-secondary/30"
                  step={key === 'riskPerTrade' || key === 'rewardRiskRatio' ? 0.1 : 1}
                />
                {key === 'riskPerTrade' && value !== null && (
                  <p className="text-xs text-muted-foreground">
                    You risk {value}% per trade
                  </p>
                )}
                {key === 'rewardRiskRatio' && value !== null && inputs.riskPerTrade !== null && (
                  <p className="text-xs text-muted-foreground">
                    Each win gains {(value * inputs.riskPerTrade).toFixed(3)}% ({value}× your {inputs.riskPerTrade}% risk)
                  </p>
                )}
              </div>
            ))}
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
              disabled={Object.values(inputs).some(val => val === null)}
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
