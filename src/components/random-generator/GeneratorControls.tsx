
import React from 'react';
import { Dice6, RotateCcw, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GeneratorControlsProps {
  minValue: string;
  maxValue: string;
  handleMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generateRandom: () => void;
  resetValues: () => void;
}

const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  minValue,
  maxValue,
  handleMinChange,
  handleMaxChange,
  generateRandom,
  resetValues,
}) => {
  return (
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
    </div>
  );
};

export default GeneratorControls;
