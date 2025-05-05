import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';
import BlogPostSection from '@/components/shared/BlogPostSection';
import { Link } from 'react-router-dom';

const BinaryToDecimalConverter: React.FC = () => {
  const [binary, setBinary] = useState<string>('');
  const [decimal, setDecimal] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'binary-to-decimal' | 'decimal-to-binary'>('binary-to-decimal');
  const [error, setError] = useState<string>('');

  // Clear error when input changes
  useEffect(() => {
    setError('');
  }, [binary, decimal]);

  const convertBinaryToDecimal = () => {
    if (!binary) {
      setError('Please enter a binary number');
      return;
    }

    // Validate binary input
    if (!/^[01]+$/.test(binary)) {
      setError('Invalid binary number. Binary can only contain 0 and 1.');
      return;
    }

    try {
      const result = parseInt(binary, 2);
      setDecimal(result.toString());
    } catch (e) {
      setError('Error converting binary to decimal');
    }
  };

  const convertDecimalToBinary = () => {
    if (!decimal) {
      setError('Please enter a decimal number');
      return;
    }

    // Validate decimal input
    if (!/^\d+$/.test(decimal)) {
      setError('Invalid decimal number. Please enter only digits.');
      return;
    }

    try {
      const num = parseInt(decimal, 10);
      if (num < 0) {
        setError('Please enter a positive decimal number');
        return;
      }
      const result = num.toString(2);
      setBinary(result);
    } catch (e) {
      setError('Error converting decimal to binary');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'binary-to-decimal' | 'decimal-to-binary');
    setError('');
    setBinary('');
    setDecimal('');
  };

  return (
    <AppLayout activeSection="binary-to-decimal-converter" setActiveSection={() => {}}>
      <SEO 
        title="Binary to Decimal Converter | Easy Number Base Conversion | PipCraft Tools" 
        description="Convert between binary and decimal numbers instantly with our free bi-directional converter. Perfect for programmers, students, and anyone working with different number systems."
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Binary to Decimal Converter</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Convert between binary (base-2) and decimal (base-10) number systems quickly and easily.
            </p>
          </div>

          <Card className="border border-border/50 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <Tabs defaultValue="binary-to-decimal" onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="binary-to-decimal" className="text-md py-3">Binary to Decimal</TabsTrigger>
                  <TabsTrigger value="decimal-to-binary" className="text-md py-3">Decimal to Binary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="binary-to-decimal" className="space-y-6 pt-4">
                  <div>
                    <label htmlFor="binary-input" className="block text-md font-medium mb-2">
                      Enter Binary Number:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="binary-input"
                        type="text"
                        value={binary}
                        onChange={(e) => setBinary(e.target.value)}
                        placeholder="e.g. 10110"
                        className="flex-1 text-lg"
                      />
                      <Button onClick={convertBinaryToDecimal} className="px-6">Convert</Button>
                    </div>
                  </div>
                  
                  {decimal && !error && (
                    <div className="p-6 bg-secondary/20 rounded-lg border border-border/40">
                      <h3 className="text-md font-medium mb-2">Decimal Result:</h3>
                      <p className="text-2xl font-mono font-semibold text-primary">{decimal}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="decimal-to-binary" className="space-y-6 pt-4">
                  <div>
                    <label htmlFor="decimal-input" className="block text-md font-medium mb-2">
                      Enter Decimal Number:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="decimal-input"
                        type="text"
                        value={decimal}
                        onChange={(e) => setDecimal(e.target.value)}
                        placeholder="e.g. 42"
                        className="flex-1 text-lg"
                      />
                      <Button onClick={convertDecimalToBinary} className="px-6">Convert</Button>
                    </div>
                  </div>
                  
                  {binary && !error && (
                    <div className="p-6 bg-secondary/20 rounded-lg border border-border/40">
                      <h3 className="text-md font-medium mb-2">Binary Result:</h3>
                      <p className="text-2xl font-mono font-semibold text-primary">{binary}</p>
                    </div>
                  )}
                </TabsContent>
                
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </Tabs>
            </CardContent>
          </Card>

          <div className="prose prose-lg dark:prose-invert max-w-none bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">About Binary to Decimal Converter</h2>
            <p>
              The Binary to Decimal Converter is an essential tool for anyone working with different number systems. 
              Binary (base-2) is the fundamental language of computers, using only two digits: 0 and 1. 
              Decimal (base-10) is our standard counting system, using ten digits from 0 to 9.
            </p>
            
            <p>
              Converting between these number systems is a fundamental operation in computer science, 
              digital electronics, programming, and mathematics. Our bidirectional converter allows you 
              to easily translate numbers from binary to decimal and vice versa with just a click.
            </p>
            
            <p>
              In binary, each position represents a power of 2, starting from the rightmost digit. 
              For example, the binary number 10110 equals (1×2⁴) + (0×2³) + (1×2²) + (1×2¹) + (0×2⁰) = 22 in decimal.
              Conversely, to convert decimal to binary, we divide the number by 2 repeatedly and record the remainders.
            </p>
            
            <p>
              Whether you're a student learning about number systems, a programmer debugging code, 
              or an electronics enthusiast working with digital circuits, this converter provides 
              fast and accurate conversions. Try our <Link to="/hex-to-rgb-converter" className="text-primary hover:underline">Hex to RGB Converter</Link> for color code conversions, 
              or check out our <Link to="/tools" className="text-primary hover:underline">other utility tools</Link> for more helpful resources.
            </p>
          </div>
          
          <BlogPostSection toolId="binary-to-decimal-converter" />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default BinaryToDecimalConverter;
