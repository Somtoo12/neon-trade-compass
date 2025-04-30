
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, DollarSign, Users, RotateCcw, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<string>('15');
  const [numPeople, setNumPeople] = useState<string>('1');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);
  const { toast } = useToast();

  // Pre-defined tip percentages
  const tipOptions = [10, 15, 18, 20, 25];

  // Calculate tip and total when inputs change
  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercentage, numPeople]);

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercentage) || 0;
    const people = parseInt(numPeople) || 1;

    if (bill > 0 && tip >= 0 && people > 0) {
      const calculatedTip = (bill * tip) / 100;
      const total = bill + calculatedTip;
      const perPerson = total / people;

      setTipAmount(calculatedTip);
      setTotalPerPerson(perPerson);
    } else {
      setTipAmount(0);
      setTotalPerPerson(0);
    }
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage('15');
    setNumPeople('1');
    setTipAmount(0);
    setTotalPerPerson(0);
    toast({
      title: "Reset Complete",
      description: "Calculator has been reset",
    });
  };

  const handleTipSelect = (percentage: number) => {
    setTipPercentage(percentage.toString());
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Input validation
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setBillAmount(value);
    }
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers up to 100
    if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 100)) {
      setTipPercentage(value);
    }
  };

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive integers
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setNumPeople(value);
    }
  };

  return (
    <AppLayout activeSection="utilities" setActiveSection={() => {}}>
      <Helmet>
        <title>Tip Split Calculator | PipCraft Tools</title>
        <meta name="description" content="Calculate tips and split bills easily among friends and family. Perfect for restaurants, group outings, and shared expenses." />
        <link rel="canonical" href="https://pipcrafts.com/tip-calculator" />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-4 pb-16"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Tip Split Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate tips and split bills easily among friends and family. Perfect for dining out, group events, and shared expenses.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <h2 className="font-medium text-lg mb-4">Bill Information</h2>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Bill Amount</label>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={billAmount}
                        onChange={handleBillChange}
                        placeholder="0.00"
                        className="pl-10 border border-border input-glow min-h-[44px]"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Tip Percentage</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tipOptions.map(percentage => (
                        <Button
                          key={percentage}
                          variant={tipPercentage === percentage.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTipSelect(percentage)}
                          className="min-h-[36px]"
                        >
                          {percentage}%
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={tipPercentage}
                        onChange={handleTipChange}
                        placeholder="15"
                        className="pl-10 border border-border input-glow min-h-[44px]"
                      />
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Number of People</label>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={numPeople}
                        onChange={handlePeopleChange}
                        placeholder="1"
                        min="1"
                        className="pl-10 border border-border input-glow min-h-[44px]"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    className="min-h-[44px]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
                
                <div>
                  <h2 className="font-medium text-lg mb-4">Results</h2>
                  
                  <Card className="bg-secondary/20 border-border/70">
                    <CardContent className="p-5 space-y-4">
                      {/* Bill breakdown */}
                      <div className="pb-4 border-b border-border/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Bill Amount:</span>
                          <span className="font-medium">{billAmount ? formatCurrency(parseFloat(billAmount)) : '$0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Tip Amount ({tipPercentage}%):</span>
                          <span className="font-medium">{formatCurrency(tipAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Bill:</span>
                          <span className="font-medium">{billAmount ? formatCurrency(parseFloat(billAmount) + tipAmount) : '$0.00'}</span>
                        </div>
                      </div>
                      
                      {/* Per person breakdown */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Tip per Person:</span>
                          <span className="font-medium">{formatCurrency(tipAmount / (parseInt(numPeople) || 1))}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-muted-foreground">Bill per Person:</span>
                          <span className="font-medium">{billAmount ? formatCurrency((parseFloat(billAmount) / (parseInt(numPeople) || 1))) : '$0.00'}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-primary/20 p-3 rounded-lg">
                          <span className="font-medium">Total per Person:</span>
                          <span className="text-xl font-bold">{formatCurrency(totalPerPerson)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Results update automatically as you type</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">Tipping Made Easy</h2>
            <p>
              Calculating tips and splitting bills can be challenging, especially after a long meal with friends or colleagues. Our Tip Split Calculator simplifies this process by providing instant calculations for any group size and custom tip percentages.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Tipping Etiquette Around the World</h2>
            <p>
              Tipping customs vary widely around the world. In the United States, 15-20% is customary for good service at restaurants. In Europe, tipping is often more modest (around 10%) or sometimes already included as a service charge. In Japan, tipping is generally not practiced and can even be considered rude. Before traveling, research local customs for tipping to avoid awkward situations.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Beyond Restaurants</h2>
            <p>
              This calculator isn't just for restaurant bills. Use it for splitting costs on group vacations, shared household expenses, or group gifts. For more advanced financial calculations, check out our <Link to="/date-calculator" className="text-primary hover:underline">Date Calculator</Link> to track payment periods or our <Link to="/random-generator" className="text-primary hover:underline">Random Number Generator</Link> to fairly decide who pays next time.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default TipCalculator;
