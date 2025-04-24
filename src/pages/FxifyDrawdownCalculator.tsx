import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Info, Calculator, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  dailyLossPercentage: number;
  maxDrawdownPercentage: number;
  maxDrawdownType: 'trailing' | 'static';
  lockingPercentage: number;
}

const plans: Plan[] = [
  {
    id: 'one-phase',
    name: 'One-Phase Evaluation',
    dailyLossPercentage: 3,
    maxDrawdownPercentage: 6,
    maxDrawdownType: 'trailing',
    lockingPercentage: 6
  },
  {
    id: 'two-phase',
    name: 'Two-Phase Evaluation',
    dailyLossPercentage: 4,
    maxDrawdownPercentage: 10,
    maxDrawdownType: 'trailing',
    lockingPercentage: 10
  },
  {
    id: 'three-phase',
    name: 'Three-Phase Evaluation',
    dailyLossPercentage: 5,
    maxDrawdownPercentage: 5,
    maxDrawdownType: 'static',
    lockingPercentage: 0
  },
  {
    id: 'instant-funding',
    name: 'Instant Funding',
    dailyLossPercentage: 8,
    maxDrawdownPercentage: 8,
    maxDrawdownType: 'trailing',
    lockingPercentage: 8
  },
  {
    id: 'lightning',
    name: 'Lightning Challenge',
    dailyLossPercentage: 3,
    maxDrawdownPercentage: 4,
    maxDrawdownType: 'trailing',
    lockingPercentage: 4
  }
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const FxifyDrawdownCalculator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0].id);
  const [initialBalance, setInitialBalance] = useState<string>('10000');
  const [currentBalance, setCurrentBalance] = useState<string>('10000');
  const [previousDayBalance, setPreviousDayBalance] = useState<string>('10000');
  const [highestBalance, setHighestBalance] = useState<string>('10000');
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const plan = plans.find(p => p.id === selectedPlan);
  
  useEffect(() => {
    if (showResults) {
      setShowResults(false);
    }
  }, [selectedPlan]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setter(value);
      setShowResults(false);
    }
  };

  const calculateResults = () => {
    if (!plan) return;

    const init = parseFloat(initialBalance) || 0;
    const current = parseFloat(currentBalance) || 0;
    const previous = parseFloat(previousDayBalance) || 0;
    const highest = parseFloat(highestBalance) || 0;

    if (init <= 0 || current <= 0 || previous <= 0) {
      toast({
        title: "Invalid values",
        description: "Please enter positive values for all balances",
        variant: "destructive",
      });
      return;
    }

    if (highest < init) {
      toast({
        title: "Invalid High Water Mark",
        description: "Highest Balance cannot be less than Initial Balance",
        variant: "destructive",
      });
      return;
    }

    setShowResults(true);
  };

  const calculateDailyLossLimit = (): number => {
    if (!plan) return 0;
    const previous = parseFloat(previousDayBalance) || 0;
    return previous * (plan.dailyLossPercentage / 100);
  };

  const getDailyLossLimitAmount = (): number => {
    return calculateDailyLossLimit();
  };

  const getDailyLossLimitThreshold = (): number => {
    const previous = parseFloat(previousDayBalance) || 0;
    return previous - calculateDailyLossLimit();
  };

  const calculateMaxDrawdown = (): number => {
    if (!plan) return 0;
    const init = parseFloat(initialBalance) || 0;
    const maxDrawdownAmount = init * (plan.maxDrawdownPercentage / 100);
    return maxDrawdownAmount;
  };

  const getMaxDrawdownThreshold = (): number => {
    if (!plan) return 0;
    const init = parseFloat(initialBalance) || 0;
    const highest = parseFloat(highestBalance) || 0;
    
    if (plan.maxDrawdownType === 'static') {
      return init - calculateMaxDrawdown();
    }
    
    const profitPercentage = ((highest - init) / init) * 100;
    
    if (profitPercentage >= plan.lockingPercentage) {
      return init;
    }
    
    return highest - calculateMaxDrawdown();
  };

  const isBreachingDailyLimit = (): boolean => {
    const current = parseFloat(currentBalance) || 0;
    return current < getDailyLossLimitThreshold();
  };

  const isBreachingMaxDrawdown = (): boolean => {
    const current = parseFloat(currentBalance) || 0;
    return current < getMaxDrawdownThreshold();
  };

  const calculateEquityBreachLevel = (): number => {
    if (!plan) return 0;
    const dailyLimit = getDailyLossLimitThreshold();
    const maxDrawdownLimit = getMaxDrawdownThreshold();
    return Math.min(dailyLimit, maxDrawdownLimit);
  };

  const isBreachingEquityLevel = (): boolean => {
    const current = parseFloat(currentBalance) || 0;
    return current < calculateEquityBreachLevel();
  };

  const getDrawdownStatus = (): { status: 'safe' | 'warning' | 'breach', message: string } => {
    if (!showResults) {
      return { status: 'safe', message: '' };
    }
    
    if (isBreachingMaxDrawdown() || isBreachingDailyLimit()) {
      return { 
        status: 'breach', 
        message: `Account is in breach! ${isBreachingDailyLimit() ? 'Daily loss limit exceeded. ' : ''}${isBreachingMaxDrawdown() ? 'Maximum drawdown exceeded.' : ''}` 
      };
    }
    
    const current = parseFloat(currentBalance) || 0;
    const dailyThreshold = getDailyLossLimitThreshold();
    const maxThreshold = getMaxDrawdownThreshold();
    
    const dailyBuffer = calculateDailyLossLimit() * 0.2;
    const maxBuffer = calculateMaxDrawdown() * 0.2;
    
    if (current < dailyThreshold + dailyBuffer || current < maxThreshold + maxBuffer) {
      return { 
        status: 'warning', 
        message: 'Warning: Account is approaching breach limits.' 
      };
    }
    
    return { status: 'safe', message: 'Account is within safe limits.' };
  };

  const calculateBreachLevels = (): { dailyBreachAmount: number, maxBreachAmount: number } => {
    if (!showResults) return { dailyBreachAmount: 0, maxBreachAmount: 0 };
    
    const current = parseFloat(currentBalance) || 0;
    const dailyLimit = getDailyLossLimitThreshold();
    const maxLimit = getMaxDrawdownThreshold();
    
    return {
      dailyBreachAmount: Math.max(0, current - dailyLimit),
      maxBreachAmount: Math.max(0, current - maxLimit)
    };
  };

  const getExampleScenarios = () => {
    if (!plan) return null;
    const init = parseFloat(initialBalance) || 10000;
    
    if (plan.maxDrawdownType === 'static') {
      return (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Static Drawdown Examples</h3>
          
          <div className="p-4 bg-background/40 rounded-lg border border-border/40">
            <h4 className="font-medium mb-2">Example Scenario</h4>
            <p className="text-sm text-muted-foreground">
              Initial Balance: {formatCurrency(init)}<br/>
              Max Drawdown: {plan.maxDrawdownPercentage}% ({formatCurrency(init * plan.maxDrawdownPercentage / 100)})<br/>
              Breach Threshold: {formatCurrency(init * (1 - plan.maxDrawdownPercentage / 100))}
            </p>
            <p className="text-sm mt-2">
              With a static drawdown of {plan.maxDrawdownPercentage}%, your account must never fall below {formatCurrency(init * (1 - plan.maxDrawdownPercentage / 100))} at any time.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold">Trailing Drawdown Examples</h3>
        
        <div className="p-4 bg-background/40 rounded-lg border border-border/40">
          <h4 className="font-medium mb-2">Initial Scenario (No Profit)</h4>
          <p className="text-sm text-muted-foreground">
            Initial Balance: {formatCurrency(init)}<br/>
            Max Drawdown: {plan.maxDrawdownPercentage}% ({formatCurrency(init * plan.maxDrawdownPercentage / 100)})<br/>
            Breach Threshold: {formatCurrency(init * (1 - plan.maxDrawdownPercentage / 100))}
          </p>
        </div>

        <div className="p-4 bg-background/40 rounded-lg border border-border/40">
          <h4 className="font-medium mb-2">Before Lock Scenario (Small Profit)</h4>
          {(() => {
            const profit = init * 0.03;
            const hwm = init + profit;
            return (
              <p className="text-sm text-muted-foreground">
                Initial Balance: {formatCurrency(init)}<br/>
                High Water Mark: {formatCurrency(hwm)} (+3% profit)<br/>
                Max Drawdown: {formatCurrency(init * plan.maxDrawdownPercentage / 100)} (fixed amount)<br/>
                Breach Threshold: {formatCurrency(hwm - (init * plan.maxDrawdownPercentage / 100))}
              </p>
            );
          })()}
          <p className="text-sm mt-2">
            The drawdown follows your High Water Mark and remains at {plan.maxDrawdownPercentage}% of your initial balance.
          </p>
        </div>

        <div className="p-4 bg-background/40 rounded-lg border border-border/40">
          <h4 className="font-medium mb-2">After Lock Scenario ({plan.lockingPercentage}%+ Profit)</h4>
          {(() => {
            const profit = init * (plan.lockingPercentage / 100);
            const hwm = init + profit;
            return (
              <p className="text-sm text-muted-foreground">
                Initial Balance: {formatCurrency(init)}<br/>
                High Water Mark: {formatCurrency(hwm)} (+{plan.lockingPercentage}% profit)<br/>
                Max Drawdown Locks at Initial Balance: {formatCurrency(init)}<br/>
                Breach Threshold: {formatCurrency(init)}
              </p>
            );
          })()}
          <p className="text-sm mt-2">
            Once you achieve {plan.lockingPercentage}% profit, your drawdown threshold locks at your initial balance and no longer follows your High Water Mark.
          </p>
        </div>
        
        <div className="p-4 bg-background/40 rounded-lg border border-border/40">
          <h4 className="font-medium mb-2">Large Profit Scenario</h4>
          {(() => {
            const profit = init * (plan.lockingPercentage * 2 / 100);
            const hwm = init + profit;
            return (
              <p className="text-sm text-muted-foreground">
                Initial Balance: {formatCurrency(init)}<br/>
                High Water Mark: {formatCurrency(hwm)} (+{plan.lockingPercentage * 2}% profit)<br/>
                Max Drawdown Remains Locked at: {formatCurrency(init)}<br/>
                Breach Threshold: {formatCurrency(init)}
              </p>
            );
          })()}
          <p className="text-sm mt-2">
            With a {plan.lockingPercentage * 2}% profit, you now effectively have a {plan.lockingPercentage * 2}% drawdown buffer before breaching. Your account must still stay above {formatCurrency(init)}.
          </p>
        </div>
      </div>
    );
  };

  const drawdownStatus = getDrawdownStatus();

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-6 relative">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float opacity-70" />
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float delay-1000 opacity-70" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <Link to="/calculators">
            <Button variant="outline" size="sm" className="flex items-center gap-2 neo-card sticky top-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Calculators
            </Button>
          </Link>
          
          <div className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-2xl font-semibold">FXIFY Drawdown Calculator</h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            FXIFY Drawdown Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate drawdown limits based on FXIFY's official drawdown rules. Track your daily loss limits and maximum drawdown thresholds.
          </p>
        </div>

        <Card className="neo-card overflow-hidden border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 backdrop-blur">
                <img 
                  src="/placeholder.svg" 
                  alt="FXIFY logo"
                  className="h-6 w-6 rounded"
                />
              </div>
              <span>FXIFY Drawdown Rules</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="plan-select" className="text-lg font-medium">Select Plan</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs neo-card border border-border/50">
                      <p>Choose the FXIFY plan to calculate the appropriate drawdown rules.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan-select" className="w-full neo-card">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Daily Loss: {plan.dailyLossPercentage}% | 
                          Max Drawdown: {plan.maxDrawdownPercentage}% 
                          {plan.maxDrawdownType === 'trailing' ? ' trailing' : ' static'}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {plan && (
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10 neo-card">
                <h3 className="font-medium mb-2 text-accent">Plan Rules</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Daily Loss Limit: {plan.dailyLossPercentage}% of previous day's balance (at 5PM EST)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>
                      Maximum Drawdown: {plan.maxDrawdownPercentage}% {plan.maxDrawdownType === 'trailing' ? 'trailing' : 'static'} drawdown
                      {plan.maxDrawdownType === 'trailing' && ` (locks at initial balance after ${plan.lockingPercentage}% profit)`}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="initial-balance" className="flex items-center gap-1">
                      Initial Balance
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>The starting balance of your account when you first got funded.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="initial-balance"
                      type="text"
                      placeholder="10,000.00"
                      className="pl-8 input-glow"
                      value={initialBalance}
                      onChange={(e) => handleInputChange(setInitialBalance, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="current-balance" className="flex items-center gap-1">
                      Current Balance
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>Your current account balance. This will be checked against drawdown limits.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="current-balance"
                      type="text"
                      placeholder="10,000.00"
                      className="pl-8 input-glow"
                      value={currentBalance}
                      onChange={(e) => handleInputChange(setCurrentBalance, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="previous-balance" className="flex items-center gap-1">
                      Previous Day's Balance (5PM EST)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>Your account balance at 5PM EST on the previous trading day. This is used to calculate the daily loss limit.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="previous-balance"
                      type="text"
                      placeholder="10,000.00"
                      className="pl-8 input-glow"
                      value={previousDayBalance}
                      onChange={(e) => handleInputChange(setPreviousDayBalance, e.target.value)}
                    />
                  </div>
                </div>
                
                {plan?.maxDrawdownType === 'trailing' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="highest-balance" className="flex items-center gap-1">
                        Highest Balance Achieved (HWM)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs neo-card border border-border/50">
                              <p>The highest balance your account has reached. This is used to calculate trailing drawdown limits.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="highest-balance"
                        type="text"
                        placeholder="10,000.00"
                        className="pl-8 input-glow"
                        value={highestBalance}
                        onChange={(e) => handleInputChange(setHighestBalance, e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <Button onClick={calculateResults} className="w-full mt-4">
                  Calculate Drawdown Limits
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Drawdown Results</h3>
                
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur border ${
                  isBreachingEquityLevel() ? 'border-red-500/50 animate-pulse' : 'border-border/40'
                } neo-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      Equity Breach Level
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>If your equity falls below this level, your account will be breached. This is the lower of your daily loss and maximum drawdown limits.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          navigator.clipboard.writeText(formatCurrency(calculateEquityBreachLevel()));
                          toast({
                            title: "Copied to clipboard",
                            description: "Equity breach level has been copied to your clipboard",
                          });
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Value
                      </Button>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <div className={`text-2xl font-bold ${
                      isBreachingEquityLevel() 
                        ? 'text-red-500' 
                        : 'text-primary animate-fade-in'
                    }`}>
                      {showResults ? formatCurrency(calculateEquityBreachLevel()) : '--'}
                    </div>
                    {showResults && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {isBreachingEquityLevel()
                          ? "⚠️ ACCOUNT IS CURRENTLY BREACHED"
                          : "Account is within safe limits"}
                      </div>
                    )}
                  </div>
                  {showResults && (
                    <div className="text-xs text-muted-foreground border-t border-border/40 pt-2 mt-2">
                      <div>Daily Loss Limit: {formatCurrency(getDailyLossLimitThreshold())}</div>
                      <div>Max Drawdown Limit: {formatCurrency(getMaxDrawdownThreshold())}</div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-border/40 space-y-2 neo-card">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      Daily Loss Limit
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>
                              Maximum allowable loss in a single trading day. Exceeding this limit results in disqualification.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${showResults ? 'text-primary animate-fade-in' : 'text-muted-foreground'}`}>
                        {showResults ? formatCurrency(getDailyLossLimitAmount()) : '--'}
                      </div>
                      {showResults && (
                        <div className="text-xs text-muted-foreground">
                          Cannot go below {formatCurrency(getDailyLossLimitThreshold())}
                        </div>
                      )}
                    </div>
                  </div>
                  {showResults && plan && (
                    <div className="text-xs text-muted-foreground">
                      {plan.dailyLossPercentage}% of previous day's balance ({formatCurrency(parseFloat(previousDayBalance) || 0)})
                    </div>
                  )}
                </div>
                
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-border/40 space-y-2 neo-card">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      Maximum Drawdown
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                            <p>
                              {plan?.maxDrawdownType === 'trailing' 
                                ? `Follows your highest balance until ${plan?.lockingPercentage}% profit. Then locks at initial balance.` 
                                : 'This is a fixed drawdown level set from the initial account balance.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${showResults ? 'text-accent animate-fade-in' : 'text-muted-foreground'}`}>
                        {showResults ? formatCurrency(calculateMaxDrawdown()) : '--'}
                      </div>
                      {showResults && (
                        <div className="text-xs text-muted-foreground">
                          Cannot go below {formatCurrency(getMaxDrawdownThreshold())}
                        </div>
                      )}
                    </div>
                  </div>
                  {showResults && plan && (
                    <div className="text-xs text-muted-foreground">
                      {plan.maxDrawdownPercentage}% {plan.maxDrawdownType === 'trailing' ? 'trailing' : 'static'} drawdown from 
                      {plan.maxDrawdownType === 'trailing' 
                        ? ` HWM ${parseFloat(highestBalance) > parseFloat(initialBalance) * (1 + plan.lockingPercentage/100) 
                            ? '(locked at initial balance)' 
                            : ''}`
                        : ' initial balance'}
                    </div>
                  )}
                </div>
                
                <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-border/40 space-y-4 neo-card">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Distance to Breach</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs neo-card border border-border/50">
                          <p>Shows how much more you can lose before breaching each limit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Daily Loss Limit:</Label>
                      <div className={`text-xl font-bold ${
                        calculateBreachLevels().dailyBreachAmount === 0 
                          ? 'text-red-500' 
                          : 'text-primary'
                      }`}>
                        {formatCurrency(calculateBreachLevels().dailyBreachAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {calculateBreachLevels().dailyBreachAmount === 0 
                          ? "You have breached the daily loss limit" 
                          : "remaining until daily breach"}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Maximum Drawdown:</Label>
                      <div className={`text-xl font-bold ${
                        calculateBreachLevels().maxBreachAmount === 0 
                          ? 'text-red-500' 
                          : 'text-accent'
                      }`}>
                        {formatCurrency(calculateBreachLevels().maxBreachAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {calculateBreachLevels().maxBreachAmount === 0 
                          ? "You have breached the maximum drawdown" 
                          : "remaining until max drawdown breach"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {showResults && (
                  <div className={`p-4 rounded-lg ${
                    drawdownStatus.status === 'breach' 
                      ? 'bg-red-500/10 border border-red-500/30' 
                      : drawdownStatus.status === 'warning'
                        ? 'bg-yellow-500/10 border border-yellow-500/30'
                        : 'bg-green-500/10 border border-green-500/30'
                  } neo-card animate-fade-in`}>
                    <div className="flex items-center gap-2">
                      <div className={`text-${
                        drawdownStatus.status === 'breach' 
                          ? 'red' 
                          : drawdownStatus.status === 'warning' 
                            ? 'yellow' 
                            : 'green'
                      }-500 font-semibold`}>
                        {drawdownStatus.status === 'breach' 
                          ? 'BREACH DETECTED' 
                          : drawdownStatus.status === 'warning'
                            ? 'APPROACHING LIMITS'
                            : 'WITHIN SAFE LIMITS'
                        }
                      </div>
                    </div>
                    <p className="text-sm mt-1">
                      {drawdownStatus.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {showResults && getExampleScenarios()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FxifyDrawdownCalculator;
