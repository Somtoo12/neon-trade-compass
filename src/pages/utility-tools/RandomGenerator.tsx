
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import GeneratorControls from '@/components/random-generator/GeneratorControls';
import PresetButtons from '@/components/random-generator/PresetButtons';
import RandomNumberDisplay from '@/components/random-generator/RandomNumberDisplay';
import GenerationHistory from '@/components/random-generator/GenerationHistory';
import RandomGeneratorContent from '@/components/random-generator/RandomGeneratorContent';

interface GenerationHistoryItem {
  min: number;
  max: number;
  result: number;
  timestamp: Date;
}

const RandomGenerator: React.FC = () => {
  const [minValue, setMinValue] = useState<string>('1');
  const [maxValue, setMaxValue] = useState<string>('100');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
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
    const newEntry: GenerationHistoryItem = {
      min,
      max,
      result: randomNum,
      timestamp: new Date()
    };
    
    setHistory(prev => [newEntry, ...prev.slice(0, 19)]);  // Keep only last 20 results
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

  const handlePresetSelect = (min: string, max: string) => {
    setMinValue(min);
    setMaxValue(max);
  };

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
                  
                  <GeneratorControls
                    minValue={minValue}
                    maxValue={maxValue}
                    handleMinChange={handleMinChange}
                    handleMaxChange={handleMaxChange}
                    generateRandom={generateRandom}
                    resetValues={resetValues}
                  />
                  
                  {/* Presets */}
                  <div className="mt-5">
                    <PresetButtons onPresetSelect={handlePresetSelect} />
                  </div>

                  {/* History Component */}
                  <GenerationHistory history={history} />
                </div>
                
                {/* Random Number Display */}
                <RandomNumberDisplay 
                  result={result} 
                  minValue={minValue} 
                  maxValue={maxValue} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Section */}
          <RandomGeneratorContent />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default RandomGenerator;
