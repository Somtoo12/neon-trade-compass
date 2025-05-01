
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const DailyWaterIntakeCalculator: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<{liters: number; oz: number} | null>(null);
  const [error, setError] = useState<string>('');

  const calculateWaterIntake = () => {
    setError('');

    // Validation
    if (!age || !weight) {
      setError('Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    let weightNum = parseFloat(weight);

    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please enter a valid age between 1 and 120');
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    // Convert pounds to kg if needed
    if (weightUnit === 'lb') {
      weightNum = weightNum * 0.453592;
    }

    // Base calculation: 30-35ml per kg of body weight
    let baseIntake = weightNum * 30;

    // Adjust for age
    if (ageNum > 65) {
      baseIntake *= 0.9; // Less water for elderly
    } else if (ageNum < 18) {
      baseIntake *= 1.1; // More water for younger people
    }

    // Adjust for activity level
    switch (activityLevel) {
      case 'sedentary':
        baseIntake *= 0.85;
        break;
      case 'moderate':
        // No adjustment for moderate (default)
        break;
      case 'active':
        baseIntake *= 1.15;
        break;
      case 'very-active':
        baseIntake *= 1.3;
        break;
      default:
        break;
    }

    // Convert to liters (ml / 1000)
    const liters = parseFloat((baseIntake / 1000).toFixed(2));
    // Convert to fluid oz (liters * 33.814)
    const oz = parseFloat((liters * 33.814).toFixed(2));

    setResult({ liters, oz });
  };

  return (
    <AppLayout activeSection="daily-water-intake-calculator" setActiveSection={() => {}}>
      <SEO 
        title="Daily Water Intake Calculator | Hydration Needs Calculator | PipCraft Tools" 
        description="Calculate your personalized daily water intake based on age, weight, and activity level with our free water intake calculator. Stay optimally hydrated for better health and wellness."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Daily Water Intake Calculator</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Calculate your recommended daily water intake based on your age, weight, and activity level.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-1">
                  Age:
                </label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-1">
                  Weight:
                </label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    min="1"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter your weight"
                    className="flex-1"
                  />
                  <Select 
                    value={weightUnit} 
                    onValueChange={(val) => setWeightUnit(val as 'kg' | 'lb')}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-medium mb-1">
                  Activity Level:
                </label>
                <Select 
                  value={activityLevel} 
                  onValueChange={setActivityLevel}
                >
                  <SelectTrigger id="activity" className="w-full">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="moderate">Moderate (Exercise 1-3 times/week)</SelectItem>
                    <SelectItem value="active">Active (Exercise 4-5 times/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (Daily exercise or physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={calculateWaterIntake}>
                Calculate Water Intake
              </Button>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {result && (
                <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                  <h3 className="text-sm font-medium mb-4">Your Recommended Daily Water Intake:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-semibold text-primary mb-2">{result.liters}</div>
                      <p className="text-sm text-muted-foreground">Liters</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-semibold text-primary mb-2">{result.oz}</div>
                      <p className="text-sm text-muted-foreground">Fluid Ounces</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Daily Water Intake Calculator</h2>
            <p>
              The Daily Water Intake Calculator is a useful tool for determining how much water your body needs 
              to stay properly hydrated. While the general recommendation of eight 8-ounce glasses (about 2 liters) 
              per day is widely known, individual hydration needs can vary significantly based on several factors.
            </p>
            
            <p>
              This calculator takes into account your age, weight, and activity level to provide a personalized 
              hydration recommendation. Weight is a primary factor because larger bodies contain more water and 
              require more fluid to maintain optimal hydration. Age is considered because hydration needs change 
              throughout the lifespan, with older adults often requiring more conscious attention to fluid intake.
            </p>
            
            <p>
              Activity level significantly impacts water requirements as well. More active individuals lose more 
              water through sweat and respiration and therefore need increased fluid intake. Our calculator adjusts 
              the base recommendation accordingly, with modifications for sedentary, moderately active, active, and 
              very active lifestyles.
            </p>
            
            <p>
              Maintaining proper hydration is essential for numerous bodily functions, including temperature regulation, 
              joint lubrication, infection prevention, organ function, and delivering nutrients to cells. By using this 
              calculator regularly and adjusting for changing circumstances like weather or illness, you can ensure 
              you're getting the right amount of water for your unique needs. For more health-related tools, try our 
              <a href="/bmi-calculator" className="text-primary hover:underline">BMI Calculator</a> or explore our complete 
              <a href="/tools" className="text-primary hover:underline">suite of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DailyWaterIntakeCalculator;
