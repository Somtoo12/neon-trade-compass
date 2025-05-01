
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const MilesToKMConverter: React.FC = () => {
  const [miles, setMiles] = useState<string>('');
  const [kilometers, setKilometers] = useState<string>('');
  const [fahrenheit, setFahrenheit] = useState<string>('');
  const [celsius, setCelsius] = useState<string>('');
  const [pounds, setPounds] = useState<string>('');
  const [kilograms, setKilograms] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('distance');
  const { toast } = useToast();

  useEffect(() => {
    // Reset errors when tab changes
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('border-red-500'));
  }, [activeTab]);

  const convertMilesToKm = (val: string) => {
    const milesValue = parseFloat(val);
    if (isNaN(milesValue)) {
      setKilometers('');
      return;
    }
    setKilometers((milesValue * 1.60934).toFixed(2));
  };

  const convertKmToMiles = (val: string) => {
    const kmValue = parseFloat(val);
    if (isNaN(kmValue)) {
      setMiles('');
      return;
    }
    setMiles((kmValue / 1.60934).toFixed(2));
  };

  const convertFahrenheitToCelsius = (val: string) => {
    const fValue = parseFloat(val);
    if (isNaN(fValue)) {
      setCelsius('');
      return;
    }
    setCelsius(((fValue - 32) * 5 / 9).toFixed(2));
  };

  const convertCelsiusToFahrenheit = (val: string) => {
    const cValue = parseFloat(val);
    if (isNaN(cValue)) {
      setFahrenheit('');
      return;
    }
    setFahrenheit(((cValue * 9 / 5) + 32).toFixed(2));
  };

  const convertPoundsToKilograms = (val: string) => {
    const lbsValue = parseFloat(val);
    if (isNaN(lbsValue)) {
      setKilograms('');
      return;
    }
    setKilograms((lbsValue * 0.453592).toFixed(2));
  };

  const convertKilogramsToPounds = (val: string) => {
    const kgValue = parseFloat(val);
    if (isNaN(kgValue)) {
      setPounds('');
      return;
    }
    setPounds((kgValue / 0.453592).toFixed(2));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = e.target.value;
    
    // Only allow numbers and a single decimal point
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      if (type === 'miles') {
        setMiles(value);
        if (value) convertMilesToKm(value);
      } else if (type === 'km') {
        setKilometers(value);
        if (value) convertKmToMiles(value);
      } else if (type === 'fahrenheit') {
        setFahrenheit(value);
        if (value) convertFahrenheitToCelsius(value);
      } else if (type === 'celsius') {
        setCelsius(value);
        if (value) convertCelsiusToFahrenheit(value);
      } else if (type === 'pounds') {
        setPounds(value);
        if (value) convertPoundsToKilograms(value);
      } else if (type === 'kg') {
        setKilograms(value);
        if (value) convertKilogramsToPounds(value);
      }
    }
  };

  const copyToClipboard = (value: string, label: string) => {
    if (!value) return;
    
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: `${value} ${label}`
    });
  };

  return (
    <AppLayout activeSection="miles-to-km-converter" setActiveSection={() => {}}>
      <SEO 
        title="Miles to KM Converter | Convert Units Easily | PipCraft Tools" 
        description="Convert between miles and kilometers, Fahrenheit and Celsius, pounds and kilograms with our free unit converter. Fast, accurate, and simple to use for all your conversion needs."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Unit Converter</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convert between miles and kilometers, Fahrenheit and Celsius, pounds and kilograms.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6">
              <Tabs defaultValue="distance" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="distance">Distance</TabsTrigger>
                  <TabsTrigger value="temperature">Temperature</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                </TabsList>
                
                <TabsContent value="distance" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="miles-input" className="block text-sm font-medium mb-1">
                        Miles:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="miles-input"
                          type="text"
                          value={miles}
                          onChange={(e) => handleInputChange(e, 'miles')}
                          placeholder="Enter miles"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={!miles} 
                          onClick={() => copyToClipboard(miles, 'miles')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="kilometers-input" className="block text-sm font-medium mb-1">
                        Kilometers:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="kilometers-input"
                          type="text"
                          value={kilometers}
                          onChange={(e) => handleInputChange(e, 'km')}
                          placeholder="Enter kilometers"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={!kilometers}
                          onClick={() => copyToClipboard(kilometers, 'km')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-md text-sm">
                    <p className="font-medium mb-1">Conversion Formula:</p>
                    <p>1 mile = 1.60934 kilometers</p>
                    <p>1 kilometer = 0.621371 miles</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="temperature" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fahrenheit-input" className="block text-sm font-medium mb-1">
                        Fahrenheit (°F):
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="fahrenheit-input"
                          type="text"
                          value={fahrenheit}
                          onChange={(e) => handleInputChange(e, 'fahrenheit')}
                          placeholder="Enter Fahrenheit"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={!fahrenheit}
                          onClick={() => copyToClipboard(fahrenheit, '°F')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="celsius-input" className="block text-sm font-medium mb-1">
                        Celsius (°C):
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="celsius-input"
                          type="text"
                          value={celsius}
                          onChange={(e) => handleInputChange(e, 'celsius')}
                          placeholder="Enter Celsius"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={!celsius}
                          onClick={() => copyToClipboard(celsius, '°C')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-md text-sm">
                    <p className="font-medium mb-1">Conversion Formulas:</p>
                    <p>°C = (°F - 32) × 5/9</p>
                    <p>°F = (°C × 9/5) + 32</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="weight" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="pounds-input" className="block text-sm font-medium mb-1">
                        Pounds (lb):
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="pounds-input"
                          type="text"
                          value={pounds}
                          onChange={(e) => handleInputChange(e, 'pounds')}
                          placeholder="Enter pounds"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={!pounds}
                          onClick={() => copyToClipboard(pounds, 'lb')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="kilograms-input" className="block text-sm font-medium mb-1">
                        Kilograms (kg):
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="kilograms-input"
                          type="text"
                          value={kilograms}
                          onChange={(e) => handleInputChange(e, 'kg')}
                          placeholder="Enter kilograms"
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={!kilograms}
                          onClick={() => copyToClipboard(kilograms, 'kg')}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-md text-sm">
                    <p className="font-medium mb-1">Conversion Formula:</p>
                    <p>1 pound = 0.453592 kilograms</p>
                    <p>1 kilogram = 2.20462 pounds</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Unit Converter</h2>
            <p>
              The Unit Converter is a versatile tool designed to help you convert between different 
              measurement systems quickly and accurately. Whether you need to translate miles to kilometers 
              for international travel, convert temperatures between Fahrenheit and Celsius for weather 
              comparisons, or switch between pounds and kilograms for weight measurements, this tool 
              provides instant conversions with precise formulas.
            </p>
            
            <p>
              For distance conversions, the tool uses the standard conversion rate of 1 mile being equal 
              to 1.60934 kilometers. This is particularly useful for travelers moving between countries 
              that use different measurement systems, athletes comparing race distances, or anyone working 
              with international maps and distance calculations.
            </p>
            
            <p>
              Temperature conversions utilize the formulas Celsius = (Fahrenheit - 32) × 5/9 and 
              Fahrenheit = (Celsius × 9/5) + 32. These conversions are essential for understanding weather 
              forecasts in different regions, following cooking recipes from international sources, or 
              interpreting scientific data that may use different temperature scales.
            </p>
            
            <p>
              Weight conversions between pounds and kilograms (1 pound = 0.453592 kilograms) are valuable 
              for international shopping, fitness tracking, shipping calculations, and medical dosing where 
              different weight units might be used. This all-in-one converter eliminates the need for 
              multiple tools or complex calculations, providing quick and reliable results for all your 
              conversion needs. For more calculation tools, try our <a href="/tip-calculator" className="text-primary hover:underline">Tip Calculator</a> 
              or explore our <a href="/tools" className="text-primary hover:underline">full suite of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default MilesToKMConverter;
