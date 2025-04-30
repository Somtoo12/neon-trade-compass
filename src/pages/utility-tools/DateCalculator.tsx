
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, RotateCcw, ArrowRight, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DateDifference {
  days: number;
  months: number;
  years: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  workDays: number;
  weekends: number;
}

const DateCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateDiff, setDateDiff] = useState<DateDifference | null>(null);
  const [history, setHistory] = useState<{start: string, end: string, diff: DateDifference}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    
    // Set default end date to a week from today
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      calculateDateDifference();
    }
  }, [startDate, endDate]);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast({
        title: "Invalid Dates",
        description: "Please enter valid dates",
        variant: "destructive",
      });
      return;
    }

    // Ensure end date is not before start date
    if (end < start) {
      toast({
        title: "Date Order",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    // Calculate the difference in milliseconds
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate remaining days
    const startDateCopy = new Date(start);
    startDateCopy.setFullYear(end.getFullYear());
    startDateCopy.setMonth(end.getMonth());
    const days = Math.floor((end.getTime() - startDateCopy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate weeks
    const weeks = Math.floor(diffDays / 7);
    
    // Calculate total months
    const totalMonths = years * 12 + months;
    
    // Calculate work days and weekends
    let workDays = 0;
    let weekends = 0;
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      } else {
        workDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Store the results
    const difference: DateDifference = {
      days,
      months,
      years,
      totalDays: diffDays,
      totalMonths,
      totalWeeks: weeks,
      workDays,
      weekends
    };
    
    setDateDiff(difference);
    
    // Add to history if it's a new calculation
    const newEntry = { start: startDate, end: endDate, diff: difference };
    const existingEntryIndex = history.findIndex(
      entry => entry.start === startDate && entry.end === endDate
    );
    
    if (existingEntryIndex === -1) {
      setHistory(prev => [newEntry, ...prev.slice(0, 4)]);  // Keep only last 5 calculations
    }
  };

  const swapDates = () => {
    setStartDate(endDate);
    setEndDate(startDate);
  };

  const resetDates = () => {
    // Reset to today and a week from today
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    setStartDate(today);
    setEndDate(nextWeek.toISOString().split('T')[0]);
    toast({
      title: "Reset Complete",
      description: "Dates have been reset",
    });
  };

  const loadFromHistory = (historyItem: {start: string, end: string}) => {
    setStartDate(historyItem.start);
    setEndDate(historyItem.end);
  };

  return (
    <AppLayout activeSection="utilities" setActiveSection={() => {}}>
      <Helmet>
        <title>Date Difference Calculator | PipCraft Tools</title>
        <meta name="description" content="Calculate the exact difference between two dates in days, weeks, months, and years. Perfect for project planning, age calculation, and time tracking." />
        <link rel="canonical" href="https://pipcrafts.com/date-calculator" />
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
              Date Difference Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate the precise time between any two dates. Useful for project timelines, age calculations, contract durations, and more.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <h2 className="font-medium text-lg mb-4">Select Dates</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Start Date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="pl-10 border border-border input-glow min-h-[44px]"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex justify-center my-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={swapDates}
                        className="rotate-90 md:rotate-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">End Date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="pl-10 border border-border input-glow min-h-[44px]"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={calculateDateDifference} 
                      className="min-h-[44px] bg-primary hover:bg-primary/90"
                    >
                      Calculate
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={resetDates}
                      className="min-h-[44px]"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                  </div>
                  
                  {history.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Recent Calculations</h3>
                      <div className="space-y-2">
                        {history.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-2 bg-secondary/20 rounded-md text-sm cursor-pointer hover:bg-secondary/30"
                            onClick={() => loadFromHistory(item)}
                          >
                            <div className="flex items-center">
                              <Undo2 className="h-3 w-3 mr-2" />
                              <span>{new Date(item.start).toLocaleDateString()} — {new Date(item.end).toLocaleDateString()}</span>
                            </div>
                            <span className="text-muted-foreground">{item.diff.totalDays} days</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="font-medium text-lg mb-4">Results</h2>
                  
                  {dateDiff ? (
                    <Card className="bg-secondary/20 border-border/70">
                      <CardContent className="p-5 space-y-5">
                        <div className="pb-4 border-b border-border/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Between:</span>
                            <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">And:</span>
                            <span className="font-medium">{new Date(endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="pb-4 border-b border-border/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-medium">Duration:</span>
                            <span className="font-bold">
                              {dateDiff.years > 0 ? `${dateDiff.years} years, ` : ''}
                              {dateDiff.months > 0 ? `${dateDiff.months} months, ` : ''}
                              {dateDiff.days} days
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-border/30">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">In Days:</div>
                            <div className="text-lg font-medium">{dateDiff.totalDays} days</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">In Weeks:</div>
                            <div className="text-lg font-medium">{dateDiff.totalWeeks} weeks</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">In Months:</div>
                            <div className="text-lg font-medium">{dateDiff.totalMonths} months</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">In Years:</div>
                            <div className="text-lg font-medium">{Math.floor(dateDiff.totalMonths / 12)} years</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Working Days:</div>
                            <div className="text-lg font-medium">{dateDiff.workDays} days</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Weekends:</div>
                            <div className="text-lg font-medium">{dateDiff.weekends} days</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-6 border border-dashed border-border rounded-lg bg-card/30 w-full">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">Select two dates to calculate the difference</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">Why Calculate Date Differences?</h2>
            <p>
              Date difference calculations are essential for many practical applications. From project management and contract durations to age calculations and event planning, knowing the exact time between two dates helps with accurate planning and record keeping.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Business Applications</h2>
            <p>
              For business purposes, the Date Difference Calculator helps with planning project timelines, calculating employee tenure, determining contract durations, and tracking deadlines. For traders, it can be useful to determine the duration between significant market events or to track the time elapsed in a trading strategy implementation. Use it alongside our <Link to="/trade-journal" className="text-primary hover:underline">Trade Journal</Link> to precisely record the duration of your trades.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Personal Uses</h2>
            <p>
              On a personal level, this calculator can help track anniversaries, count down to important events, or calculate ages. When planning events, consider using our <Link to="/countdown-timer" className="text-primary hover:underline">Countdown Timer</Link> to create excitement as the day approaches, or our <Link to="/qr-code-generator" className="text-primary hover:underline">QR Code Generator</Link> to create easy-to-share event details.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DateCalculator;
