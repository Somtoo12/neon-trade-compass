import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Binary } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';
import BlogPost from '@/components/shared/BlogPost';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

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

  const binaryToDecimalBlogContent = (
    <div className="space-y-8">
      <h2 id="understanding-binary-conversion" className="text-2xl font-semibold mt-8">Understanding Binary to Decimal Conversion: A Complete Guide</h2>
      
      <p className="text-muted-foreground text-lg leading-relaxed">
        Binary to decimal conversion is a fundamental skill in computer science and digital electronics. 
        Whether you're a programming student, IT professional, or digital electronics enthusiast, understanding 
        how to convert between number systems is essential for working with computers at a fundamental level.
      </p>
      
      <h3 id="what-is-binary" className="text-xl font-semibold mt-8">What is Binary and Why Does it Matter?</h3>
      
      <p>
        Binary (base-2) is the language computers speak at their core. Unlike our everyday decimal system that uses 
        ten digits (0-9), binary uses only two digits: 0 and 1. These binary digits, or "bits," are the building blocks 
        of all digital information processing. Every instruction, every piece of data, and every calculation in your 
        computer ultimately boils down to these binary digits.
      </p>
      
      <p>
        The reason computers use binary is simple: electronic components can easily represent two states—on or off, 
        high voltage or low voltage. These two states map perfectly to the binary digits 1 and 0.
      </p>
      
      <h3 id="binary-to-decimal-conversion-explained" className="text-xl font-semibold mt-8">Binary to Decimal Conversion Explained</h3>
      
      <p>
        Converting from binary to decimal involves understanding place values. In our familiar decimal system, each 
        position represents a power of 10 (ones, tens, hundreds, etc.). In binary, each position represents a power of 2.
      </p>
      
      <p>
        Starting from the rightmost digit (least significant bit):
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>First position: 2⁰ = 1</li>
        <li>Second position: 2¹ = 2</li>
        <li>Third position: 2² = 4</li>
        <li>Fourth position: 2³ = 8</li>
        <li>Fifth position: 2⁴ = 16</li>
        <li>And so on...</li>
      </ul>
      
      <p>
        To convert a binary number to decimal, multiply each digit by its corresponding place value and sum the results.
      </p>
      
      <div className="bg-secondary/20 p-6 rounded-lg my-8 border border-border/40">
        <h4 className="text-lg font-medium mb-3">Example: Converting 10110₂ to Decimal</h4>
        
        <p>
          Let's break down the conversion of binary 10110 to decimal:
        </p>
        
        <ul className="list-none space-y-1 my-4 font-mono">
          <li>1 × 2⁴ = 1 × 16 = 16</li>
          <li>0 × 2³ = 0 × 8 = 0</li>
          <li>1 × 2² = 1 × 4 = 4</li>
          <li>1 × 2¹ = 1 × 2 = 2</li>
          <li>0 × 2⁰ = 0 × 1 = 0</li>
        </ul>
        
        <p>
          Sum: 16 + 0 + 4 + 2 + 0 = 22
        </p>
        
        <p className="font-semibold mt-2">
          Therefore, 10110₂ = 22₁₀
        </p>
      </div>
      
      <h3 id="decimal-to-binary-conversion">Decimal to Binary Conversion</h3>
      
      <p>
        Converting from decimal to binary involves repeatedly dividing the decimal number by 2 and tracking the remainders. 
        The binary representation is formed by reading the remainders from bottom to top.
      </p>
      
      <h4>Example: Converting 42₁₀ to Binary</h4>
      
      <ul>
        <li>42 ÷ 2 = 21 with remainder 0</li>
        <li>21 ÷ 2 = 10 with remainder 1</li>
        <li>10 ÷ 2 = 5 with remainder 0</li>
        <li>5 ÷ 2 = 2 with remainder 1</li>
        <li>2 ÷ 2 = 1 with remainder 0</li>
        <li>1 ÷ 2 = 0 with remainder 1</li>
      </ul>
      
      <p>
        Reading the remainders from bottom to top: 101010
      </p>
      
      <p>
        Therefore, 42₁₀ = 101010₂
      </p>
      
      <h3 id="practical-applications">Practical Applications of Binary Conversion</h3>
      
      <p>
        Understanding binary conversion has numerous practical applications:
      </p>
      
      <ol>
        <li>
          <strong>Computer Programming</strong>: Many programming languages allow binary literals and operations. 
          Understanding how binary works helps debug bit-manipulation code and optimize algorithms.
        </li>
        <li>
          <strong>Digital Electronics</strong>: Hardware engineers work directly with binary when designing digital circuits 
          and logic gates.
        </li>
        <li>
          <strong>Networking</strong>: IP addresses, subnet masks, and MAC addresses are often represented in binary 
          for configuration and troubleshooting.
        </li>
        <li>
          <strong>Data Compression</strong>: Many compression algorithms work at the bit level, requiring an understanding 
          of binary representation.
        </li>
        <li>
          <strong>Computer Security</strong>: Bitwise operations are common in encryption algorithms and security protocols.
        </li>
      </ol>
      
      <h3 id="how-to-use-the-converter">How to Use Our Binary to Decimal Converter</h3>
      
      <p>
        Our <strong>free online binary converter</strong> makes number system conversion simple:
      </p>
      
      <h4>For Binary to Decimal Conversion:</h4>
      
      <ol>
        <li>Select the "Binary to Decimal" tab</li>
        <li>Enter your binary number (consisting of only 0s and 1s)</li>
        <li>Click "Convert"</li>
        <li>View your decimal result instantly</li>
      </ol>
      
      <h4>For Decimal to Binary Conversion:</h4>
      
      <ol>
        <li>Select the "Decimal to Binary" tab</li>
        <li>Enter your decimal number (positive integers only)</li>
        <li>Click "Convert"</li>
        <li>View your binary result instantly</li>
      </ol>
      
      <p>
        This <strong>easy-to-use binary calculator</strong> eliminates the manual calculation needed for binary conversion, 
        making it perfect for students, programmers, and professionals alike.
      </p>
      
      <h3 id="common-conversion-scenarios">Common Binary Conversion Scenarios</h3>
      
      <p>
        Here are some common scenarios where you might need to convert between binary and decimal:
      </p>
      
      <ul>
        <li>
          <strong>Programming with Bitwise Operations</strong>: When working with flags, masks, or bit manipulation in languages 
          like C, C++, or JavaScript, you'll often need to convert between number systems.
        </li>
        <li>
          <strong>Computer Science Education</strong>: Students learning about number systems frequently practice binary conversion 
          as part of their curriculum.
        </li>
        <li>
          <strong>Working with Digital Logic</strong>: When designing or analyzing digital circuits, understanding how binary values 
          translate to decimal helps in verification and debugging.
        </li>
        <li>
          <strong>Memory Address Calculations</strong>: Systems programmers working close to hardware often need to convert between 
          binary and decimal when dealing with memory addresses.
        </li>
      </ul>
      
      <h3 id="related-number-systems">Related Number Systems: Beyond Binary</h3>
      
      <p>
        While binary is fundamental, there are other number systems frequently used in computing:
      </p>
      
      <ul>
        <li>
          <strong>Octal (Base-8)</strong>: Uses digits 0-7, with each digit representing 3 bits. Historically used in some computing systems.
        </li>
        <li>
          <strong>Hexadecimal (Base-16)</strong>: Uses digits 0-9 and letters A-F. Common for representing binary values more concisely, 
          as each hex digit represents exactly 4 bits. Our <Link to="/hex-to-rgb-converter" className="text-primary hover:underline">Hex to RGB Converter</Link> helps translate hexadecimal color codes.
        </li>
        <li>
          <strong>Decimal (Base-10)</strong>: Our everyday number system, using digits 0-9.
        </li>
      </ul>
      
      <p>
        Conversion between these systems is a common task in computer science and programming.
      </p>
      
      <h3 id="binary-conversion-tips">Tips for Working with Binary Numbers</h3>
      
      <ol>
        <li>
          <strong>Memorize Powers of 2</strong>: Knowing the first several powers of 2 (1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024) 
          makes manual conversion much faster.
        </li>
        <li>
          <strong>Practice Grouping Binary Digits</strong>: When working with long binary numbers, group them in sets of 4 digits 
          for easier reading and conversion to hexadecimal.
        </li>
        <li>
          <strong>Use Tools for Complex Conversions</strong>: For large numbers or frequent conversions, use our binary calculator 
          to save time and ensure accuracy.
        </li>
        <li>
          <strong>Understand the Context</strong>: Different applications may interpret binary differently (signed vs. unsigned integers, 
          floating-point representation, etc.).
        </li>
      </ol>
      
      <h3 id="related-tools">Related Tools at PipCraft</h3>
      
      <p>
        PipCraft offers several tools related to number systems and calculations:
      </p>
      
      <ul>
        <li>
          <Link to="/hex-to-rgb-converter" className="text-primary hover:underline">Hex to RGB Converter</Link> - 
          Convert between hexadecimal color codes and RGB values
        </li>
        <li>
          <Link to="/number-to-words-converter" className="text-primary hover:underline">Number to Words Converter</Link> - 
          Convert numeric values to their written text form
        </li>
        <li>
          <Link to="/character-counter" className="text-primary hover:underline">Character Counter</Link> - 
          Count characters, words, and more in your text
        </li>
        <li>
          <Link to="/random-generator" className="text-primary hover:underline">Random Number Generator</Link> - 
          Generate random numbers within specified ranges
        </li>
      </ul>
      
      <h3 id="conclusion">Conclusion: The Power of Binary Conversion</h3>
      
      <p>
        Binary conversion is more than just an academic exercise—it's a fundamental skill for anyone working with computers 
        at a deeper level. Whether you're a student learning the basics of computer science, a programmer debugging bit-level 
        issues, or an electronics enthusiast designing digital circuits, understanding binary is essential.
      </p>
      
      <p>
        Our <strong>online binary number converter</strong> makes this process easy and accessible, allowing you to quickly 
        translate between binary and decimal without manual calculation. Bookmark this page for quick access whenever you need 
        to convert between number systems!
      </p>
      
      <h3 id="faqs">Frequently Asked Questions About Binary Conversion</h3>
      
      <h4>What is the difference between binary and decimal number systems?</h4>
      <p>
        The decimal system (base-10) uses ten digits (0-9) with place values based on powers of 10, while the binary system (base-2) 
        uses only two digits (0 and 1) with place values based on powers of 2. Decimal is our everyday counting system, while binary 
        is the fundamental language of digital computers.
      </p>
      
      <h4>Why do computers use binary instead of decimal?</h4>
      <p>
        Computers use binary because electronic components naturally have two stable states (on/off, high/low voltage), making binary 
        representation efficient at the hardware level. It's also mathematically simpler to implement logic operations with binary values.
      </p>
      
      <h4>How do I convert large binary numbers to decimal?</h4>
      <p>
        For large binary numbers, it's best to use a tool like our binary to decimal converter. For manual conversion, break the binary 
        number into manageable groups, convert each group, and then combine the results.
      </p>
      
      <h4>What are some common errors when converting binary to decimal?</h4>
      <p>
        Common errors include miscalculating place values, dropping digits, or using incorrect powers of 2. Using our converter eliminates 
        these potential errors and provides instant, accurate results.
      </p>
      
      <h4>Where else is binary used besides computers?</h4>
      <p>
        Binary is used in digital communications, electronic displays, digital signal processing, and any system that processes discrete 
        data. Even the Morse code (dots and dashes) represents a type of binary encoding.
      </p>
    </div>
  );

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
          
          <BlogPost 
            title="Complete Guide to Binary to Decimal Conversion"
            content={binaryToDecimalBlogContent}
          />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default BinaryToDecimalConverter;
