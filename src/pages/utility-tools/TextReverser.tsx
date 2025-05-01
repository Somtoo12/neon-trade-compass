
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RotateCw, CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const TextReverser: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [reversedText, setReversedText] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (inputText) {
      reverseText(inputText);
    } else {
      setReversedText('');
    }
  }, [inputText]);
  
  const reverseText = (text: string) => {
    // Split the string into an array of characters, reverse it, and join it back
    const reversed = text.split('').reverse().join('');
    setReversedText(reversed);
  };
  
  const copyToClipboard = () => {
    if (!reversedText) return;
    
    navigator.clipboard.writeText(reversedText);
    toast({
      title: "Copied to clipboard",
      description: "The reversed text has been copied to your clipboard."
    });
  };
  
  const handleReverseButtonClick = () => {
    if (!inputText) {
      toast({
        title: "No text to reverse",
        description: "Please enter some text to reverse.",
        variant: "destructive"
      });
      return;
    }
    
    reverseText(inputText);
    toast({
      title: "Text Reversed",
      description: "Your text has been reversed successfully."
    });
  };
  
  const handleClear = () => {
    setInputText('');
    setReversedText('');
  };

  return (
    <AppLayout activeSection="text-reverser" setActiveSection={() => {}}>
      <SEO 
        title="Text Reverser | Reverse Any Text Instantly | PipCraft Tools" 
        description="Reverse any text or string instantly with our free Text Reverser. Perfect for fun, creative projects, or checking palindromes. Simple, fast, and easy to use."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Text Reverser</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Instantly reverse any text - letters, words, and sentences will appear backwards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-border/50">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-2">Original Text:</h3>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to reverse..."
                  className="min-h-32 resize-none mb-4"
                />
                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button onClick={handleReverseButtonClick} className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4" /> 
                    Reverse Text
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Reversed Text:</h3>
                  {reversedText && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={copyToClipboard}
                      title="Copy to clipboard"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="min-h-32 bg-secondary/30 rounded-md p-3 whitespace-pre-wrap break-words">
                  {reversedText || 'Reversed text will appear here...'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Text Reverser</h2>
            <p>
              The Text Reverser is a simple yet fun tool that instantly reverses any text you enter. 
              Each character in your input text is flipped to create a mirror image of the original content. 
              This means that "Hello World" becomes "dlroW olleH" - with each character appearing in reverse order.
            </p>
            
            <p>
              Text reversal has various applications, from entertainment and creative purposes to more practical uses. 
              It's commonly used for creating fun social media posts, designing unique logos or t-shirt prints, 
              and crafting puzzles or riddles. Some languages like Hebrew and Arabic are written right-to-left, 
              making text reversal an interesting way to experiment with different writing systems.
            </p>
            
            <p>
              The tool can also be useful for checking palindromes - words, phrases, or sequences that read the same 
              backward as forward, such as "radar" or "A man, a plan, a canal, Panama." By reversing text, you can quickly 
              verify if a string is a palindrome by comparing the original with the reversed version.
            </p>
            
            <p>
              Our Text Reverser handles any characters you input, including letters, numbers, symbols, spaces, and even emojis. 
              The reversed text can be easily copied to your clipboard for use in other applications. For more text 
              manipulation tools, check out our <a href="/character-counter" className="text-primary hover:underline">Character Counter</a> or 
              explore our <a href="/tools" className="text-primary hover:underline">other utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default TextReverser;
