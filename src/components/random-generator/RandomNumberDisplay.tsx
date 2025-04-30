
import React from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RandomNumberDisplayProps {
  result: number | null;
  minValue: string;
  maxValue: string;
}

const RandomNumberDisplay: React.FC<RandomNumberDisplayProps> = ({ 
  result, 
  minValue, 
  maxValue 
}) => {
  const { toast } = useToast();

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      toast({
        title: "Copied!",
        description: `${result} copied to clipboard`,
      });
    }
  };

  return (
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
          <div className="h-12 w-12 mx-auto mb-3 text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path d="M17 7.82L19.82 10L17 7.82ZM19.82 10L17 12.18L19.82 10ZM19.82 10H4.17H19.82ZM7 4.17L4.17 7L7 4.17ZM4.17 7L7 9.83L4.17 7ZM4.17 7L4.17 17L4.17 7ZM8.17 16.83H13.83H8.17ZM17 14.17L19.82 16.99L17 19.83L19.82 16.99L17 14.17ZM14.17 4.17V11.83V4.17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-muted-foreground">Click Generate to create a random number</p>
        </div>
      )}
    </div>
  );
};

export default RandomNumberDisplay;
