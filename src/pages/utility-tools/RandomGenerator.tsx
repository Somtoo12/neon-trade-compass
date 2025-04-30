
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dice6, RotateCcw, Copy, ArrowRight, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface GenerationHistory {
  min: number;
  max: number;
  result: number;
  timestamp: Date;
}

const RandomGenerator: React.FC = () => {
  const [minValue, setMinValue] = useState<string>('1');
  const [maxValue, setMaxValue] = useState<string>('100');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();

  // Generate initial random number when component loads
  useEffect(() => {
    generateRandom();
  }, []);

  const generateRandom = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);

    if (isNaN(min) || isNaN(max)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
      return;
    }

    if (min > max) {
      toast({
        title: "Invalid Range",
        description: "Minimum value must be less than or equal to maximum value",
        variant: "destructive",
      });
      return;
    }

    // Generate random number between min and max (inclusive)
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(randomNum);
    
    // Add to history
    const newEntry: GenerationHistory = {
      min,
      max,
      result: randomNum,
      timestamp: new Date()
    };
    
    setHistory(prev => [newEntry, ...prev.slice(0, 19)]);  // Keep only last 20 results
  };

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      toast({
        title: "Copied!",
        description: `${result} copied to clipboard`,
      });
    }
  };

  const resetValues = () => {
    setMinValue('1');
    setMaxValue('100');
    setResult(null);
    toast({
      title: "Reset Complete",
      description: "Values have been reset",
    });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only integers
    if (value === '' || /^-?\d+$/.test(value)) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only integers
    if (value === '' || /^-?\d+$/.test(value)) {
      setMaxValue(value);
    }
  };

  const calculateStats = () => {
    if (history.length === 0) return null;
    
    const sum = history.reduce((acc, curr) => acc + curr.result, 0);
    const avg = sum / history.length;
    const sortedResults = [...history].map(h => h.result).sort((a, b) => a - b);
    const median = sortedResults.length % 2 === 0 
      ? (sortedResults[sortedResults.length / 2 - 1] + sortedResults[sortedResults.length / 2]) / 2
      : sortedResults[Math.floor(sortedResults.length / 2)];
    
    return {
      min: Math.min(...sortedResults),
      max: Math.max(...sortedResults),
      avg: avg.toFixed(2),
      median: median,
      count: history.length
    };
  };

  const stats = calculateStats();

  return (
    <AppLayout activeSection="utilities" setActiveSection={() => {}}>
      <Helmet>
        <title>Random Number Generator | PipCraft Tools</title>
        <meta name="description" content="Generate random numbers within any range. Perfect for games, raffles, statistics, and making unbiased decisions." />
        <link rel="canonical" href="https://pipcrafts.com/random-generator" />
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
              Random Number Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate truly random numbers within any range. Perfect for games, raffles, statistical sampling, and making unbiased decisions.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="font-medium text-lg mb-4">Generator Settings</h2>
                  
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-full sm:w-auto flex-grow">
                        <label className="block text-sm font-medium mb-1">Minimum</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={minValue}
                          onChange={handleMinChange}
                          className="border border-border input-glow min-h-[44px]"
                        />
                      </div>
                      
                      <div className="hidden sm:flex items-center self-end mb-[9px]">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="w-full sm:w-auto flex-grow">
                        <label className="block text-sm font-medium mb-1">Maximum</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={maxValue}
                          onChange={handleMaxChange}
                          className="border border-border input-glow min-h-[44px]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={generateRandom} 
                        className="min-h-[44px] bg-primary hover:bg-primary/90"
                      >
                        <Dice6 className="mr-2 h-4 w-4" /> Generate
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={resetValues}
                        className="min-h-[44px]"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                      </Button>
                    </div>
                    
                    {/* Presets */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Quick Presets</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('1'); setMaxValue('10'); }} className="min-h-[36px]">1-10</Button>
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('1'); setMaxValue('100'); }} className="min-h-[36px]">1-100</Button>
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('1'); setMaxValue('1000'); }} className="min-h-[36px]">1-1000</Button>
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('0'); setMaxValue('1'); }} className="min-h-[36px]">0/1</Button>
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('1'); setMaxValue('6'); }} className="min-h-[36px]">Dice (1-6)</Button>
                        <Button variant="outline" size="sm" onClick={() => { setMinValue('1'); setMaxValue('52'); }} className="min-h-[36px]">Cards (1-52)</Button>
                      </div>
                    </div>
                  </div>

                  {/* Show generation history */}
                  {history.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Recent Results</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowStats(!showStats)}
                          className="text-xs flex gap-1 items-center"
                        >
                          <BarChart2 className="h-3 w-3" /> {showStats ? 'Hide Stats' : 'Show Stats'}
                        </Button>
                      </div>
                      
                      {showStats && stats && (
                        <Card className="bg-secondary/20 border-border/30 mb-3">
                          <CardContent className="p-3 text-sm">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div>
                                <div className="text-muted-foreground">Count:</div>
                                <div className="font-medium">{stats.count}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Average:</div>
                                <div className="font-medium">{stats.avg}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Lowest:</div>
                                <div className="font-medium">{stats.min}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Highest:</div>
                                <div className="font-medium">{stats.max}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="max-h-[240px] overflow-y-auto pr-1 space-y-1">
                        {history.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm p-1.5 hover:bg-secondary/10 rounded-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                {new Intl.DateTimeFormat('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  second: '2-digit'
                                }).format(item.timestamp)}
                              </span>
                              <span className="text-muted-foreground">
                                [{item.min} - {item.max}]
                              </span>
                            </div>
                            <span className="font-medium">{item.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <h2 className="font-medium text-lg mb-4 self-start">Your Random Number</h2>
                  
                  {result !== null ? (
                    <div className="w-full text-center">
                      <motion.div 
                        key={result}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-secondary/30 backdrop-blur-sm py-8 px-4 rounded-lg mb-4"
                      >
                        <p className="text-muted-foreground mb-1">Result:</p>
                        <h3 className="text-4xl md:text-6xl font-bold mb-2">{result}</h3>
                        <p className="text-xs text-muted-foreground">
                          Range: {minValue} to {maxValue}
                        </p>
                      </motion.div>
                      
                      <Button 
                        onClick={copyResult}
                        variant="outline"
                        className="min-h-[44px]"
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy Result
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full text-center p-12 border border-dashed border-border rounded-lg bg-card/30">
                      <Dice6 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Click Generate to create a random number</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">The Power of Randomness</h2>
            <p>
              Random number generation plays a crucial role in many fields including statistics, cryptography, gaming, simulation, and decision making. By producing unpredictable results within defined parameters, random numbers help eliminate bias and create fair outcomes.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Applications of Random Numbers</h2>
            <p>
              Random numbers have countless practical applications. They're used in lottery draws, statistical sampling, simulation modeling, password generation, and game development. In trading, randomness can be used for backtesting strategies against random market conditions or for paper trading simulations.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Making Decisions with Randomness</h2>
            <p>
              When faced with equally viable options, random selection can help overcome decision paralysis. This tool can be used to randomly assign tasks, select winners, or make unbiased choices. For collaborative decision-making, consider combining this with our <Link to="/countdown-timer" className="text-primary hover:underline">Countdown Timer</Link> to set time limits on each random selection round, or create sharable decision results with our <Link to="/qr-code-generator" className="text-primary hover:underline">QR Code Generator</Link>.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default RandomGenerator;
