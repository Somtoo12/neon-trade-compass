
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, Camera, Share2, Copy } from 'lucide-react';
import { forexPairs, cryptoPairs } from '@/constants/currencyPairs';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

// Types for saved calculations
interface SavedCalculation {
  accountEquity: string;
  leverage: string;
  customLeverage: string;
  asset: string;
  currentPrice: string;
  contractSize: string;
}

const EnhancedMaxLotSizeCalculator: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State management
  const [accountEquity, setAccountEquity] = useState('10000');
  const [leverage, setLeverage] = useState('30');
  const [customLeverage, setCustomLeverage] = useState('');
  const [asset, setAsset] = useState('EUR/USD');
  const [currentPrice, setCurrentPrice] = useState('1.0000');
  const [contractSize, setContractSize] = useState('100000');
  const [maxLotSize, setMaxLotSize] = useState(0);
  
  // Load saved calculation from localStorage on component mount
  useEffect(() => {
    const savedCalc = localStorage.getItem('maxLotSizeCalculation');
    if (savedCalc) {
      try {
        const parsedCalc: SavedCalculation = JSON.parse(savedCalc);
        setAccountEquity(parsedCalc.accountEquity);
        setLeverage(parsedCalc.leverage);
        setCustomLeverage(parsedCalc.customLeverage);
        setAsset(parsedCalc.asset);
        setCurrentPrice(parsedCalc.currentPrice);
        setContractSize(parsedCalc.contractSize);
      } catch (error) {
        console.error('Failed to parse saved calculation:', error);
      }
    }
  }, []);

  // Calculate max lot size whenever inputs change
  useEffect(() => {
    const calculatedMaxLotSize = calculateMaxLotSize();
    setMaxLotSize(calculatedMaxLotSize);
    
    // Save current calculation to localStorage
    const currentCalc: SavedCalculation = {
      accountEquity,
      leverage,
      customLeverage,
      asset,
      currentPrice,
      contractSize
    };
    localStorage.setItem('maxLotSizeCalculation', JSON.stringify(currentCalc));
  }, [accountEquity, leverage, customLeverage, asset, currentPrice, contractSize]);

  const calculateMaxLotSize = () => {
    const equity = parseFloat(accountEquity);
    const leverageValue = customLeverage ? parseFloat(customLeverage) : parseFloat(leverage);
    const price = parseFloat(currentPrice);
    const contract = parseFloat(contractSize);
    
    if (isNaN(equity) || isNaN(leverageValue) || isNaN(price) || isNaN(contract) || price === 0 || contract === 0) {
      return 0;
    }
    
    return (equity * leverageValue) / (contract * price);
  };
  
  // Combined array of all trading pairs
  const allPairs = [
    ...(forexPairs.majors || []),
    ...(forexPairs.minors || []),
    ...(forexPairs.exotics || []),
    ...(forexPairs.indices || []),
    ...(forexPairs.metals || []),
    ...(forexPairs.crypto || []),
    ...(cryptoPairs || []).slice(0, 100 - (forexPairs.majors?.length || 0) - (forexPairs.metals?.length || 0) - (forexPairs.indices?.length || 0) - (forexPairs.crypto?.length || 0))
  ].slice(0, 100);

  const getDefaultContractSize = (selectedAsset: string) => {
    if (forexPairs.crypto?.includes(selectedAsset) || cryptoPairs?.includes(selectedAsset)) return '1';
    if (forexPairs.metals?.includes(selectedAsset)) return '100';
    if (forexPairs.indices?.includes(selectedAsset)) return '100';
    return '100000'; // Default for forex pairs
  };

  const handleAssetChange = (newAsset: string) => {
    setAsset(newAsset);
    setContractSize(getDefaultContractSize(newAsset));
  };

  // Prevent toggle group from closing when clicking inside custom leverage input
  const handleCustomLeverageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Function to capture screenshot of the shareable card
  const captureScreenshot = async () => {
    const element = document.getElementById('shareableCard');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#1A1F2C",
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `PipCraft-MaxLotSize-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Screenshot saved!",
        description: `Exported as ${link.download}`,
      });
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot.",
        variant: "destructive",
      });
    }
  };

  // Function to generate and copy a shareable link
  const generateShareableLink = () => {
    // In a real application, this would generate a unique link
    // For now, we'll simulate copying a link to clipboard
    const shareText = `Check my trading position: Max Lot Size ${maxLotSize.toFixed(2)} lots for ${asset} with ${customLeverage || leverage}:1 leverage on $${parseFloat(accountEquity).toLocaleString()} account balance! Calculate yours at pipcrafts.com`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Share text copied!",
        description: "Share text copied to clipboard.",
      });
    });
  };
  
  return (
    <div className="space-y-6 pb-12">
      {/* Header with gradient */}
      <div className="rounded-lg p-6 bg-gradient-to-r from-neon-purple/80 to-neon-blue/80 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-poppins">Max Lot Size Calculator</h1>
        <p className="mt-2 text-white/90">Find your exact position cap – trade smarter.</p>
      </div>
      
      {/* Main Calculator Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Input Group: Account Balance */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Account Balance (USD)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your available trading account balance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input 
                type="number"
                value={accountEquity}
                onChange={(e) => setAccountEquity(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
                min="0"
              />
            </div>

            {/* Input Group: Leverage */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Leverage
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Trading leverage ratio (e.g., 30:1 means 30× leverage)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <ToggleGroup 
                type="single" 
                value={customLeverage ? 'custom' : leverage}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setCustomLeverage(leverage);
                  } else if (value) {
                    setLeverage(value);
                    setCustomLeverage('');
                  }
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="30">30:1</ToggleGroupItem>
                <ToggleGroupItem value="50">50:1</ToggleGroupItem>
                <ToggleGroupItem value="100">100:1</ToggleGroupItem>
                <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
              </ToggleGroup>
              {customLeverage && (
                <Input
                  type="number"
                  value={customLeverage}
                  onChange={(e) => setCustomLeverage(e.target.value)}
                  onClick={handleCustomLeverageClick}
                  className="bg-secondary/50 border-input/40 input-glow mt-2"
                  min="1"
                  placeholder="Enter custom leverage"
                />
              )}
            </div>

            {/* Input Group: Asset to Trade */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Asset to Trade
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the trading instrument</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={asset} 
                onValueChange={handleAssetChange}
              >
                <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-popover/95 backdrop-blur-sm">
                  <SelectGroup>
                    <SelectLabel>Forex Majors</SelectLabel>
                    {forexPairs.majors?.map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Metals</SelectLabel>
                    {forexPairs.metals?.map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Indices</SelectLabel>
                    {forexPairs.indices?.map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Crypto</SelectLabel>
                    {forexPairs.crypto?.concat(cryptoPairs || []).slice(0, 50).map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Minors & Exotics</SelectLabel>
                    {[...(forexPairs.minors || []), ...(forexPairs.exotics || [])].slice(0, 30).map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Input Group: Current Price */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Current Market Price
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current market price of the selected asset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input 
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
                min="0.0001"
                step="0.0001"
              />
            </div>

            {/* Input Group: Contract Size */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Contract Size
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Standard contract sizes: Forex (100,000), Indices (100), Crypto (1)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input 
                type="number"
                value={contractSize}
                onChange={(e) => setContractSize(e.target.value)}
                className="bg-secondary/50 border-input/40 input-glow"
                min="1"
              />
            </div>
          </div>

          <div>
            {/* Result Display Card */}
            <div className="bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 flex flex-col justify-center dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)] mb-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Maximum Lot Size Allowed</h3>
                  <p className="text-3xl font-bold text-[#00ff94]">
                    {maxLotSize.toFixed(2)} lots
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Formula:</p>
                  <p className="font-mono mt-1">
                    = (${parseFloat(accountEquity).toLocaleString()} × {customLeverage || leverage}) / ({contractSize} × {currentPrice})
                  </p>
                </div>
              </div>
            </div>

            {/* Shareable Card */}
            <div id="shareableCard" className="bg-gradient-to-b from-[#1A1F2C] to-[#252a3a] rounded-xl p-6 border border-white/5 shadow-lg mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">PipCraft</h4>
                  <p className="text-xs text-white/70">pipcrafts.com</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-neon-green to-neon-purple flex items-center justify-center">
                  <span className="text-xs font-bold">PC</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs">🔢</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Account Equity</p>
                    <p className="font-medium">${parseFloat(accountEquity).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs">📈</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Leverage</p>
                    <p className="font-medium">{customLeverage || leverage}:1</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs">💹</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Pair</p>
                    <p className="font-medium">{asset}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Max Lot Size</p>
                    <p className="font-medium text-neon-green">{maxLotSize.toFixed(2)} Lots</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-white/70 pt-2 border-t border-white/10">
                Calculated with PipCraft – The Trader's Toolkit
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-neon-purple/80 to-neon-blue/80 hover:from-neon-purple hover:to-neon-blue"
                onClick={captureScreenshot}
              >
                <Camera className="mr-2 h-4 w-4" /> Export as Screenshot
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-neon-blue/80 to-neon-green/80 hover:from-neon-blue hover:to-neon-green"
                onClick={generateShareableLink}
              >
                <Share2 className="mr-2 h-4 w-4" /> Generate Shareable Image
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedMaxLotSizeCalculator;
