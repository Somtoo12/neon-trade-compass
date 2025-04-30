
import React from 'react';
import { Button } from '@/components/ui/button';

interface PresetButtonsProps {
  onPresetSelect: (min: string, max: string) => void;
}

const PresetButtons: React.FC<PresetButtonsProps> = ({ onPresetSelect }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Quick Presets</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('1', '10')} 
          className="min-h-[36px]"
        >
          1-10
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('1', '100')} 
          className="min-h-[36px]"
        >
          1-100
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('1', '1000')} 
          className="min-h-[36px]"
        >
          1-1000
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('0', '1')} 
          className="min-h-[36px]"
        >
          0/1
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('1', '6')} 
          className="min-h-[36px]"
        >
          Dice (1-6)
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetSelect('1', '52')} 
          className="min-h-[36px]"
        >
          Cards (1-52)
        </Button>
      </div>
    </div>
  );
};

export default PresetButtons;
