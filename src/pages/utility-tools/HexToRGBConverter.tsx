
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const HexToRGBConverter: React.FC = () => {
  const [hexColor, setHexColor] = useState<string>('#');
  const [rgbColor, setRgbColor] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('#ffffff');
  const { toast } = useToast();

  useEffect(() => {
    if (hexColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      convertHexToRgb(hexColor);
    }
  }, [hexColor]);

  const convertHexToRgb = (hex: string) => {
    setError('');
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert 3-digit hex to 6-digit format
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    if (hex.length !== 6) {
      return;
    }
    
    try {
      // Parse hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        setError('Invalid hex color');
        return;
      }
      
      setRgbColor(`rgb(${r}, ${g}, ${b})`);
      setPreview(`#${hex}`);
    } catch (e) {
      setError('Error converting hex to RGB');
    }
  };

  const handleHexInput = (value: string) => {
    // Add # if not present
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    
    setHexColor(value);
    
    // Only validate if we have a complete hex color
    if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      convertHexToRgb(value);
    } else {
      setError('');
    }
  };
  
  const handleConvert = () => {
    if (!hexColor || hexColor === '#') {
      setError('Please enter a hex color');
      return;
    }
    
    if (!hexColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      setError('Invalid hex color format. Use #RGB or #RRGGBB');
      return;
    }
    
    convertHexToRgb(hexColor);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(rgbColor);
    toast({
      title: "Copied to clipboard",
      description: rgbColor
    });
  };

  return (
    <AppLayout activeSection="hex-to-rgb-converter" setActiveSection={() => {}}>
      <SEO 
        title="Hex to RGB Color Converter | Convert Color Codes | PipCraft Tools" 
        description="Convert hex color codes to RGB values with our free Hex to RGB converter. Includes color preview and easy copying for web design, digital art, and development projects."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Hex to RGB Color Converter</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convert hexadecimal color codes to RGB values with instant color preview.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-border/50">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label htmlFor="hex-color" className="block text-sm font-medium mb-1">
                    Enter Hex Color:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="hex-color"
                      type="text"
                      value={hexColor}
                      onChange={(e) => handleHexInput(e.target.value)}
                      placeholder="#RRGGBB or #RGB"
                      className="flex-1"
                    />
                    <Button onClick={handleConvert}>Convert</Button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                
                {rgbColor && (
                  <div className="p-4 bg-secondary/30 rounded-md">
                    <h3 className="text-sm font-medium mb-2">RGB Value:</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">{rgbColor}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard}
                        title="Copy to clipboard"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border border-border/50 overflow-hidden">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-3">Color Preview:</h3>
                <div className="flex flex-col gap-4">
                  <div 
                    className="w-full h-32 rounded-md border border-border/50" 
                    style={{ backgroundColor: preview }}
                    aria-label="Color preview"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{preview}</span>
                    <span className="text-sm">{rgbColor || 'rgb(255, 255, 255)'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Hex to RGB Color Converter</h2>
            <p>
              The Hex to RGB Color Converter is an essential tool for web developers, designers, and digital artists 
              who work with color codes across different formats. Hexadecimal (Hex) and RGB are two common ways to 
              represent colors in digital environments, and converting between them is often necessary for various projects.
            </p>
            
            <p>
              Hex color codes, such as #FF5733, are six-digit codes preceded by a hash symbol (#) that represent colors 
              in many design applications and HTML/CSS. Each pair of digits represents the red, green, and blue 
              components of a color in hexadecimal (base-16) notation. Short three-digit hex codes like #F57 are 
              expanded to six digits by duplicating each digit (#FF5577).
            </p>
            
            <p>
              RGB colors, on the other hand, use decimal values from 0 to 255 for each color component: Red, Green, and Blue. 
              For example, rgb(255, 87, 51) is the RGB equivalent of #FF5733. This format is commonly used in CSS, image 
              editing software, and programming.
            </p>
            
            <p>
              Our converter offers instant translation between these formats with a real-time color preview, 
              making it simple to visualize your colors and copy the RGB values for use in your projects. 
              For more color-related tools, try our <a href="/random-generator" className="text-primary hover:underline">Random Generator</a> 
              which can generate random colors, or explore our <a href="/tools" className="text-primary hover:underline">other utility tools</a> 
              for more creative and development resources.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default HexToRGBConverter;
