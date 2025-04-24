
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Search, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/hooks/use-toast';

// Define prop firm types
interface PropFirm {
  id: string;
  name: string;
  logo: string;
  plans: Plan[];
  comingSoon?: boolean;
}

interface Plan {
  id: string;
  name: string;
  dailyLossCalcMethod: 'previous' | 'current';
  dailyLossPercentage: number;
  maxDrawdownPercentage: number;
  maxDrawdownType: 'trailing' | 'fixed';
}

const propFirms: PropFirm[] = [
  {
    id: 'fxify',
    name: 'FXIFY',
    logo: '/placeholder.svg',
    plans: [
      {
        id: '1-step',
        name: '1-Step Plan',
        dailyLossCalcMethod: 'previous',
        dailyLossPercentage: 3,
        maxDrawdownPercentage: 10,
        maxDrawdownType: 'trailing'
      },
      {
        id: '2-step',
        name: '2-Step Plan',
        dailyLossCalcMethod: 'current',
        dailyLossPercentage: 4,
        maxDrawdownPercentage: 10,
        maxDrawdownType: 'trailing'
      },
      {
        id: '3-step',
        name: '3-Step Plan',
        dailyLossCalcMethod: 'current',
        dailyLossPercentage: 5,
        maxDrawdownPercentage: 10,
        maxDrawdownType: 'trailing'
      }
    ]
  },
  {
    id: 'ftmo',
    name: 'FTMO',
    logo: '/placeholder.svg',
    comingSoon: true,
    plans: []
  },
  {
    id: 'myforexfunds',
    name: 'MyForexFunds',
    logo: '/placeholder.svg',
    comingSoon: true,
    plans: []
  }
];

const PropFirmCalculator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [calculations, setCalculations] = useState<Record<string, { 
    selectedPlan: string, 
    currentBalance: string, 
    previousDayBalance: string 
  }>>({});
  const firmRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { theme } = useTheme();

  // Filter prop firms based on search term
  const filteredFirms = propFirms.filter(firm => 
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Auto-scroll to the firm if only one result
    if (filteredFirms.length === 1 && searchTerm) {
      const firmId = filteredFirms[0].id;
      firmRefs.current[firmId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [filteredFirms, searchTerm]);

  const handlePlanSelect = (firmId: string, planId: string) => {
    setCalculations(prev => ({
      ...prev,
      [firmId]: {
        ...prev[firmId],
        selectedPlan: planId
      }
    }));
    
    // Show toast notification when plan is selected
    toast({
      title: "Plan Selected",
      description: `You've selected the ${planId} for ${firmId.toUpperCase()}`,
      duration: 2000,
    });
  };

  const handleInputChange = (
    firmId: string, 
    field: 'currentBalance' | 'previousDayBalance', 
    value: string
  ) => {
    // Only allow numeric input with decimal point
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setCalculations(prev => ({
        ...prev,
        [firmId]: {
          ...prev[firmId] || { selectedPlan: '', currentBalance: '', previousDayBalance: '' },
          [field]: value
        }
      }));
    }
  };

  const calculateDailyLossLimit = (firmId: string): string => {
    const firm = propFirms.find(f => f.id === firmId);
    if (!firm || firm.comingSoon) return '--';

    const calc = calculations[firmId];
    if (!calc || !calc.selectedPlan) return '--';

    const plan = firm.plans.find(p => p.id === calc.selectedPlan);
    if (!plan) return '--';

    const balanceToUse = plan.dailyLossCalcMethod === 'previous' 
      ? parseFloat(calc.previousDayBalance || '0') 
      : parseFloat(calc.currentBalance || '0');
    
    if (balanceToUse <= 0) return '--';

    const result = balanceToUse * plan.dailyLossPercentage / 100;
    return `$${result.toFixed(2)}`;
  };

  const calculateMaxDrawdown = (firmId: string): string => {
    const firm = propFirms.find(f => f.id === firmId);
    if (!firm || firm.comingSoon) return '--';

    const calc = calculations[firmId];
    if (!calc || !calc.selectedPlan) return '--';

    const plan = firm.plans.find(p => p.id === calc.selectedPlan);
    if (!plan) return '--';

    const currentBalance = parseFloat(calc.currentBalance || '0');
    if (currentBalance <= 0) return '--';

    const result = currentBalance * plan.maxDrawdownPercentage / 100;
    return `$${result.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float opacity-70" />
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float delay-1000 opacity-70" />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Link to="/calculators">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Calculators
              </Button>
            </Link>
          </div>
          
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 w-full neo-card input-glow"
              placeholder="Search Prop Firm…" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
          Prop Firm Drawdown Calculator
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          Calculate Daily Loss Limits and Maximum Drawdowns for popular proprietary trading firms based on their specific rules.
        </p>

        {/* Prop Firm Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredFirms.map(firm => (
            <div 
              key={firm.id} 
              ref={(el) => firmRefs.current[firm.id] = el}
              className={`transition-all duration-300 ${firm.comingSoon ? 'opacity-70' : 'hover:scale-[1.01]'}`}
            >
              <Card className={`neo-card overflow-hidden ${firm.comingSoon ? 'grayscale' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background/50 backdrop-blur">
                      <img 
                        src={firm.logo} 
                        alt={`${firm.name} logo`}
                        className="h-8 w-8 rounded"
                      />
                    </div>
                    <CardTitle className="text-2xl font-semibold">{firm.name}</CardTitle>
                  </div>
                  {firm.comingSoon && (
                    <div className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </CardHeader>
                
                {!firm.comingSoon && (
                  <CardContent>
                    <div className="space-y-6">
                      {/* Plan Selection */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Select Plan</h3>
                        <RadioGroup 
                          value={calculations[firm.id]?.selectedPlan || ''}
                          onValueChange={(value) => handlePlanSelect(firm.id, value)}
                          className="grid grid-cols-1 md:grid-cols-3 gap-2"
                        >
                          {firm.plans.map(plan => (
                            <div 
                              key={plan.id}
                              className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:border-primary ${calculations[firm.id]?.selectedPlan === plan.id ? 'border-primary bg-primary/10' : 'border-border'}`}
                            >
                              <RadioGroupItem value={plan.id} id={`${firm.id}-${plan.id}`} />
                              <Label htmlFor={`${firm.id}-${plan.id}`} className="cursor-pointer flex-1">
                                {plan.name}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Calculator Form */}
                      {calculations[firm.id]?.selectedPlan && (
                        <div className="animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium mb-3">Account Details</h3>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`${firm.id}-currentBalance`} className="flex items-center gap-1">
                                    Current Balance
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs neo-card border border-border/50">
                                          <p>Your current account balance.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                </div>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                  <Input
                                    id={`${firm.id}-currentBalance`}
                                    type="text"
                                    placeholder="10,000.00"
                                    className="pl-8 input-glow"
                                    value={calculations[firm.id]?.currentBalance || ''}
                                    onChange={(e) => handleInputChange(firm.id, 'currentBalance', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.dailyLossCalcMethod === 'previous' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`${firm.id}-previousBalance`} className="flex items-center gap-1">
                                      Previous Day's Balance (5PM EST)
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-xs neo-card border border-border/50">
                                            <p>Daily Loss Limit is calculated based on the previous day's end of day (5PM EST) balance.</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </Label>
                                  </div>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                      id={`${firm.id}-previousBalance`}
                                      type="text"
                                      placeholder="10,000.00"
                                      className="pl-8 input-glow"
                                      value={calculations[firm.id]?.previousDayBalance || ''}
                                      onChange={(e) => handleInputChange(firm.id, 'previousDayBalance', e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Results */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium mb-3">Drawdown Limits</h3>
                              
                              {/* Daily Loss Limit */}
                              <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-border/40 space-y-2">
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
                                            {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.dailyLossCalcMethod === 'previous' 
                                              ? 'Calculated as a percentage of previous day\'s balance at 5PM EST.' 
                                              : 'Calculated as a percentage of current balance.'}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  <span className="text-2xl font-bold text-primary">
                                    {calculateDailyLossLimit(firm.id)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {calculations[firm.id]?.selectedPlan && (
                                    <span>
                                      {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.dailyLossPercentage}% of 
                                      {' '}
                                      {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.dailyLossCalcMethod === 'previous' 
                                        ? 'previous day\'s balance' 
                                        : 'current balance'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Max Drawdown */}
                              <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-border/40 space-y-2">
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
                                            {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.maxDrawdownType === 'trailing' 
                                              ? 'This is a trailing drawdown limit calculated from your highest account balance.' 
                                              : 'This is a fixed drawdown limit calculated from your starting balance.'}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  <span className="text-2xl font-bold text-accent">
                                    {calculateMaxDrawdown(firm.id)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {calculations[firm.id]?.selectedPlan && (
                                    <span>
                                      {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.maxDrawdownPercentage}% 
                                      {' '}
                                      {firm.plans.find(p => p.id === calculations[firm.id]?.selectedPlan)?.maxDrawdownType === 'trailing' 
                                        ? 'trailing drawdown' 
                                        : 'fixed drawdown'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
        
        {/* Compare section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Compare Drawdown Rules Across Firms
          </h2>
          <p className="text-muted-foreground mb-6">
            More prop trading firms will be added soon. Check back for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropFirmCalculator;
