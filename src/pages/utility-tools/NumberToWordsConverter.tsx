
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListOrdered } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const NumberToWordsConverter: React.FC = () => {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

  const convertLessThanThousand = (num: number): string => {
    if (num === 0) return '';
    
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' hundred ';
      num %= 100;
      if (num !== 0) result += 'and ';
    }
    
    if (num >= 10 && num < 20) {
      result += teens[num - 10] + ' ';
      return result.trim();
    } else if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    return result.trim();
  };
  
  const handleConvert = () => {
    try {
      setError('');
      const num = parseFloat(number.replace(/,/g, ''));
      
      if (isNaN(num)) {
        setError('Please enter a valid number');
        setResult('');
        return;
      }
      
      if (num > 999999999999999) {
        setError('Number is too large to convert');
        setResult('');
        return;
      }
      
      if (num === 0) {
        setResult('Zero');
        return;
      }
      
      // Handle negative numbers
      const isNegative = num < 0;
      const absNum = Math.abs(num);
      
      // Handle decimal part
      const parts = absNum.toString().split('.');
      const integerPart = parseInt(parts[0]);
      
      let words = '';
      
      // Process integer part
      if (integerPart === 0) {
        words = 'zero';
      } else {
        // Split number into groups of 3 digits
        let remaining = integerPart;
        let scaleIndex = 0;
        
        while (remaining > 0) {
          const chunk = remaining % 1000;
          
          if (chunk !== 0) {
            const chunkWords = convertLessThanThousand(chunk);
            words = chunkWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] : '') + 
                   (words ? ' ' + words : '');
          }
          
          scaleIndex++;
          remaining = Math.floor(remaining / 1000);
        }
      }
      
      // Handle decimal part if present
      if (parts.length > 1 && parseInt(parts[1]) > 0) {
        words += ' point';
        const decimalDigits = parts[1].split('');
        decimalDigits.forEach(digit => {
          words += ' ' + ones[parseInt(digit)];
        });
      }
      
      // Apply negative if needed
      if (isNegative) {
        words = 'negative ' + words;
      }
      
      // Capitalize first letter
      setResult(words.charAt(0).toUpperCase() + words.slice(1));
      
    } catch (e) {
      setError('An error occurred while converting');
      setResult('');
    }
  };

  return (
    <AppLayout activeSection="number-to-words-converter" setActiveSection={() => {}}>
      <SEO 
        title="Number to Words Converter | Convert Numbers to Text | PipCraft Tools" 
        description="Convert any number into words with our free Number to Words Converter. Easily translate numeric values into written text for checks, legal documents, or educational purposes."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Number to Words Converter</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convert any number into written words. Useful for writing checks, legal documents, or educational purposes.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium mb-1">
                    Enter a number:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="number"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="e.g. 1541400"
                      className="flex-1"
                    />
                    <Button onClick={handleConvert}>Convert</Button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                {result && (
                  <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Result:</h3>
                    <p className="text-lg font-medium">{result}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Number to Words Converter</h2>
            <p>
              The Number to Words Converter is a practical tool that translates numerical values into their written word equivalents. 
              This conversion is essential for various applications, including writing checks, drafting legal documents, 
              creating educational materials, or simply learning how to properly express numbers in written form.
            </p>
            
            <p>
              Our converter handles numbers across a wide range, from simple integers to complex figures with 
              decimal points. It correctly applies grammatical rules for different scales (thousands, millions, billions) 
              and handles special cases like teens (11-19) which follow unique naming patterns in English.
            </p>
            
            <p>
              This tool is particularly valuable for financial documentation where accuracy is crucial. 
              When writing checks or contracts, converting numbers to words provides an additional safeguard 
              against misinterpretation or alteration of numerical values. In educational settings, it helps 
              students understand number naming conventions and numerical literacy.
            </p>
            
            <p>
              To use the converter, simply enter any number into the input field and click the "Convert" button.
              The tool will instantly generate the written word equivalent with proper formatting and capitalization.
              Try our <a href="/random-generator" className="text-primary hover:underline">Random Number Generator</a> to create test numbers,
              or check out our <a href="/calculator" className="text-primary hover:underline">Calculator Tools</a> for more mathematical utilities.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NumberToWordsConverter;
